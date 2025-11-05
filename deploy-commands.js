import { REST, Routes } from 'discord.js';

export async function registerCommands(client) {
  const commands = [];
  
  client.commands.forEach(command => {
    if (command.data) {
      commands.push(command.data.toJSON());
    }
  });
  
  if (commands.length === 0) {
    console.log('No slash commands to register');
    return;
  }
  
  const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);
  
  try {
    console.log(`Started refreshing ${commands.length} application (/) commands.`);
    
    const guilds = client.guilds.cache.map(guild => guild.id);
    
    for (const guildId of guilds) {
      await rest.put(
        Routes.applicationGuildCommands(process.env.DISCORD_CLIENT_ID, guildId),
        { body: commands }
      );
    }
    
    console.log(`Successfully reloaded application (/) commands.`);
  } catch (error) {
    console.error('Error registering slash commands:', error);
  }
}
