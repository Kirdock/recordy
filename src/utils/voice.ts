import { APIInteractionGuildMember, Guild, GuildMember } from 'discord.js';
import { joinVoiceChannel } from '@discordjs/voice';
import { VoiceRecorder } from '@kirdock/discordjs-voice-recorder/lib';
import { envs } from './environment';
import { client } from '../index';

export const voiceRecorder = new VoiceRecorder({
    maxRecordTimeMs: envs.MAX_RECORD_TIME_MINUTES ? envs.MAX_RECORD_TIME_MINUTES * 60_000 : undefined,
}, client);

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