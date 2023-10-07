import { FastifyInstance, RouteShorthandOptions } from "fastify";
import { postDataSchemaByZod } from "../schemas/dataSchema";
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
    server.post<{ Body: Data }>("/combinations", async (request, reply) => {
        try {
            const dataBody = await postDataSchemaByZod.safeParseAsync(
                request.body
            );
            if (dataBody.success) {
                const combinations = await repo.addData(dataBody.data);
                console.log("post success: ", combinations);
                return reply.status(201).send({ combinations });
            } else {
                return reply.status(422).send("Schema error");
            }
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
    server.delete<{ Params: IdParam }>(
        "/combinations/:id",
        async (request, reply) => {
            try {
                const id = request.params.id;
                const deleteResult = await repo.deleteById(id);

                if (deleteResult) {
                    return reply.status(204).send({ deleteResult });
                } else {
                    return reply
                        .status(404)
                        .send({ msg: `Not Found Combinations:${id}` });
                }
            } catch (e) {
                server.log.error(
                    `DELETE /combinations/${request.params.id} Error: ${e}`
                );
                return reply.status(500).send(`[Server Error]: ${e}`);
            }
        }
    );
    server.put<{ Params: IdParam; Body: Data }>(
        "/combinations/:id",
        async (request, reply) => {
            try {
                const id = request.params.id;
                const bodyNeedUpdate = request.body;
                const combinations = await repo.updateData(id, bodyNeedUpdate);

                console.log("updateResult: ", combinations);
                if (combinations) {
                    return reply.status(200).send({ combinations });
                } else {
                    return reply
                        .status(404)
                        .send({ msg: `Not Found Combinations:${id}` });
                }
            } catch (e) {
                server.log.error(
                    `DELETE /combinations/${request.params.id} Error: ${e}`
                );
                return reply.status(500).send(`[Server Error]: ${e}`);
            }
        }
    );

    done();
};
