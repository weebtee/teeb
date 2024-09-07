import { Client, GatewayIntentBits } from 'discord.js';
import { readdirSync } from 'fs';
import { join } from 'path';
import * as dotenv from 'dotenv';
import simpleGit from 'simple-git';

dotenv.config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

const git = simpleGit();
const prefix = 'te';

const commands = new Map<string, any>();
const commandDir = join(__dirname, '..', 'cmds');
const commandFolders = readdirSync(commandDir);

for (const folder of commandFolders) {
  const commandFiles = readdirSync(join(commandDir, folder)).filter(file => file.endsWith('.ts'));

  for (const file of commandFiles) {
    const command = require(join(commandDir, folder, file));
    commands.set(command.name, command);
  }
}

client.on('messageCreate', async message => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const commandName = args.shift()?.toLowerCase();

  if (commandName && commands.has(commandName)) {
    try {
      await commands.get(commandName).execute(message, args, git);
    } catch (error) {
      console.error(error);
      message.reply('There was an error executing that command!');
    }
  }
});

client.once('ready', () => {
  console.log(`Logged in as ${client.user?.tag}!`);
});

client.login(process.env.TOKEN);
