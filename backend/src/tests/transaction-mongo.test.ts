import { GenericContainer, StartedTestContainer } from "testcontainers";
import mongoose, { ClientSession } from "mongoose";
import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";
import * as repo from "../repo/user-repo";

let mongoContainer1: StartedTestContainer;
let mongoContainer2: StartedTestContainer;
let mongoContainer3: StartedTestContainer;

beforeAll(async () => {
    // Start three MongoDB containers to simulate a replica set
    mongoContainer1 = await new GenericContainer("mongo")
        .withExposedPorts(27017)
        .withCommand(["--replSet", "rs0", "--bind_ip", "localhost,M1"])
        .start();

    mongoContainer2 = await new GenericContainer("mongo")
        .withExposedPorts(27017)
        .withCommand(["--replSet", "rs0", "--bind_ip", "localhost,M2"])
        .start();

    mongoContainer3 = await new GenericContainer("mongo")
        .withExposedPorts(27017)
        .withCommand(["--replSet", "rs0", "--bind_ip", "localhost,M3"])
        .start();

    // Initialize the replica set
    await mongoContainer1.exec([
        "mongo",
        "--eval",
        'printjson(rs.initiate({_id: "rs0", members: [{_id: 0, host: "M1:27017"}, { _id: 1, host: "M2:27017" }, { _id: 2, host: "M3:27017" }]}))',
    ]);

    // Wait for the replica set to be ready
    await mongoContainer1.exec([
        "bash",
        "-c",
        'until mongo --eval "printjson(rs.isMaster())" | grep ismaster | grep true > /dev/null 2>&1; do sleep 1; done',
    ]);
});

afterAll(async () => {
    // Stop and remove the MongoDB containers
    await Promise.all([
        mongoContainer1.stop(),
        mongoContainer2.stop(),
        mongoContainer3.stop(),
    ]);
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
