// src/handlers/xpHandler.js
// Minimal placeholder XP handler so the bot won't crash.
// Replace with full XP logic later.

export async function handleMessageXP(message) {
  try {
    if (!message || message.author?.bot) return;

    // Basic anti-spam: ignore very short messages
    if (!message.content || message.content.trim().length < 3) return;

    // If you want to debug in Render logs, uncomment:
    // console.log(`XP placeholder: ${message.author.tag} -> ${message.content.slice(0,40)}`);

    // No real XP is given in this placeholder. Real logic will:
    // - check cooldown
    // - award XP based on message length / emojis
    // - persist to DB
    return;
  } catch (err) {
    console.error('XP handler (placeholder) error:', err);
  }
}
