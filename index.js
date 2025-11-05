import { Client, GatewayIntentBits, Collection, Partials } from 'discord.js';
import { db } from './storage.js';
import cron from 'node-cron';
import { initializeDatabase, resetDailyTrainUses } from './database/db.js';
import { registerCommands } from './deploy-commands.js';
import { loadCommands } from './handlers/commandHandler.js';
import { handleMessageXP } from './handlers/xpHandler.js';
import { handleMemberJoin } from './handlers/onboardingHandler.js';

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessageReactions
  ],
  partials: [Partials.Message, Partials.Channel, Partials.Reaction]
});

client.commands = new Collection();

async function startBot() {
  try {
    console.log('🚀 Starting Discord Bot...');
    
    await initializeDatabase();
    console.log('✅ Database ready');
    
    await loadCommands(client);
    console.log('✅ Commands loaded');
    
    cron.schedule('0 0 * * *', async () => {
      console.log('🔄 Running daily reset...');
      await resetDailyTrainUses();
    });
    console.log('✅ Scheduled tasks configured');
    
    const token = process.env.DISCORD_TOKEN;
    if (!token) {
      throw new Error('DISCORD_TOKEN not found in environment variables');
    }
    
    await client.login(token);
    
  } catch (error) {
    console.error('❌ Error starting bot:', error);
    process.exit(1);
  }
}

client.once('ready', async () => {
  console.log(`✅ Bot is online as ${client.user.tag}`);
  
  if (process.env.DISCORD_CLIENT_ID) {
    try {
      await registerCommands(client);
      console.log('✅ Slash commands registered');
    } catch (error) {
      console.error('⚠️  Could not register slash commands:', error.message);
    }
  }
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  
  const prefix = 'S';
  
  if (message.content.startsWith(prefix)) {
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();
    
    const command = client.commands.get(commandName) || 
                   client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
    
    if (command && command.execute) {
      try {
        await command.execute(message, args);
      } catch (error) {
        console.error(`Error executing command ${commandName}:`, error);
        await message.reply('There was an error executing that command.');
      }
    }
  } else {
    await handleMessageXP(message);
  }
});

client.on('interactionCreate', async (interaction) => {
  if (interaction.isChatInputCommand()) {
    const command = client.commands.get(interaction.commandName);
    
    if (!command || !command.executeSlash) return;
    
    try {
      await command.executeSlash(interaction);
    } catch (error) {
      console.error(`Error executing slash command ${interaction.commandName}:`, error);
      const reply = { content: 'There was an error executing this command.', ephemeral: true };
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp(reply);
      } else {
        await interaction.reply(reply);
      }
    }
  } else if (interaction.isModalSubmit()) {
    if (interaction.customId === 'onboarding_modal') {
      await handleMemberJoin(interaction);
    } else if (interaction.customId.startsWith('profile_edit_modal')) {
      const editProfileCommand = client.commands.get('profile');
      if (editProfileCommand && editProfileCommand.handleEditModal) {
        await editProfileCommand.handleEditModal(interaction);
      }
    }
  }
});

client.on('guildMemberAdd', async (member) => {
  try {
    const { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = await import('discord.js');
    
    const modal = new ModalBuilder()
      .setCustomId('onboarding_modal')
      .setTitle('Welcome! Tell us about yourself');
    
    const skillInput = new TextInputBuilder()
      .setCustomId('skill_interest')
      .setLabel('What skill are you most interested in?')
      .setStyle(TextInputStyle.Short)
      .setPlaceholder('e.g., Chess, Art, Writing, Fitness, Coding')
      .setRequired(true)
      .setMaxLength(100);
    
    const proficiencyInput = new TextInputBuilder()
      .setCustomId('proficiency_level')
      .setLabel('What is your current proficiency level?')
      .setStyle(TextInputStyle.Short)
      .setPlaceholder('e.g., Beginner, Intermediate, Advanced')
      .setRequired(true)
      .setMaxLength(50);
    
    const goalsInput = new TextInputBuilder()
      .setCustomId('goals')
      .setLabel('What are your learning goals?')
      .setStyle(TextInputStyle.Paragraph)
      .setPlaceholder('Share what you hope to achieve...')
      .setRequired(true)
      .setMaxLength(500);
    
    const firstRow = new ActionRowBuilder().addComponents(skillInput);
    const secondRow = new ActionRowBuilder().addComponents(proficiencyInput);
    const thirdRow = new ActionRowBuilder().addComponents(goalsInput);
    
    modal.addComponents(firstRow, secondRow, thirdRow);
    
    const dmChannel = await member.createDM();
    await dmChannel.send({
      content: `Welcome to ${member.guild.name}! Please complete this quick onboarding to get started.`,
    });
    
  } catch (error) {
    console.error('Error sending onboarding modal:', error);
  }
});

startBot();
