export function calculateXPForLevel(level) {
  const baseXP = 100;
  const exponent = 1.5;
  return Math.floor(baseXP * Math.pow(level, exponent));
}

export function getLevelFromXP(xp) {
  let level = 1;
  let totalXPNeeded = 0;

  while (totalXPNeeded <= xp && level < 120) {
    totalXPNeeded += calculateXPForLevel(level);
    if (totalXPNeeded <= xp) {
      level++;
    }
  }

  return level;
}

export function getXPProgress(xp) {
  const level = getLevelFromXP(xp);
  let totalXPForCurrentLevel = 0;

  for (let i = 1; i < level; i++) {
    totalXPForCurrentLevel += calculateXPForLevel(i);
  }

  const xpIntoCurrentLevel = xp - totalXPForCurrentLevel;
  const xpNeededForNextLevel = calculateXPForLevel(level);

  return {
    level,
    currentLevelXP: xpIntoCurrentLevel,
    nextLevelXP: xpNeededForNextLevel,
    percentage: Math.floor((xpIntoCurrentLevel / xpNeededForNextLevel) * 100),
  };
}

export function calculateStreakBonus(streak) {
  return Math.min(Math.floor(streak), 150);
}

export function isValidMessage(content, minLength = 5) {
  if (!content || content.length < minLength) {
    return false;
  }

  const urlPattern = /(https?:\/\/[^\s]+)/g;
  const contentWithoutUrls = content.replace(urlPattern, '').trim();

  if (contentWithoutUrls.length < minLength) {
    return false;
  }

  return true;
}

export function formatNumber(num) {
  return num.toLocaleString();
}

export function getTimeDifference(date1, date2) {
  return Math.floor((date2 - date1) / 1000);
}

export function formatDuration(seconds) {
  if (seconds < 60) {
    return `${seconds} second${seconds !== 1 ? 's' : ''}`;
  }
  
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) {
    return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
  }
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (remainingMinutes === 0) {
    return `${hours} hour${hours !== 1 ? 's' : ''}`;
  }
  
  return `${hours} hour${hours !== 1 ? 's' : ''} and ${remainingMinutes} minute${remainingMinutes !== 1 ? 's' : ''}`;
}

export function getProgressBar(current, max, length = 10) {
  const filled = Math.floor((current / max) * length);
  const empty = length - filled;
  return '█'.repeat(filled) + '░'.repeat(empty);
}

export function isNewAccount(accountCreatedAt, minDays = 7) {
  const now = new Date();
  const accountAge = (now - accountCreatedAt) / (1000 * 60 * 60 * 24);
  return accountAge < minDays;
}
