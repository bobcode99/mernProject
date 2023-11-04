import { FastifyInstance, RouteShorthandOptions } from "fastify";
import { Type } from "@sinclair/typebox";

import * as repo from "./../repo/logs-repo";
import { LogsType } from "../types/logsType";

export const CatRouter = (
    server: FastifyInstance,
    opts: RouteShorthandOptions,
    done: (error?: Error) => void
) => {
    server.post<{ Body: LogsType }>("/logs", async (request, reply) => {
        try {
            const logsBody = request.body;
            const resultLogs = await repo.addLogs(logsBody);
            return reply.status(201).send({ resultLogs });
        } catch (error) {
            return reply.status(500).send({ error });
        }
    });
    done();
};
