# Recordy
[![Docker](https://badgen.net/badge/icon/docker?icon=docker&label)](https://hub.docker.com/r/striessnigk/recordy)

**Important things first: This bot gives you the whole conversation of the voice channel, not just chunks of it. It's as the same as you would hear it.**

This Discord bot if for recording voice activity in voice channels.
If you save the recording, it is sent to the discord channel you put the slash command in.

Docker pull: `docker pull striessnigk/recordy:latest`


## Configuration (Environment variables)
- `CLIENT_TOKEN`: The token of your discord bot.
- `JOIN_AUTOMATICALLY`: Determines if the bot should automatically join if more than one user is in a channel (Default `false`). To enable it, set the value to `true`.
- `MAX_RECORD_TIME_MINUTES`: Determines how many minutes you want to buffer. Everything older than this threshold is deleted (Default `10`).

## Slash Commands
- `join`: The bot joins the voice channel the user is in.
- `re-register`: Re-registers all slash commands.
- `unregister`: Deletes all slash commands.
- `save`: Saves the recording.
  - Sub-options:
    - `minutes`: Determines how many minutes you want to be saved up to a maximum of `MAX_RECORD_TIME_MINUTES` (Default `10`).
    - `type`: Determines the output format.
      - `single`: A single mp3 file is send to the text channel with the recording.
      - `separate`: A zip file that contains a recording per user.

## Message commands
`.register`: Just in case slash commands are not working. This registers them again.
 
## Needs discussion
### User volumes
Technically it's supported to adjust the volume of each user, but I don't know what would be the most user friendliest solution for it.
1. Slash commands to set user volumes
   - Pro
     - Easy to use
   - Contra
     - Would probably take too long if you have a lot of users
2. Environment variable to set user volumes (stringified JSON array with the items {userId, volume})

If we allow both options, the question may come up: If I restart the container, should the environment variables override the user volumes?

In both cases a volume mount would make sense, so that these settings are saved and another image can't destroy it.
I would say that this can be saved via a simple json file.

### Too large files
At the moment I'm just sending the files to a Discord channel but due to limitations this may not work for all files.
The question is, which services should I support for file upload?
I would say I will offer several services, and you just have to provide an access token.
