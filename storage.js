// storage.js
// Minimal placeholder storage layer so the bot can start.
// Replace with your real DB logic later (Postgres/SQLite).

export const db = {}; // placeholder DB object

// Basic no-op implementations to avoid runtime crashes.
// These are intentionally simple and safe — they do NOT persist data.

const _users = new Map();

export async function ensureUser(discordId) {
  if (!_users.has(discordId)) {
    _users.set(discordId, {
      id: discordId,
      skillPoints: 0,
      level: 1,
      xp: 0,
      streak: 0,
      wallpapers: [],
      equipped: null,
      skills: [],
      joinedAt: Date.now(),
    });
  }
  return _users.get(discordId);
}

export async function getUser(discordId) {
  return _users.get(discordId) || null;
}

export async function addSkillPoints(discordId, amount) {
  const u = await ensureUser(discordId);
  u.skillPoints = (u.skillPoints || 0) + Number(amount || 0);
  return u.skillPoints;
}

export async function setSkillPoints(discordId, amount) {
  const u = await ensureUser(discordId);
  u.skillPoints = Number(amount || 0);
  return u.skillPoints;
}

export async function addWallpaperToUser(discordId, wallpaperId) {
  const u = await ensureUser(discordId);
  if (!u.wallpapers.includes(wallpaperId)) u.wallpapers.push(wallpaperId);
  return u.wallpapers;
}

export async function equipWallpaper(discordId, wallpaperId) {
  const u = await ensureUser(discordId);
  if (u.wallpapers.includes(wallpaperId)) {
    u.equipped = wallpaperId;
    return true;
  }
  return false;
}

export async function recordTransaction(tx) {
  // no-op placeholder: in real DB you would insert into transactions
  console.log('recordTransaction (placeholder):', tx ? { ...tx, details: undefined } : tx);
  return true;
}

export async function getInventory(discordId) {
  const u = await ensureUser(discordId);
  return u.wallpapers || [];
}

export async function setProfile(discordId, profile) {
  const u = await ensureUser(discordId);
  Object.assign(u, profile);
  return u;
}

export async function resetDailyTrainUsesAll() {
  // placeholder for scheduled reset
  console.log('resetDailyTrainUsesAll placeholder called');
  return;
}

// Export a safe list for other modules to import
export default {
  db,
  ensureUser,
  getUser,
  addSkillPoints,
  setSkillPoints,
  addWallpaperToUser,
  equipWallpaper,
  recordTransaction,
  getInventory,
  setProfile,
  resetDailyTrainUsesAll,
};
