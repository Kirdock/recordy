import { BaseMessageOptions, ChatInputCommandInteraction, Client, Events, RESTPostAPIChatInputApplicationCommandsJSONBody, SlashCommandBuilder } from 'discord.js';
import { extname, join } from 'path';
import { readdirSync } from 'fs';

interface InteractionFileResponse {
    files: BaseMessageOptions['files'];
    ephemeral: false;
}

export interface Command {
    data:  RESTPostAPIChatInputApplicationCommandsJSONBody | SlashCommandBuilder;
    execute: (interaction: ChatInputCommandInteraction) => Promise<string | InteractionFileResponse>;
}

// DOC because Discord.js is unable to use JSDoc
const commandsPath = join(__dirname, '../commands');
const supportedExtensions: string[] = ['.js', '.ts'];
let commands: Command[] = [];
void readCommands()

async function readCommands(): Promise<void> {
    const commandsRead: Command[] = [];
    const commandFiles = readdirSync(commandsPath).filter((file) => supportedExtensions.some(extension => extname(file) === extension));
    for (const file of commandFiles) {
        const command: Command = (await import(`../commands/${file}`)).default;
        commandsRead.push(command);
    }
    commands = commandsRead;
}

export async function unregisterApplicationCommands(client: Client<true>): Promise<void> {
    const currentCommands = await client.application.commands.fetch();
    for (const [commandId, command] of currentCommands) {
        try {
            await client.application.commands.delete(commandId);
        } catch (error) {
            console.error(`Could not delete command ${command.name}. Error:`, error);
        }
    }
}

/**
 * CHAT_INPUT    1    Slash commands; a text-based command that shows up when a user types /
 * USER          2    A UI-based command that shows up when you right click or tap on a user
 * MESSAGE       3    A UI-based command that shows up when you right click or tap on a message
 */
export function setupApplicationCommands(client: Client<true>): void {
    client.on(Events.InteractionCreate, async (interaction) => {
        if (!interaction.isChatInputCommand()) {
            return;
        }

        const command = commands.find((command) => command.data.name === interaction.commandName);

        if (!command) {
            console.error(`No command matching ${interaction.commandName} was found.`);
            return;
        }

        try {
            const reply = await command.execute(interaction);
            if(typeof reply === 'string') {
                interaction.reply({ ephemeral: true, content: reply });
            } else {
                interaction.reply(reply);
            }
        } catch (error) {
            console.error(`Error executing ${interaction.commandName}`);
            console.error(error);
        }
    });
}

export async function registerApplicationCommands(client: Client<true>): Promise<void> {
    for (const command of commands) {
        await client.application.commands.create(command.data);
    }
}
