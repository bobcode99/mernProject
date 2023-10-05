import { FastifyInstance, RouteShorthandOptions } from "fastify";
import {
    postDataResponseSchema,
    getAllDataResponseSchema,
    postDataBodySchema,
} from "../schemas/dataSchema";
import { Data } from "../types/data";
import * as repo from "./../repo/data-repo";

type IdParam = {
    id: string;
};
export const DataRouter = (
    server: FastifyInstance,
    opts: RouteShorthandOptions,
    done: (error?: Error) => void
) => {
    server.get("/combinations", async (request, reply) => {
        try {
            const combinations = await repo.getData();
            console.log("combinations: ", combinations);
            return reply.status(200).send({ combinations: combinations });
        } catch (e) {
            server.log.error(`GET /combinations Error: ${e}`);
            return reply.status(500).send(`[Server Error]: ${e}`);
        }
    });
    const postCombinationsOptions = {
        ...opts,
        schema: {
            body: postDataBodySchema,
            response: {
                201: postDataResponseSchema,
            },
        },
    };
    server.post("/combinations", async (request, reply) => {
        try {
            const dataBody = request.body as Data;
            console.log("dataBody: ", dataBody);
            const combinations = await repo.addData(dataBody);
            console.log("post combinations: ", combinations);
            return reply.status(201).send({ combinations });
        } catch (error) {
            server.log.error(`POST /combinations Error: ${error}`);
            return reply.status(500).send(`[Server Error]: ${error}`);
        }
    });
    server.get<{ Params: IdParam }>(
        "/combinations/:id",
        async (request, reply) => {
            const id = request.params.id;
            try {
                const combinationsByID = await repo.getDataById(id);
                console.log("combinationsByID: ", combinationsByID);
                return reply
                    .status(200)
                    .send({ combinations: combinationsByID });
            } catch (e) {
                server.log.error(`GET /combinations/${id} Error: ${e}`);
                return reply.status(500).send(`[Server Error]: ${e}`);
            }
        }
    );
    done();
};
