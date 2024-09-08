import { Message, TextChannel, DMChannel } from 'discord.js';
import { translate } from '@vitalets/google-translate-api';

module.exports = {
  name: 'translate',
  description: 'it translates stuff',
  async execute(message: Message, args: string[]) {
    if (!args.length) {
      return message.reply('give me text');
    }

    const textToTranslate = args.join(' ');

    try {
      const result = await translate(textToTranslate, { to: 'en' });

      if (message.channel instanceof TextChannel || message.channel instanceof DMChannel) {
        await message.channel.send(`Translated: ${result.text}`);
      } else {
        await message.reply("can't do it here (for some reason)");
      }
    } catch (error) {
      console.error('Error translating text:', error);
      await message.reply('Failed to translate the text.');
    }
  }
};
