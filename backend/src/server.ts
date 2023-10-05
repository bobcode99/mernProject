import FastifyCors from "@fastify/cors";
import FastifyStatic from "@fastify/static";
import fastify, { FastifyInstance } from "fastify";
import { AppConfig } from "./types/appConfig";
import { establishConnection } from "./plugins/mongodb";
import { DataRouter } from "./routes/dataRouter";
export const serverOf: () => FastifyInstance = () => {
    const server: FastifyInstance = fastify({
        logger: {
            transport: {
                target: "pino-pretty",
            },
            level: "debug",
        },
    });
    server.register(FastifyCors, {});

    server.get("/ping", async (request, reply) => {
        return reply.status(200).send({ msg: "pong" });
    });

    server.register(DataRouter, { prefix: "/api" });

    return server;
};

export const serverStart: (
    server: FastifyInstance
) => (appConfig: AppConfig) => Promise<FastifyInstance> =
    (server) => async (appConfig) => {
        try {
            await establishConnection(appConfig.MONGO_CONNECTION_STRING);
            server.log.info(`Mongo connect successfully`);
        } catch (error) {
            server.log.fatal(`Failed to connect mongodb: ${error}`);
            throw new Error(`${error}`);
        }

        await server.listen({
            port: appConfig.FASTIFY_PORT,
            host: appConfig.FASTIFY_HOST,
        });

        return server;
    };
