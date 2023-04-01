import { Readable } from 'stream';
import { TextBasedChannel } from 'discord.js';
import { AudioExportType } from '@kirdock/discordjs-voice-recorder/lib/models/types';

export async function sendFile(readStream: Readable, channel: TextBasedChannel, exportType: AudioExportType = 'single'): Promise<void> {
    const date = new Date().toISOString();

    let fileType: string, fileName: string;
    if (exportType === 'single') {
        fileType = 'audio/mp3';
        fileName = `${date}.mp3`;

    } else {
        fileType = 'application/zip';
        fileName = `${date}-all-streams.zip`;
    }

    await channel.send({
        files: [ {
            attachment: readStream,
            contentType: fileType,
            name: fileName,
        } ]
    })
}