// src/commands/shelp.js
export const name = 'shelp';
export const description = 'Shows a list of available commands.';

export async function executeSlash(interaction) {
  const text =
    "🧭 **SkillVerse Bot Commands**\n\n" +
    "💰 `/sbal` — Check your Skill Points balance\n" +
    "🎁 `/sdaily` — Claim your daily Skill Points\n" +
    "🏓 `/sping` — Test if the bot is responding\n" +
    "📘 `/shelp` — Show this help menu";
  await interaction.reply({ content: text, ephemeral: true });
}

export async function execute(message) {
  const text =
    "🧭 **SkillVerse Bot Commands**\n" +
    "`Sbal` — Check your Skill Points balance\n" +
    "`Sdaily` — Claim your daily Skill Points\n" +
    "`Sping` — Test if the bot is responding\n" +
    "`Shelp` — Show this help menu";
  await message.reply(text);
}
