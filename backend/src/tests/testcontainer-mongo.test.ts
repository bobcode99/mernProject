import { GenericContainer, StartedTestContainer } from "testcontainers";
import mongoose from "mongoose";
import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";
import { serverOf } from "../server";

let mongoContainer: StartedTestContainer;

// Define your Mongoose schema and model
interface User extends mongoose.Document {
    name: string;
    email: string;
}

const UserSchema = new mongoose.Schema({
    name: String,
    email: String,
});

const UserModel = mongoose.model<User>("User", UserSchema);

describe.skip("Mongoose with Testcontainers Test", () => {
    const server = serverOf();
    beforeAll(async () => {
        // Start a MongoDB container
        mongoContainer = await new GenericContainer("mongo")
            .withExposedPorts(27017)
            .start();
        // Get MongoDB connection details from the running container
        const host = mongoContainer.getHost();
        const port = mongoContainer.getMappedPort(27017);

        console.log(`mongodb://${host}:${port}/test`);
        // Connect Mongoose to the MongoDB test container
        await mongoose.connect(`mongodb://${host}:${port}/test`);
    });

    afterAll(async () => {
        // Close the Mongoose connection and stop the MongoDB container
        await mongoose.disconnect();
        if (mongoContainer) {
            await mongoContainer.stop();
        }
    });
    it("should save a user to the MongoDB test container", async () => {
        const newUser = new UserModel({
            name: "Alice",
            email: "alice@example.com",
        });

        const savedUser = await newUser.save();

        expect(savedUser._id).toBeDefined();
        expect(savedUser.name).toBe("Alice");
    });
});
