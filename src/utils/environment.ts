import dotenv from 'dotenv';

interface EnvironmentVariables {
    CLIENT_TOKEN: string;
    JOIN_AUTOMATICALLY: boolean;
    MAX_RECORD_TIME_MINUTES?: number;
}

export type EnvironmentVariablesAvailable = {[P in keyof EnvironmentVariables]?: string};

function getEnvs(): EnvironmentVariables {
    const availableEnv = process.env;
    if(!availableEnv.CLIENT_TOKEN) {
        throw new Error('The environment variable CLIENT_TOKEN must be provided!');
    }
    const parsedRecordTime = availableEnv.MAX_RECORD_TIME_MINUTES ? +availableEnv.MAX_RECORD_TIME_MINUTES : undefined;
    const recordTime = parsedRecordTime && Number.isFinite(parsedRecordTime) ? +parsedRecordTime : undefined
    return {
        CLIENT_TOKEN: availableEnv.CLIENT_TOKEN,
        JOIN_AUTOMATICALLY: availableEnv.JOIN_AUTOMATICALLY === 'true',
        MAX_RECORD_TIME_MINUTES: recordTime,
    };
}

// Because Intellij is not able to set environment variables in combination with WSL
dotenv.config();
export const envs = getEnvs();