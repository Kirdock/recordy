import { APIInteractionGuildMember, Guild, GuildMember, Snowflake } from 'discord.js';
import { joinVoiceChannel } from '@discordjs/voice';
import { PassThrough, Readable } from 'stream';
import { VoiceRecorder } from '@kirdock/discordjs-voice-recorder/lib';
import { AudioExportType } from '@kirdock/discordjs-voice-recorder/lib/models/types';

const voiceRecorder = new VoiceRecorder();

export async function joinVoice(member:  GuildMember | APIInteractionGuildMember, guild: Guild): Promise<void> {
    if(!(member instanceof GuildMember)) {
        member = await guild.members.fetch(member.user.id);
    }
    if(!member.voice.channelId) {
        throw new Error(`Member ${member.user.username} is not in a voice channel!`);
    }

    const connection = joinVoiceChannel({
        guildId: guild.id,
        channelId: member.voice.channelId,
        adapterCreator: guild.voiceAdapterCreator,
        selfDeaf: false,
    });

    voiceRecorder.startRecording(connection);
}

export async function getRecording(guildId: Snowflake, exportType: AudioExportType = 'single', minutes = 10): Promise<Readable> {
    const passThrough = new PassThrough();
    await voiceRecorder.getRecordedVoice(passThrough, guildId, exportType, minutes);
    return passThrough;
}