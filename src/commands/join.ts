import { Command } from '../utils/appCommands';
import { SlashCommandBuilder } from 'discord.js';
import { joinVoice } from '../utils/voice';

const command: Command = {
    data: new SlashCommandBuilder().setName('join').setDescription('Joins the voice channel the user is in').toJSON(),
    async execute(interaction): Promise<string> {
        if(!interaction.member) {
            return 'invalid member';
        }
        const guild = interaction.inCachedGuild() ? await interaction.guild.fetch() : interaction.guild;
        if(!guild) {
            return 'Invalid guild';
        }
        await joinVoice(interaction.member, guild);
        return 'joined';
    }
}

export default command;