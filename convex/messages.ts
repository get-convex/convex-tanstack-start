import {
  MutationCtx,
  QueryCtx,
  action,
  internalMutation,
  mutation,
} from './_generated/server'
import { query } from './_generated/server'
import { api, internal } from './_generated/api.js'
import { v } from 'convex/values'

export const list = query(async (ctx, { cacheBust }) => {
  const _unused = cacheBust
  return await ctx.db.query('messages').collect()
})

export const listMessages = query({
  args: {
    cacheBust: v.optional(v.any()),
    channel: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const _unused = args.cacheBust
    const channelName = args.channel || 'chatty'
    return await latestMessagesFromChannel(ctx, channelName)
  },
})

async function channelByName(ctx: QueryCtx, channelName: string) {
  const channel = await ctx.db
    .query('channels')
    .withIndex('by_name', (q) => q.eq('name', channelName))
    .unique()
  if (!channel) throw new Error(`No such channel '${channelName}'`)
  return channel
}

async function latestMessagesFromChannel(
  ctx: QueryCtx,
  channelName: string,
  max = 20,
) {
  const channel = await channelByName(ctx, channelName)

  const messages = await ctx.db
    .query('messages')
    .withIndex('by_channel', (q) => q.eq('channel', channel._id))
    .order('desc')
    .take(max)
  const messagesWithAuthor = await Promise.all(
    messages.map(async (message) => {
      const user = await ctx.db.get(message.user)
      // Join the count of likes with the message data
      return { ...message, user: user?.name || 'anonymous' }
    }),
  )
  return messagesWithAuthor
}

export const count = query(
  async (
    ctx,
    { cacheBust, channel }: { cacheBust: unknown; channel: string },
  ) => {
    const _unused = cacheBust
    const channelName = channel || 'chatty'
    return (await latestMessagesFromChannel(ctx, channelName, 1000)).length
  },
)

export const listUsers = query(async (ctx, { cacheBust }) => {
  const _unused = cacheBust
  return await ctx.db.query('users').collect()
})

export const countUsers = query(async (ctx, { cacheBust }) => {
  const _unused = cacheBust
  return (await ctx.db.query('users').collect()).length
})

function choose(choices: string[]): string {
  return choices[Math.floor(Math.random() * choices.length)]
}

function madlib(strings: TemplateStringsArray, ...choices: any[]): string {
  return strings.reduce((result, str, i) => {
    return result + str + (choices[i] ? choose(choices[i]) : '')
  }, '')
}

const greetings = ['hi', 'Hi', 'hello', 'hey']
const names = ['James', 'Jamie', 'Emma', 'Nipunn']
const punc = ['...', '-', ',', '!', ';']
const text = [
  'how was your weekend?',
  "how's the weather in SF?",
  "what's your favorite ice cream place?",
  "I'll be late to make the meeting tomorrow morning",
  "Could you let the customer know we've fixed their issue?",
]

export const sendGeneratedMessage = internalMutation(async (ctx) => {
  const body = madlib`${greetings} ${names}${punc} ${text}`
  const user = await ctx.db.insert('users', {
    name: 'User ' + Math.floor(Math.random() * 1000),
  })
  const channel = (await channelByName(ctx, 'chatty'))._id
  await ctx.db.insert('messages', { body, user, channel })
})

// TODO concurrency here
export const sendGeneratedMessages = action({
  args: { num: v.number() },
  handler: async (ctx, { num }: { num: number }) => {
    await ctx.runMutation(api.messages.clear)
    for (let i = 0; i < num; i++) {
      await ctx.runMutation(internal.messages.sendGeneratedMessage)
    }
  },
})

export const clear = mutation(async (ctx) => {
  await Promise.all([
    ...(await ctx.db.query('messages').collect()).map((message) =>
      ctx.db.delete(message._id),
    ),
    ...(await ctx.db.query('users').collect()).map((user) =>
      ctx.db.delete(user._id),
    ),
    ...(await ctx.db.query('channels').collect()).map((channel) =>
      ctx.db.delete(channel._id),
    ),
    ...(await ctx.db.query('channelMembers').collect()).map((membership) =>
      ctx.db.delete(membership._id),
    ),
  ])
})

async function ensureChannel(ctx: MutationCtx, name: string) {
  const existing = await ctx.db
    .query('channels')
    .withIndex('by_name', (q) => q.eq('name', name))
    .unique()
  if (!existing) {
    await ctx.db.insert('channels', { name })
  }
}

export const seed = internalMutation(async (ctx) => {
  await ensureChannel(ctx, 'chatty')
  await ensureChannel(ctx, 'sf')
  await ensureChannel(ctx, 'nyc')
  await ensureChannel(ctx, 'seattle')
})

export const sendMessage = mutation(
  async (
    ctx,
    {
      user,
      channel = 'chatty',
    }: { user: string; body: string; channel: string },
  ) => {
    // userId ought to match User /d+
    // until every user gets their own channel, use simulated messages
    const cleanBody = madlib`${greetings} ${names}${punc} ${text}`
    const existingUser = await ctx.db
      .query('users')
      .withIndex('by_name')
      .filter((q) => q.eq(q.field('name'), user))
      .unique()
    let userId =
      existingUser?._id || (await ctx.db.insert('users', { name: user }))
    const channelId = (await channelByName(ctx, channel))._id
    await ctx.db.insert('messages', {
      user: userId,
      body: cleanBody,
      channel: channelId,
    })
  },
)

export const simulateTraffic = mutation(async (ctx) => {
  const simulation = await ctx.db.query('simulating').unique()
  const now = Date.now()
  const duration = 5000
  if (!simulation) {
    await ctx.db.insert('simulating', {
      finishingAt: now + duration,
    })
    await ctx.scheduler.runAfter(0, internal.messages.runSimulation)
  } else {
    await ctx.db.replace(simulation._id, {
      finishingAt: Math.max(simulation.finishingAt, now + duration),
    })
  }
})

export const runSimulation = internalMutation(async (ctx) => {
  const now = Date.now()
  const simulation = await ctx.db.query('simulating').unique()
  if (!simulation) {
    return
  }
  if (simulation.finishingAt < now) {
    await ctx.db.delete(simulation._id)
    return
  }
  const body = madlib`${greetings} ${names}${punc} ${text}`
  const user = await ctx.db.insert('users', {
    name: 'User ' + Math.floor(Math.random() * 1000),
  })
  const channel = (await channelByName(ctx, 'chatty'))._id
  await ctx.db.insert('messages', { body, user: user, channel })
  await ctx.scheduler.runAfter(500, internal.messages.runSimulation)
})

export const isSimulatingTraffic = query(async (ctx) => {
  return !!(await ctx.db.query('simulating').collect()).length
})
