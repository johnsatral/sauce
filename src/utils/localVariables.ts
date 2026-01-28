import dotenv from "dotenv";
import { Environment } from "./types.ts";

dotenv.config();

export const testEnvironment: Environment = (process.env.TEST_ENV as Environment) || "test";

export function localVariables()
{
    dotenv.config({
        path: `.env.${testEnvironment}`,
        override: true
    })
}

//creds
export const username = process.env.USERNAME || '';
export const password = process.env.PASSWORD || '';

//user info
export const firstName = process.env.FIRST_NAME || '';
export const lastName = process.env.LAST_NAME || '';
export const postalCode = process.env.POSTAL_CODE || '';

//urls
export const baseURL = process.env.BASE_URL || 'https://www.saucedemo.com/';