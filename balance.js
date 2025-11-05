import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { getUser, createUser } from '../database/db.js';
import { formatNumber } from '../utils/helpers.js';
import { sendResponse } from '../utils/responseHelper.js';

export default {
  name: 'balance',
  description: 'Check your Skill Points balance',
  aliases: ['bal'],
  data: new SlashCommandBuilder()
    .setName('balance')
    .setDescription('Check your Skill Points balance')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('User to check balance for')
        .setRequired(false)
    ),
  
  async execute(message, args) {
    const targetUser = message.mentions.users.first() || message.author;
    await showBalance(targetUser, message);
  },
  
  async executeSlash(interaction) {
    const targetUser = interaction.options.getUser('user') || interaction.user;
    await showBalance(targetUser, interaction);
  }
};

async function showBalance(user, context) {
  try {
    let userData = await getUser(user.id);
    if (!userData) {
      userData = await createUser(user.id, user.username);
    }
    
    const embed = new EmbedBuilder()
      .setColor('#4169E1')
      .setTitle(`💰 ${user.username}'s Balance`)
      .setDescription(`**${formatNumber(userData.skill_points)}** Skill Points`)
      .addFields(
        { name: '🔥 Daily Streak', value: `${userData.daily_streak} days`, inline: true },
        { name: '⭐ Level', value: `${userData.level}`, inline: true }
      )
      .setThumbnail(user.displayAvatarURL())
      .setTimestamp();
    
    await sendResponse(context, { embeds: [embed] });
    
  } catch (error) {
    console.error('Error showing balance:', error);
    await sendResponse(context, 'There was an error retrieving the balance.');
  }
}
