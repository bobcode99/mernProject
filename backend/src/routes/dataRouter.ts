import { FastifyInstance, RouteShorthandOptions } from "fastify";
import { postDataBodySchemaStrict } from "../schemas/dataSchema";
import { BodyPutType, Data, LimitationsType } from "../types/data";
import * as repo from "./../repo/data-repo";
import { Type } from "@sinclair/typebox";
import { updateData } from "../scripts/updateData";

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

    const schemaByTypebox = Type.Object({
        name: Type.String(),
        description: Type.Optional(Type.String()),
        status: Type.String(),
    });

    const schemaByTypeboxStrict = Type.Strict(schemaByTypebox);

    const routeOptions = {
        schema: {
            body: schemaByTypeboxStrict,
        },
    };

    server.post("/test", routeOptions, (request, reply) => {
        // ...
        return reply.status(200).send({ message: "Hello World" });
    });

    const postCombinationsOptions = {
        schema: {
            body: postDataBodySchemaStrict,
        },
    };

    server.post<{ Body: Data }>(
        "/combinations",
        postCombinationsOptions,
        async (request, reply) => {
            try {
                // const dataBody = await postDataSchemaByZod.safeParseAsync(
                //     request.body
                // );
                // if (dataBody.success) {
                //     const combinations = await repo.addData(dataBody.data);
                //     console.log("post success: ", combinations);
                //     return reply.status(201).send({ combinations });
                // } else {
                //     return reply.status(422).send("Schema error");
                // }
                const combinations = await repo.addData(request.body);
                console.log("post success: ", combinations);
                return reply.status(201).send({ combinations });
            } catch (error) {
                server.log.error(`POST /combinations Error: ${error}`);
                return reply.status(500).send(`[Server Error]: ${error}`);
            }
        }
    );
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

    server.put<{ Params: IdParam; Body: BodyPutType }>(
        "/combinations/:id",
        async (request, reply) => {
            try {
                const id = request.params.id;
                const bodyPut = request.body;

                const combinations = await updateData(id, bodyPut);

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
