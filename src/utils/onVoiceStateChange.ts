import { Client, Events } from 'discord.js';
import { getVoiceConnection } from '@discordjs/voice';
import { envs } from './environment';

export async function onVoiceStateChange(client: Client<true>): Promise<void> {
    const { joinVoice } = await import('./voice'); // lazy loading to prevent circular dependency
    client.on(Events.VoiceStateUpdate, async (oldState, newState) => {
        const oldChannelMemberCount = oldState.channel?.members.size ?? 0;
        const newChannelMemberCount = newState.channel?.members.size ?? 0;
        const connection = getVoiceConnection(newState.guild.id);

        if(envs.JOIN_AUTOMATICALLY && !connection && newState.member) {
            await joinVoice(newState.member, newState.guild);
        }
        if(!connection) {
            return;
        }

        // bot leaves if it is the only remaining member in the voice channel
        if (oldChannelMemberCount === 1 && oldState.channel?.members.get(client.application.id) || newChannelMemberCount === 1 && newState.channel?.members.get(client.application.id)) {
            connection.disconnect();
        }
    })
}
