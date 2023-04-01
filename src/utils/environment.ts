import dotenv from 'dotenv';

interface EnvironmentVariables {
    clientToken: string;
    automaticallyJoin: boolean;
}

function getEnvs(): EnvironmentVariables {
    if(!process.env.CLIENT_TOKEN) {
        throw new Error('The environment variable CLIENT_TOKEN must be provided!');
    }
    return {
        clientToken: process.env.CLIENT_TOKEN,
        automaticallyJoin: process.env.JOIN_AUTOMATICALLY === 'true',
    };
}

// Because Intellij is not able to set environment variables in combination with WSL
dotenv.config();
export const envs = getEnvs();