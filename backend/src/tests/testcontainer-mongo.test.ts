import { GenericContainer, StartedTestContainer } from "testcontainers";
import mongoose from "mongoose";
import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";
import { MongoDBContainer } from "@testcontainers/mongodb";

let mongoContainer: StartedTestContainer;

beforeAll(async () => {
    // Start a MongoDB container
    mongoContainer = await new GenericContainer("mongo")
        .withExposedPorts(27017)
        .start();
    // mongoContainer = await new MongoDBContainer("mongo:7.0-rc-jammy").start();
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

describe("Mongoose with Testcontainers Test", () => {
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
