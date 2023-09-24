import FastifyCors from "@fastify/cors";
// import FastifyStatic from "@fastify/static";
import fastify, { FastifyInstance } from "fastify";
import { AppConfig } from "../types/appConfig";
import { establishConnection } from "../plugins/mongodb";
import LimitModel, { ILimitation } from "./schema/limitSchema";

const getLimitations: () => Promise<Array<ILimitation>> = () => {
    return LimitModel.find().exec();
};

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
        return reply.status(200).send({ msg: "pong from limitation server" });
    });

    server.get("/api/limitations", async (request, reply) => {
        try {
            const limitations = await getLimitations();
            return reply.status(201).send({ limitations });
        } catch (error) {
            server.log.error(`GET /api/limitations Error: ${error}`);
            return reply.status(500).send(`[Server Error]: ${error}`);
        }
    });
    return server;
};

export const serverStart: (
    server: FastifyInstance
) => (appConfig: AppConfig) => Promise<FastifyInstance> =
    (server) => async (appConfig) => {
        try {
            await establishConnection(appConfig.MONGO_CONNECTION_STRING);
            server.log.info(`Mongo connect successfully (limitation)`);
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
