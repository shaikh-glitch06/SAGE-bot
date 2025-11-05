// handlers/commandHandler.js
import fs from 'fs';
import path from 'path';
import { Collection } from 'discord.js';

export async function loadCommands(client) {
  client.commands = client.commands || new Collection();

  try {
    const commandsDir = path.join(process.cwd(), 'src', 'commands');
    if (!fs.existsSync(commandsDir)) {
      console.log('⚠️ commands directory not found, skipping command load (placeholder).');
      return;
    }

    const files = fs.readdirSync(commandsDir).filter(f => f.endsWith('.js'));
    for (const file of files) {
      try {
        const filePath = path.join(commandsDir, file);
        const { default: cmd } = await import(`file://${filePath}`);
        if (!cmd || !cmd.name) continue;
        client.commands.set(cmd.name, cmd);
      } catch (e) {
        console.warn(`Failed loading command ${file}:`, e.message);
      }
    }

    console.log(`Loaded ${client.commands.size} commands (placeholder loader).`);
  } catch (err) {
    console.error('Error in loadCommands placeholder:', err);
  }
}
