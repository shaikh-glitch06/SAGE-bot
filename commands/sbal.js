// src/commands/sbal.js
export const name = 'sbal';
export const description = 'Check your Skill Points balance.';

export async function executeSlash(interaction) {
  // Placeholder — replace later with DB lookup
  const points = 500;
  await interaction.reply({
    content: `💰 You currently have **${points} Skill Points**.`,
    ephemeral: true,
  });
}

export async function execute(message) {
  const points = 500;
  await message.reply(`💰 You currently have **${points} Skill Points**.`);
}
