import { EnvironmentVariablesAvailable } from '../utils/environment';

declare global {
    declare namespace NodeJS {
        export interface ProcessEnv extends EnvironmentVariablesAvailable {

        }
    }
}