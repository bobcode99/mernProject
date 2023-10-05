import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";
import {
    startedMongoTestContainerOf,
    StartedMongoTestContainer,
} from "testcontainers-mongoose";
import { serverOf, serverStart } from "../server";
import { AppConfig } from "../types/appConfig";
import { fail } from "assert";
import { Data } from "../types/data";
import { addData } from "../repo/data-repo";

describe("mongo test container test", () => {
    let mongoTestContainer: StartedMongoTestContainer;
    const server = serverOf();

    const sampleDataArr: Array<Data> = [
        {
            id: "001",
            deviceType: "Apple",
            devideID: "A001",
            limitations: [
                {
                    id: "l1",
                    name: "WATER_DAMAGE",
                    description: "water damage",
                    status: true,
                    version: "0.0.1",
                },
                {
                    id: "l2",
                    name: "CAMERA_DIRTY",
                    description: "Dirty camera",
                    status: true,
                    version: "0.0.1",
                },
            ],
            scenario: "UP",
            user: "Jotaro",
            log: "empty",
        },
        {
            id: "002",
            deviceType: "Apple",
            devideID: "A0015",
            limitations: [
                {
                    id: "l1",
                    name: "WATER_DAMAGE",
                    description: "water damage",
                    status: true,
                    version: "0.0.1",
                },
                {
                    id: "l2",
                    name: "CAMERA_DIRTY",
                    description: "Dirty camera",
                    status: true,
                    version: "0.0.1",
                },
                {
                    id: "l3",
                    name: "BATTERY_LOW",
                    description: "Battery in 10% below",
                    status: true,
                    version: "0.0.1",
                },
            ],
            scenario: "UP",
            user: "Jammy",
            log: "empty",
        },
    ];
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

    it("Should be 200 status code by ping", async () => {
        const response = await server.inject({
            method: "GET",
            url: "ping",
        });
        expect(response.statusCode).toBe(200);
    });

    it("Should get all combinations", async () => {
        await addData(sampleDataArr[0]);
        await addData(sampleDataArr[1]);
        const response = await server.inject({
            method: "GET",
            url: "/api/combination",
        });
        const body: Array<Data> = JSON.parse(response.body)["combination"];
        console.log("body: ", body);
        expect(body.length).toBe(2);
    });
    it("Should add combinations", async () => {
        fail();
    });
    it("Should get combination by id", async () => {
        fail();
    });
    it("Should delete combinations by id", async () => {
        fail();
    });
});
