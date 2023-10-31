import { FastifyInstance, RouteShorthandOptions } from "fastify";
import { Type } from "@sinclair/typebox";
import { Cat } from "./../models/cat";

type IdParam = {
    id: string;
};

const CatPostBodySchema = Type.Object({
    name: Type.String(),
    weight: Type.Number(),
});

interface CreateCatBody {
    name: string;
    weight: number;
}

export const CatRouter = (
    server: FastifyInstance,
    opts: RouteShorthandOptions,
    done: (error?: Error) => void
) => {
    server.post<{ Body: CreateCatBody }>(
        "/cats",
        { schema: CatPostBodySchema },
        async (request, reply) => {
            const name = request.body.name;
            const weight = request.body.weight;
            try {
                const cat = await Cat.create({ name, weight });
                return reply.status(201).send({ cat });
            } catch (error) {
                return reply.status(500).send({ error });
            }
        }
    );
    done();
};
