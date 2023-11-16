import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";
import {
    GenericContainer,
    StartedTestContainer,
    Network,
} from "testcontainers";
import {
    startedMongoTestContainerOf,
    StartedMongoTestContainer,
} from "testcontainers-mongoose";
import { serverOf, serverStart } from "../server";
import { AppConfig } from "../types/appConfig";
import { fail } from "assert";
import { BodyPutType, Data } from "../types/data";
import { addData } from "../repo/data-repo";
import { getAllLogs } from "../service/logs";
import { MongoDBContainer } from "@testcontainers/mongodb";
import mongoose from "mongoose";
// import
describe("mongo test container test", async () => {
    console.log("describe start");

    let mongoTestContainer: StartedMongoTestContainer;
    const server = serverOf();
    const mongoContainer = await new MongoDBContainer(
        "mongo:7.0-rc-jammy"
    ).start();

    console.log("after start");
    // const closeDatabase = async () => {
    //     if (mongoose.connection.readyState === 1) {
    //         await mongoose.connection.dropDatabase();
    //         await mongoose.disconnect();
    //     }
    //     // await startedMongoTestContainer.stop();
    // };
    const clearDatabase = async () => {
        const collections = mongoose.connection.collections;
        for (const key in collections) {
            const collection = collections[key];
            await collection.deleteMany({});
        }
    };
    const fakeDataArr: Array<Data> = [
        {
            id: "001",
            deviceType: "Apple",
            deviceID: "A001",
            limitations: [
                {
                    id: "l1",
                    limitName: "WATER_DAMAGE",
                    description: "water damage",
                    user: "Jotaro",
                    date: new Date("2023-11-04T09:50:08.761Z"),
                },
                {
                    id: "l2",
                    limitName: "CAMERA_DIRTY",
                    description: "Dirty camera",
                    user: "Jotaro",
                    date: new Date("2023-11-04T09:50:08.761Z"),
                },
            ],
            scenario: "UP",
        },
        {
            id: "002",
            deviceType: "Apple",
            deviceID: "A0015",
            limitations: [
                {
                    id: "l1",
                    limitName: "WATER_DAMAGE",
                    description: "water damage",
                    user: "Jammy",
                    date: new Date("2023-11-04T09:50:08.761Z"),
                },
                {
                    id: "l2",
                    limitName: "CAMERA_DIRTY",
                    description: "Dirty camera",
                    user: "Jammy",
                    date: new Date("2023-11-04T09:50:08.761Z"),
                },
                {
                    id: "l3",
                    limitName: "BATTERY_LOW",
                    description: "Battery in 10% below",
                    user: "Jammy",
                    date: new Date("2023-11-04T09:50:08.761Z"),
                },
            ],
            scenario: "UP",
        },
        {
            id: "003",
            deviceType: "Apple",
            deviceID: "A0039",
            limitations: [
                {
                    id: "l1",
                    limitName: "WATER_DAMAGE",
                    description: "water damage",
                    user: "Jammy",
                    date: new Date("2023-11-04T09:50:08.761Z"),
                },
            ],
            scenario: "UP",
        },
    ];
    beforeAll(async () => {
        mongoTestContainer =
            await startedMongoTestContainerOf("mongo:7.0-rc-jammy");

        console.log("before all");
        const urlMongooseImg = mongoTestContainer.getUri();

        const urlMongo = mongoContainer.getConnectionString();
        console.log("urlMongo: ", urlMongo);
        console.log("mongoose: ", urlMongooseImg);

        const appConfigForTest: AppConfig = {
            FASTIFY_HOST: "localhost",
            FASTIFY_PORT: 8889,
            MONGO_CONNECTION_STRING: mongoTestContainer.getUri(),
            // MONGO_CONNECTION_STRING: urlMongooseImg,
        };

        await serverStart(server)(appConfigForTest);
    });

    afterAll(async () => {
        await mongoTestContainer.closeDatabase();
        await mongoContainer.stop();
    });

    afterEach(async () => {
        await clearDatabase();
    });

    it("Should be 200 status code by ping", async () => {
        const response = await server.inject({
            method: "GET",
            url: "ping",
        });
        expect(response.statusCode).toBe(200);
    });

    it("Should get all combinations", async () => {
        await addData(fakeDataArr[0]);
        await addData(fakeDataArr[1]);
        const response = await server.inject({
            method: "GET",
            url: "/api/combinations",
        });
        const body: Array<Data> = JSON.parse(response.body)["combinations"];
        console.log("Get all body: ", body);
        expect(body.length).toBe(2);
    });
    it("Should add combinations using post", async () => {
        console.log("post send body: ", fakeDataArr[0]);
        const response = await server.inject({
            method: "POST",
            url: "/api/combinations",
            body: fakeDataArr[0],
        });
        const body: { combinations: Data } = JSON.parse(response.body);
        console.log("post body: ", body);

        expect(body.combinations.deviceID).toBe(fakeDataArr[0].deviceID);
    });
    it("Should get combination by id", async () => {
        await addData(fakeDataArr[0]);
        const response = await server.inject({
            method: "GET",
            url: "/api/combinations/001",
        });
        const body: { combinations: Data } = JSON.parse(response.body);

        expect(body.combinations.scenario).toBe(fakeDataArr[0].scenario);
    });

    // it("Should return 422, schema error", async () => {
    //     const wrongData = {
    //         id: "32566dq",
    //         deviceType: "Apple",
    //         deviceID: "A001",
    //         limitations: [
    //             {
    //                 id: "l1",
    //                 name: "WATER_DAMAGE",
    //                 description: "water damage",
    //                 status: true,
    //                 version: "0.0.1",
    //             },
    //             {
    //                 id: "l2",
    //                 name: "CAMERA_DIRTY",
    //                 description: "Dirty camera",
    //                 status: true,
    //                 version: "0.0.1",
    //             },
    //         ],
    //         magic: false,
    //         scenario: "UP",
    //         user: "Jotaro",
    //         log: "empty",
    //     };

    //     const response = await server.inject({
    //         method: "POST",
    //         url: "/api/combinations",
    //         body: wrongData,
    //     });
    //     console.log("fail response: ", response);
    //     expect(response.statusCode).toBe(422);
    //     expect(response.body).toBe("Schema error");
    // });
    it("Should delete combinations by id", async () => {
        const response = await server.inject({
            method: "POST",
            url: "/api/combinations",
            body: fakeDataArr[0],
        });
        const body: { combinations: Data } = JSON.parse(response.body);
        console.log("Body need need delete: ", body);

        const idNeedDelete = body.combinations.id;
        console.log("idNeedDelete: ", idNeedDelete);
        const responseDelete = await server.inject({
            method: "DELETE",
            url: `/api/combinations/${idNeedDelete}`,
        });
        console.log("responseDelete: ", responseDelete);

        expect(responseDelete.statusCode).toBe(204);
    });

    // it("Should update by id", async () => {
    //     const responsePost = await server.inject({
    //         method: "POST",
    //         url: "/api/combinations",
    //         body: fakeDataArr[0],
    //     });
    //     const body: { combinations: Data } = JSON.parse(responsePost.body);

    //     const responsePut = await server.inject({
    //         method: "PUT",
    //         url: `/api/combinations/${body.combinations.id}`,
    //         body: {
    //             deviceID: "007",
    //         },
    //     });
    //     console.log("responsePut: ", responsePut);
    //     const bodyAfterPut: { combinations: Data } = JSON.parse(
    //         responsePut.body
    //     );

    //     console.log("bodyAfterPut: ", bodyAfterPut);
    //     expect(responsePut.statusCode).toBe(200);
    //     expect(bodyAfterPut.combinations.deviceID).toBe("007");
    // });

    it("Should update by limits", async () => {
        const responsePost = await server.inject({
            method: "POST",
            url: "/api/combinations",
            body: fakeDataArr[0],
        });
        const body: { combinations: Data } = JSON.parse(responsePost.body);

        // ori: l1, l2
        // add log: add l3, l4
        // delete log: l1, l2
        // snapshot: l3, l4

        const bodyPut: BodyPutType = {
            actionWithUserLimits: {
                ADD: [
                    {
                        id: "l3",
                        limitName: "BATTERY_LOW",
                        description: "l3 des",
                    },
                    {
                        id: "l4",
                        limitName: "WIFI_BROKEN",
                        description: "wifi damaged",
                    },
                ],
                DELETE: [
                    {
                        id: "l1",
                        limitName: "WATER_DAMAGE",
                        description: "water damage",
                    },
                    {
                        id: "l2",
                        limitName: "CAMERA_DIRTY",
                        description: "Dirty camera",
                    },
                ],
                user: "sammy",
            },
        };
        console.log("before put");

        const responsePut = await server.inject({
            method: "PUT",
            url: `/api/combinations/${body.combinations.id}`,
            body: bodyPut,
        });
        console.log("after put");
        const resultBodyPut: { status: "Success" | "Fail" } = JSON.parse(
            responsePut.body
        );

        console.log("resultBodyPut: ", resultBodyPut);

        const resultAllLogs = await getAllLogs;

        // const bodyAfterPut: { combinations: Data } = JSON.parse(
        //     responsePut.body
        // );

        // console.log("bodyAfterPut: ", JSON.stringify(bodyAfterPut));
        expect(responsePut.statusCode).toBe(200);
        // expect(bodyAfterPut.combinations.deviceID).toBe("007");
        expect(resultAllLogs).toHaveLength(2);
    });
});
