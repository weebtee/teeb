import { Message, TextChannel } from 'discord.js';
import { SimpleGit } from 'simple-git';

module.exports = {
  name: 'version',
  description: 'commit ver',
  async execute(message: Message, args: string[], git: SimpleGit) {
    try {
      const commit = await git.revparse(['HEAD']);

      if (message.channel instanceof TextChannel) {
        await message.channel.send(`Git commit: ${commit}`);
      } else {
        await message.reply('This command can only be used in a text channel.');
      }
    } catch (error) {
      console.error('Error fetching git version:', error);
      await message.reply('Failed to fetch git version.');
    }
  }
};

