import { Client, Events } from 'discord.js';
import { registerApplicationCommands } from './appCommands';

export function setupFallbackRegister(client: Client<true>): void {
    client.on(Events.MessageCreate, async (message) => {
        if(message.content === '.register') {
            await registerApplicationCommands(client);
            await message.reply('registered');
        }
    })
}