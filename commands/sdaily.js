// src/commands/sdaily.js
export const name = 'sdaily';
export const description = 'Claim your daily Skill Points reward.';

export async function executeSlash(interaction) {
  const reward = 500;
  await interaction.reply({
    content: `🎁 You claimed your daily reward of **${reward} Skill Points**! Come back tomorrow!`,
    ephemeral: true,
  });
}

export async function execute(message) {
  const reward = 500;
  await message.reply(
    `🎁 You claimed your daily reward of **${reward} Skill Points**! Come back tomorrow!`
  );
}
