import { Command } from '../utils/appCommands';
import { APIApplicationCommandOptionChoice, SlashCommandBuilder } from 'discord.js';
import { voiceRecorder } from '../utils/voice';
import { AudioExportType } from '@kirdock/discordjs-voice-recorder/lib/models/types';

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

        await interaction.deferReply();
        const minutes = interaction.options.getInteger('minutes');
        const exportType = (interaction.options.getString('export type') as AudioExportType | null) ?? undefined;
        const buffer = await voiceRecorder.getRecordedVoiceAsBuffer(interaction.guildId, exportType ?? undefined, minutes ?? undefined);
        const date = new Date().toISOString();

        let fileType: string, fileName: string;
        if (exportType === 'single') {
            fileType = 'audio/mp3';
            fileName = `${date}.mp3`;

        } else {
            fileType = 'application/zip';
            fileName = `${date}-all-streams.zip`;
        }

        await interaction.editReply({
            files: [ {
                attachment: buffer,
                contentType: fileType,
                name: fileName,
            } ],
        });
    },
};

export default command;
