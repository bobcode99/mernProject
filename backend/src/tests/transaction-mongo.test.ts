import { GenericContainer, StartedTestContainer } from "testcontainers";
import { MongoDBContainer } from "@testcontainers/mongodb";
import mongoose, { ClientSession } from "mongoose";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import * as repo from "../repo/user-repo";

let mongodbContainer: StartedTestContainer;

beforeAll(async () => {
    // Start three MongoDB containers to simulate a replica set
    mongodbContainer = await new MongoDBContainer("mongo:7.0-rc-jammy").start();
    // await checkMongo(mongodbContainer);

    // Connect Mongoose to the MongoDB test container
    // const host = mongoContainer1.getHost();
    // const port = mongoContainer1.getMappedPort(27017);
    const endpointURI =
        "mongodb://" +
        mongodbContainer.getHost() +
        ":" +
        mongodbContainer.getFirstMappedPort();
    // const endpointURI = `mongodb://${host}:${port}/test`;
    // const endpointURI =
    //     "mongodb://" +
    //     m1.getContainerIpAddress() +

    //     ":" +
    //     m1.getFirstMappedPort();

    console.log("endpointURI: ", endpointURI);
    await mongoose.connect(endpointURI);
    console.log("6");
});

afterAll(async () => {
    // Disconnect Mongoose and stop the MongoDB containers
    await mongoose.disconnect();
    if (mongodbContainer) {
        await mongodbContainer.stop();
    }
});

describe.skip("Mongoose Transactions with Testcontainers Test", () => {
    it("should perform transactions in the MongoDB test container", async () => {
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            const userA = await repo.addUser(
                { name: "UserA", email: "userA@example.com" },
                session
            );

            const userB = await repo.addUser(
                { name: "UserB", email: "userB@example.com" },
                session
            );
            // If everything went well, commit the transaction
            await session.commitTransaction();
            session.endSession();

            expect(userA.name).toBe("UserA");
            expect(userB.name).toBe("UserB");
        } catch (error) {
            // If an error occurred, abort the transaction
            await session.abortTransaction();
            session.endSession();
            throw error;
        }
    });
});
