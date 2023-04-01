import { Command } from '../utils/appCommands';
import { APIApplicationCommandOptionChoice, SlashCommandBuilder } from 'discord.js';
import { getRecording } from '../utils/voice';
import { AudioExportType } from '@kirdock/discordjs-voice-recorder/lib/models/types';
import { sendFile } from '../utils/sendMessages';

type Choices = APIApplicationCommandOptionChoice & {value: AudioExportType};
const choices: Choices[] = [
    {name: 'single', value: 'single'},
    {name: 'separate', value: 'separate'}
];

const command: Command = {
    data: new SlashCommandBuilder()
        .setName('save')
        .setDescription('Save the last x (up to 10) minutes')
        .addIntegerOption(option =>
            option
                .setName('minutes')
                .setDescription('How many minutes should be saved')
                .setMinValue(1)
                .setMaxValue(10)
        )
        .addStringOption((option) =>
            option.setName('type').setDescription('save as single file or as zip file with a file per user').setChoices(...choices)
        )
        .toJSON(),
    async execute (interaction) {
        if(!interaction.guildId) {
            return 'No guild provided';
        }

        const guild = interaction.inCachedGuild() ? await interaction.guild.fetch() : interaction.guild;
        if(!guild) {
            return 'Guild cannot be fetched';
        }
        const channel = interaction.channel ?? await guild.channels.fetch(interaction.channelId);
        if(!channel?.isTextBased()) {
            return 'Channel is not a text channel';
        }

        const minutes = interaction.options.getInteger('minutes');
        const exportType = (interaction.options.getString('export type') as AudioExportType | null) ?? undefined;
        const readable = await getRecording(interaction.guildId, exportType ?? undefined, minutes ?? undefined);
        await sendFile(readable, channel, exportType);

        return 'done';
    },
};

export default command;
