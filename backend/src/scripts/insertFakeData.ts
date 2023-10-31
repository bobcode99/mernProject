import { Cat } from "../models/cat";
import DataSchema from "../models/dataModel";

import { ICat } from "../models/cat";
import { faker } from "@faker-js/faker";
import { closeMongoose, establishConnection } from "../plugins/mongodb";
import { env } from "../config";
import { AppConfig } from "../types/appConfig";
import { Data } from "../types/data";

const appConfig: AppConfig = {
    FASTIFY_PORT: env.FASTIFY_PORT,
    FASTIFY_HOST: env.FASTIFY_HOST,
    MONGO_CONNECTION_STRING: env.MONGO_CONNECTION_STRING,
};

const fakeCats: Array<ICat> = Array.from({ length: 10 }, () => ({
    name: faker.animal.cat(),
    weight: faker.number.int(100),
}));

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
            },
            {
                id: "l2",
                limitName: "CAMERA_DIRTY",
                description: "Dirty camera",
                user: "Jotaro",
            },
        ],
        scenario: "UP",
        user: "Jotaro",
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
            },
            {
                id: "l2",
                limitName: "CAMERA_DIRTY",
                description: "Dirty camera",
                user: "Jammy",
            },
            {
                id: "l3",
                limitName: "BATTERY_LOW",
                description: "Battery in 10% below",
                user: "Jammy",
            },
        ],
        scenario: "UP",
        user: "Jammy",
    },
];
const insertFakeData = async () => {
    try {
        await establishConnection(appConfig.MONGO_CONNECTION_STRING);
        // const catPromises = fakeCats.map(async (cat) => {
        //     console.log(cat);
        //     return Cat.create(cat);
        // });

        const dataPromises = fakeDataArr.map(async (data) => {
            console.log(data);
            return DataSchema.create(data);
        });

        await Promise.all(dataPromises);
    } catch (error) {
        throw new Error(`${error}`);
    }
};

insertFakeData().then(() => {
    console.log("done");
    closeMongoose();
});
