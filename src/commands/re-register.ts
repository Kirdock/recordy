import { SlashCommandBuilder } from 'discord.js';
import { Command, registerApplicationCommands, unregisterApplicationCommands } from '../utils/appCommands';


const command: Command =  {
    data: new SlashCommandBuilder()
        .setName('re-register')
        .setDescription('Command for re-registering slash commands')
        .toJSON(),
    async execute(interaction) {
        await unregisterApplicationCommands(interaction.client);
        await registerApplicationCommands(interaction.client);
        return 're-registered';
    },
};

export default command;
