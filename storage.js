import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq, desc, sql, and } from "drizzle-orm";
import * as schema from "../shared/schema.js";

const connectionString = process.env.DATABASE_URL;
const client = postgres(connectionString);
export const db = drizzle(client, { schema });

export async function getOrCreateUser(userId, username) {
  const existingUser = await db.query.users.findFirst({
    where: eq(schema.users.userId, userId),
  });

  if (existingUser) {
    if (existingUser.username !== username) {
      await db
        .update(schema.users)
        .set({ username })
        .where(eq(schema.users.userId, userId));
      return { ...existingUser, username };
    }
    return existingUser;
  }

  const [newUser] = await db
    .insert(schema.users)
    .values({
      userId,
      username,
      skillPoints: 0,
      xp: 0,
      level: 1,
      streak: 0,
      selectedSkills: [],
    })
    .returning();

  return newUser;
}

export async function getUserById(userId) {
  return await db.query.users.findFirst({
    where: eq(schema.users.userId, userId),
  });
}

export async function updateUser(userId, updates) {
  const [updated] = await db
    .update(schema.users)
    .set(updates)
    .where(eq(schema.users.userId, userId))
    .returning();
  return updated;
}

export async function addTransaction(fromUserId, toUserId, amount, type, notes = null) {
  const [transaction] = await db
    .insert(schema.transactions)
    .values({
      fromUserId,
      toUserId,
      amount,
      type,
      notes,
    })
    .returning();
  return transaction;
}

export async function getActiveSkills() {
  return await db.query.skills.findMany({
    where: eq(schema.skills.isActive, true),
  });
}

export async function getConfig(key) {
  const config = await db.query.config.findFirst({
    where: eq(schema.config.key, key),
  });
  return config?.value;
}

export async function setConfig(key, value) {
  const existing = await db.query.config.findFirst({
    where: eq(schema.config.key, key),
  });

  if (existing) {
    await db
      .update(schema.config)
      .set({ value, updatedAt: new Date() })
      .where(eq(schema.config.key, key));
  } else {
    await db.insert(schema.config).values({ key, value });
  }
}

export async function isChannelExcluded(channelId) {
  const excluded = await db.query.excludedChannels.findFirst({
    where: eq(schema.excludedChannels.channelId, channelId),
  });
  return !!excluded;
}

export async function getWallpaperById(wallpaperId) {
  return await db.query.wallpapers.findFirst({
    where: eq(schema.wallpapers.id, wallpaperId),
  });
}

export async function getUserWallpapers(userId) {
  return await db.query.userWallpapers.findMany({
    where: eq(schema.userWallpapers.userId, userId),
    with: {
      wallpaper: true,
    },
  });
}

export async function addUserWallpaper(userId, wallpaperId, source) {
  try {
    const [userWallpaper] = await db
      .insert(schema.userWallpapers)
      .values({
        userId,
        wallpaperId,
        source,
      })
      .returning();
    return userWallpaper;
  } catch (error) {
    return null;
  }
}

export async function getLeaderboard(type = 'skillPoints', limit = 10) {
  let orderBy;
  switch (type) {
    case 'skillPoints':
      orderBy = desc(schema.users.skillPoints);
      break;
    case 'streak':
      orderBy = desc(schema.users.streak);
      break;
    case 'level':
      orderBy = desc(schema.users.level);
      break;
    default:
      orderBy = desc(schema.users.skillPoints);
  }

  return await db.query.users.findMany({
    orderBy,
    limit,
  });
}

export async function recordSkillSwitch(userId, previousSkills, newSkills) {
  const [record] = await db
    .insert(schema.skillSwitchHistory)
    .values({
      userId,
      previousSkills,
      newSkills,
    })
    .returning();
  return record;
}

export async function initializeDefaultData() {
  const defaultSkills = [
    { id: 'chess', name: 'Chess' },
    { id: 'art', name: 'Art' },
    { id: 'writing', name: 'Writing' },
    { id: 'fitness', name: 'Fitness' },
    { id: 'coding', name: 'Coding' },
  ];

  for (const skill of defaultSkills) {
    const existing = await db.query.skills.findFirst({
      where: eq(schema.skills.id, skill.id),
    });
    if (!existing) {
      await db.insert(schema.skills).values(skill);
    }
  }

  const defaultWallpapers = [
    { id: 'sunset', name: 'Sunset Vista', type: 'static', price: 15000 },
    { id: 'mountain', name: 'Mountain Peak', type: 'static', price: 15000 },
    { id: 'ocean', name: 'Ocean Waves', type: 'static', price: 15000 },
    { id: 'forest', name: 'Forest Path', type: 'static', price: 15000 },
    { id: 'city', name: 'City Lights', type: 'static', price: 15000 },
    { id: 'space', name: 'Space Nebula', type: 'animated', price: null, isEventExclusive: false },
    { id: 'aurora', name: 'Aurora Borealis', type: 'animated', price: null, isEventExclusive: false },
  ];

  for (const wallpaper of defaultWallpapers) {
    const existing = await db.query.wallpapers.findFirst({
      where: eq(schema.wallpapers.id, wallpaper.id),
    });
    if (!existing) {
      await db.insert(schema.wallpapers).values(wallpaper);
    }
  }

  const defaultConfig = {
    xpPerMessage: 10,
    xpPerEmoji: 2,
    xpPerSticker: 5,
    xpMessageCooldown: 60,
    minMessageLength: 5,
    xpSystemEnabled: true,
    minAccountAge: 7,
  };

  const existingConfig = await getConfig('xpSettings');
  if (!existingConfig) {
    await setConfig('xpSettings', defaultConfig);
  }
}
