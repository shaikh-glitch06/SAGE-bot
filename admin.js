import { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } from 'discord.js';
import { setUserSkillPoints, getUser, createUser, setConfig, getConfig, addExcludedChannel, removeExcludedChannel, getExcludedChannels, toggleShopItem, getShopItems } from '../database/db.js';
import { formatNumber } from '../utils/helpers.js';

export default {
  name: 'admin',
  description: 'Admin commands for managing the bot (Admin only)',
  aliases: [],
  data: new SlashCommandBuilder()
    .setName('admin')
    .setDescription('Admin commands for managing the bot')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommand(subcommand =>
      subcommand
        .setName('setbalance')
        .setDescription('Set a user\'s Skill Points balance')
        .addUserOption(option =>
          option.setName('user')
            .setDescription('User to set balance for')
            .setRequired(true)
        )
        .addIntegerOption(option =>
          option.setName('amount')
            .setDescription('Amount to set')
            .setRequired(true)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('togglexp')
        .setDescription('Enable or disable the XP system')
        .addBooleanOption(option =>
          option.setName('enabled')
            .setDescription('Enable XP system?')
            .setRequired(true)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('setxprate')
        .setDescription('Set XP rates')
        .addStringOption(option =>
          option.setName('type')
            .setDescription('Type of XP rate to set')
            .setRequired(true)
            .addChoices(
              { name: 'Per Message', value: 'xp_per_message' },
              { name: 'Per Emoji', value: 'xp_per_emoji' },
              { name: 'Per Sticker', value: 'xp_per_sticker' }
            )
        )
        .addIntegerOption(option =>
          option.setName('amount')
            .setDescription('XP amount')
            .setRequired(true)
            .setMinValue(0)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('excludechannel')
        .setDescription('Exclude a channel from XP gains')
        .addChannelOption(option =>
          option.setName('channel')
            .setDescription('Channel to exclude')
            .setRequired(true)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('includechannel')
        .setDescription('Include a channel for XP gains')
        .addChannelOption(option =>
          option.setName('channel')
            .setDescription('Channel to include')
            .setRequired(true)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('listexcluded')
        .setDescription('List all excluded channels')
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('viewstats')
        .setDescription('View a user\'s detailed stats')
        .addUserOption(option =>
          option.setName('user')
            .setDescription('User to view stats for')
            .setRequired(true)
        )
    ),
  
  async execute(message, args) {
    if (!message.member.permissions.has(PermissionFlagsBits.Administrator)) {
      return message.reply('❌ You need Administrator permissions to use this command.');
    }
    
    return message.reply('Please use the slash command `/admin` for admin functions.');
  },
  
  async executeSlash(interaction) {
    await interaction.deferReply({ ephemeral: true });
    
    const subcommand = interaction.options.getSubcommand();
    
    switch (subcommand) {
      case 'setbalance':
        await setBalance(interaction);
        break;
      case 'togglexp':
        await toggleXP(interaction);
        break;
      case 'setxprate':
        await setXPRate(interaction);
        break;
      case 'excludechannel':
        await excludeChannel(interaction);
        break;
      case 'includechannel':
        await includeChannel(interaction);
        break;
      case 'listexcluded':
        await listExcluded(interaction);
        break;
      case 'viewstats':
        await viewStats(interaction);
        break;
    }
  }
};

async function setBalance(interaction) {
  try {
    const targetUser = interaction.options.getUser('user');
    const amount = interaction.options.getInteger('amount');
    
    let userData = await getUser(targetUser.id);
    if (!userData) {
      userData = await createUser(targetUser.id, targetUser.username);
    }
    
    await setUserSkillPoints(targetUser.id, amount);
    
    await interaction.editReply(`✅ Set ${targetUser.username}'s balance to **${formatNumber(amount)}** SP`);
    
  } catch (error) {
    console.error('Error setting balance:', error);
    await interaction.editReply('There was an error setting the balance.');
  }
}

async function toggleXP(interaction) {
  try {
    const enabled = interaction.options.getBoolean('enabled');
    
    await setConfig('xp_enabled', enabled.toString());
    
    await interaction.editReply(`✅ XP system is now **${enabled ? 'enabled' : 'disabled'}**`);
    
  } catch (error) {
    console.error('Error toggling XP:', error);
    await interaction.editReply('There was an error toggling the XP system.');
  }
}

async function setXPRate(interaction) {
  try {
    const type = interaction.options.getString('type');
    const amount = interaction.options.getInteger('amount');
    
    await setConfig(type, amount.toString());
    
    const typeName = type.replace('xp_per_', '').replace('_', ' ');
    await interaction.editReply(`✅ Set XP rate for ${typeName} to **${amount}** XP`);
    
  } catch (error) {
    console.error('Error setting XP rate:', error);
    await interaction.editReply('There was an error setting the XP rate.');
  }
}

async function excludeChannel(interaction) {
  try {
    const channel = interaction.options.getChannel('channel');
    
    await addExcludedChannel(channel.id, channel.name);
    
    await interaction.editReply(`✅ Excluded ${channel.name} from XP gains`);
    
  } catch (error) {
    console.error('Error excluding channel:', error);
    await interaction.editReply('There was an error excluding the channel.');
  }
}

async function includeChannel(interaction) {
  try {
    const channel = interaction.options.getChannel('channel');
    
    await removeExcludedChannel(channel.id);
    
    await interaction.editReply(`✅ Re-enabled XP gains in ${channel.name}`);
    
  } catch (error) {
    console.error('Error including channel:', error);
    await interaction.editReply('There was an error including the channel.');
  }
}

async function listExcluded(interaction) {
  try {
    const excludedIds = await getExcludedChannels();
    
    if (excludedIds.length === 0) {
      await interaction.editReply('No channels are currently excluded from XP gains.');
      return;
    }
    
    const channelMentions = excludedIds.map(id => `<#${id}>`).join(', ');
    
    await interaction.editReply(`**Excluded Channels (${excludedIds.length}):**\n${channelMentions}`);
    
  } catch (error) {
    console.error('Error listing excluded channels:', error);
    await interaction.editReply('There was an error listing excluded channels.');
  }
}

async function viewStats(interaction) {
  try {
    const targetUser = interaction.options.getUser('user');
    
    let userData = await getUser(targetUser.id);
    if (!userData) {
      await interaction.editReply('User not found in database.');
      return;
    }
    
    const embed = new EmbedBuilder()
      .setColor('#E67E22')
      .setTitle(`📊 Admin Stats: ${targetUser.username}`)
      .addFields(
        { name: 'User ID', value: targetUser.id, inline: true },
        { name: 'Skill Points', value: formatNumber(userData.skill_points), inline: true },
        { name: 'Level', value: userData.level.toString(), inline: true },
        { name: 'Total XP', value: formatNumber(userData.xp), inline: true },
        { name: 'Daily Streak', value: `${userData.daily_streak} days`, inline: true },
        { name: 'Train Uses Today', value: `${userData.train_uses_today}/10`, inline: true },
        { name: 'Last Daily', value: userData.last_daily ? new Date(userData.last_daily).toLocaleString() : 'Never', inline: false },
        { name: 'Last Train', value: userData.last_train ? new Date(userData.last_train).toLocaleString() : 'Never', inline: false },
        { name: 'Account Created', value: new Date(userData.created_at).toLocaleString(), inline: false }
      )
      .setThumbnail(targetUser.displayAvatarURL())
      .setTimestamp();
    
    await interaction.editReply({ embeds: [embed] });
    
  } catch (error) {
    console.error('Error viewing stats:', error);
    await interaction.editReply('There was an error retrieving stats.');
  }
}
