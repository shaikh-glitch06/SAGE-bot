import { Client, GatewayIntentBits, REST, Routes, ActivityType } from 'discord.js';
import dotenv from 'dotenv';
import { initializeDefaultData } from '../server/storage.js';
import { handleMessageCreate } from './events/messageCreate.js';
import { handleGuildMemberAdd } from './events/guildMemberAdd.js';
import { handleInteractionCreate } from './events/interactionCreate.js';
import { commands } from './commands/index.js';

dotenv.config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessageReactions,
  ],
});

client.once('ready', async () => {
  console.log(`✅ SAGE Bot is online as ${client.user.tag}`);
  
  client.user.setActivity('SkillVerse | Shelp', { type: ActivityType.Watching });
  
  await initializeDefaultData();
  console.log('✅ Default data initialized');
  
  if (process.env.DISCORD_TOKEN && process.env.DISCORD_APPLICATION_ID) {
    await registerCommands();
  }
});

async function registerCommands() {
  try {
    const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);
    
    const commandData = commands.map(cmd => cmd.data.toJSON());
    
    console.log(`🔄 Registering ${commandData.length} slash commands...`);
    
    await rest.put(
      Routes.applicationCommands(process.env.DISCORD_APPLICATION_ID),
      { body: commandData }
    );
    
    console.log('✅ Slash commands registered successfully');
  } catch (error) {
    console.error('❌ Error registering slash commands:', error);
  }
}

client.on('messageCreate', handleMessageCreate);
client.on('guildMemberAdd', handleGuildMemberAdd);
client.on('interactionCreate', handleInteractionCreate);

if (!process.env.DISCORD_TOKEN) {
  console.error('❌ DISCORD_TOKEN is not set in environment variables');
  process.exit(1);
}

client.login(process.env.DISCORD_TOKEN);
