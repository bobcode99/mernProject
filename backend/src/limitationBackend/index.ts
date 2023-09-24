import { AppConfig } from "../types/appConfig";
import { env } from "./config";
import { serverOf, serverStart } from "./limitationServer";

const server = serverOf();

const appConfig: AppConfig = {
    FASTIFY_PORT: env.FASTIFY_PORT,
    FASTIFY_HOST: env.FASTIFY_HOST,
    MONGO_CONNECTION_STRING: env.MONGO_CONNECTION_STRING,
};

serverStart(server)(appConfig);
