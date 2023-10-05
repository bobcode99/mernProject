import { Type } from "@sinclair/typebox";

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
