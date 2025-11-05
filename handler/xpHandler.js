// handlers/xpHandler.js
// Placeholder XP handler. Replace with full logic later.

export async function handleMessageXP(message) {
  try {
    // Placeholder: ignore bots and do nothing
    if (!message || message.author?.bot) return;
    // Optional: log for debugging in dev
    // console.log(`XP placeholder processed message from ${message.author.tag}`);
    return;
  } catch (err) {
    console.error('XP handler error (placeholder):', err);
  }
}
