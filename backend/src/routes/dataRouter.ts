import { FastifyInstance, RouteShorthandOptions } from "fastify";
import { getData } from "../repo/data-repo";

export const DataRouter = (
    server: FastifyInstance,
    opts: RouteShorthandOptions,
    done: (error?: Error) => void
) => {
    server.get("/combination", async (request, reply) => {
        try {
            const combination = await getData();
            console.log("combination: ", combination);
            return reply.status(200).send({ combination: combination });
        } catch (e) {
            server.log.error(`GET /todos Error: ${e}`);
            return reply.status(500).send(`[Server Error]: ${e}`);
        }
    });
    done();
};
