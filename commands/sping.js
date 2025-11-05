// src/commands/sping.js
export const name = 'sping';
export const description = 'Check the bot latency.';

export async function executeSlash(interaction) {
  const sent = await interaction.reply({
    content: '🏓 Pinging...',
    fetchReply: true,
  });
  await interaction.editReply(
    `🏓 Pong! Latency is ${sent.createdTimestamp - interaction.createdTimestamp}ms`
  );
}

export async function execute(message) {
  const sent = await message.reply('🏓 Pinging...');
  await sent.edit(
    `🏓 Pong! Latency is ${sent.createdTimestamp - message.createdTimestamp}ms`
  );
}
