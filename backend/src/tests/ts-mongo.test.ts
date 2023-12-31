import {
    GenericContainer,
    StartedTestContainer,
    Network,
} from "testcontainers";
import mongoose, { ClientSession } from "mongoose";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import * as repo from "../repo/user-repo";
import { AppConfig } from "../types/appConfig";
import { serverOf, serverStart } from "../server";

describe.skip("Mongoose Transactions with Testcontainers Test", () => {
    const server = serverOf();

    let mongoContainer1: StartedTestContainer;
    let mongoContainer2: StartedTestContainer;
    let mongoContainer3: StartedTestContainer;

    // let networkNow: Network;
    // const network = await new Network().start();
    beforeAll(async () => {
        // Start three MongoDB containers to simulate a replica set
        const network = await new Network().start();
        console.log("1");
        mongoContainer1 = await new GenericContainer("mongo")
            .withExposedPorts(27017)
            .withCommand(["--replSet", "rs0", "--bind_ip", "localhost,M1"])
            .withNetwork(network)
            .start();
        console.log("2");

        mongoContainer2 = await new GenericContainer("mongo")
            .withExposedPorts(27017)
            .withCommand(["--replSet", "rs0", "--bind_ip", "localhost,M2"])
            .withNetwork(network)
            .start();
        console.log("3");

        mongoContainer3 = await new GenericContainer("mongo")
            .withExposedPorts(27017)
            .withCommand(["--replSet", "rs0", "--bind_ip", "localhost,M3"])
            .withNetwork(network)
            .start();
        // Connect Mongoose to the MongoDB test container
        const host1 = mongoContainer1.getHost();
        const port1 = mongoContainer1.getMappedPort(27017);
        const host2 = mongoContainer2.getHost();
        const port2 = mongoContainer2.getMappedPort(27017);
        const host3 = mongoContainer3.getHost();
        const port3 = mongoContainer3.getMappedPort(27017);
        // Initialize the replica set
        await mongoContainer1.exec([
            "mongo",
            "--eval",
            `rs.initiate({_id: "rs0", members: [{_id: 0, host: "${host1}:${port1}"}, { _id: 1, host: "${host2}:${port2}" }, { _id: 2, host: "${host3}:${port3}" }]})`,
        ]);

        // await mongoContainer1.exec(["mongo", "--eval", "rs.status()"]);
        console.log("4");

        // Wait for the replica set to be ready
        // await mongoContainer1.exec([
        //     "bash",
        //     "-c",
        //     'until mongo --eval "printjson(rs.isMaster())" | grep ismaster | grep true > /dev/null 2>&1; do sleep 1; done',
        // ]);
        // console.log("5");

        // await mongoose.connect(
        //     `mongodb://${host1}:${port1},${host2}:${port2},${host3}:${port3}/test`
        // );

        const mongoUri = `mongodb://${host1}:${port1},${host2}:${port2},${host3}:${port3}/test`;
        // await mongoose.connect(
        //     ``
        // );

        const appConfigForTest: AppConfig = {
            FASTIFY_HOST: "localhost",
            FASTIFY_PORT: 8889,
            MONGO_CONNECTION_STRING: mongoUri,
        };

        await serverStart(server)(appConfigForTest);

        console.log("6");
    });

    afterAll(async () => {
        // Disconnect Mongoose and stop the MongoDB containers
        await mongoose.disconnect();
        await Promise.all([
            mongoContainer1.stop(),
            mongoContainer2.stop(),
            mongoContainer3.stop(),
        ]);
    });
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
