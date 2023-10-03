import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";
import {
    startedMongoTestContainerOf,
    StartedMongoTestContainer,
} from "testcontainers-mongoose";
import { serverOf, serverStart } from "../server";
import { AppConfig } from "../types/appConfig";

describe("mongo test container test", () => {
    let mongoTestContainer: StartedMongoTestContainer;
    const server = serverOf();

    beforeAll(async () => {
        mongoTestContainer = await startedMongoTestContainerOf("mongo");

        const appConfigForTest: AppConfig = {
            FASTIFY_HOST: "localhost",
            FASTIFY_PORT: 8889,
            MONGO_CONNECTION_STRING: mongoTestContainer.getUri(),
        };

        await serverStart(server)(appConfigForTest);
    });

    afterAll(async () => {
        await mongoTestContainer.closeDatabase();
    });

    afterEach(async () => {
        await mongoTestContainer.clearDatabase();
    });

    it("Should be 200 status code", async () => {});
});
