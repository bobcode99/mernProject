import { Type } from "@sinclair/typebox";
import { z, object } from "zod";

export const postDataBodySchema = Type.Object({
    deviceType: Type.String(),
    deviceID: Type.String(),
    limitations: Type.Array(
        Type.Object({
            id: Type.String(),
            name: Type.String(),
            description: Type.String(),
            status: Type.Boolean(),
            version: Type.String(),
        })
    ),
    scenario: Type.String(),
    user: Type.String(),
    log: Type.String(),
});

export const getAllDataResponseSchema = Type.Object({
    combinations: Type.Array(postDataBodySchema),
});

export const postDataResponseSchema = Type.Object({
    combinations: postDataBodySchema,
});

export const postDataSchemaByZod = object({
    id: z.string(),
    deviceType: z.string(),
    deviceID: z.string(),
    limitations: z.array(
        object({
            id: z.string(),
            name: z.string(),
            description: z.string(),
            status: z.boolean(),
            version: z.string(),
        })
    ),
    scenario: z.string(),
    user: z.string(),
    log: z.string(),
}).strict();

export type postInput = z.infer<typeof postDataSchemaByZod>;
