import { Type } from "@sinclair/typebox";

import { Limit } from "../types/data";

export const postDataBodySchema = Type.Object({
    deviceName: Type.String(),
    deviceId: Type.String(),
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

export const dataResponseSchema = Type.Object({
    combination: Type.Array(postDataBodySchema),
});
