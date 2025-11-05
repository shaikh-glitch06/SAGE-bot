import { pgTable, text, integer, timestamp, boolean, jsonb, unique } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  userId: text("user_id").primaryKey(),
  username: text("username").notNull(),
  skillPoints: integer("skill_points").notNull().default(0),
  xp: integer("xp").notNull().default(0),
  level: integer("level").notNull().default(1),
  streak: integer("streak").notNull().default(0),
  lastDailyClaim: timestamp("last_daily_claim"),
  lastTrainUse: timestamp("last_train_use"),
  trainUsesToday: integer("train_uses_today").notNull().default(0),
  trainResetDate: timestamp("train_reset_date"),
  lastXpMessageTime: timestamp("last_xp_message_time"),
  equippedWallpaper: text("equipped_wallpaper"),
  joinDate: timestamp("join_date").notNull().defaultNow(),
  onboardingAnswers: jsonb("onboarding_answers"),
  selectedSkills: jsonb("selected_skills").default([]),
  lastSkillSwitch: timestamp("last_skill_switch"),
  proficiency: text("proficiency"),
  goals: text("goals"),
});

export const wallpapers = pgTable("wallpapers", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(),
  price: integer("price"),
  isEventExclusive: boolean("is_event_exclusive").notNull().default(false),
  isActive: boolean("is_active").notNull().default(true),
});

export const userWallpapers = pgTable("user_wallpapers", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  userId: text("user_id").notNull().references(() => users.userId),
  wallpaperId: text("wallpaper_id").notNull().references(() => wallpapers.id),
  acquiredAt: timestamp("acquired_at").notNull().defaultNow(),
  source: text("source").notNull(),
}, (table) => ({
  userWallpaperUnique: unique().on(table.userId, table.wallpaperId),
}));

export const transactions = pgTable("transactions", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  fromUserId: text("from_user_id").references(() => users.userId),
  toUserId: text("to_user_id").references(() => users.userId),
  amount: integer("amount").notNull(),
  type: text("type").notNull(),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
  notes: text("notes"),
});

export const skills = pgTable("skills", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  isActive: boolean("is_active").notNull().default(true),
  addedAt: timestamp("added_at").notNull().defaultNow(),
});

export const skillSwitchHistory = pgTable("skill_switch_history", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  userId: text("user_id").notNull().references(() => users.userId),
  previousSkills: jsonb("previous_skills"),
  newSkills: jsonb("new_skills"),
  switchedAt: timestamp("switched_at").notNull().defaultNow(),
});

export const config = pgTable("config", {
  key: text("key").primaryKey(),
  value: jsonb("value").notNull(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const excludedChannels = pgTable("excluded_channels", {
  channelId: text("channel_id").primaryKey(),
  reason: text("reason"),
  addedAt: timestamp("added_at").notNull().defaultNow(),
});
