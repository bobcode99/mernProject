import DataSchema from "../models/dataModel";
import { closeMongoose, establishConnection } from "../plugins/mongodb";
import { env } from "../config";
import { AppConfig } from "../types/appConfig";
import { Data } from "../types/data";

const appConfig: AppConfig = {
    FASTIFY_PORT: env.FASTIFY_PORT,
    FASTIFY_HOST: env.FASTIFY_HOST,
    MONGO_CONNECTION_STRING: env.MONGO_CONNECTION_STRING,
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
        deviceID: "A001",
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
        scenario: "DOWN",
        user: "Jammy",
    },
    {
        id: "003",
        deviceType: "Apple",
        deviceID: "A002",
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
        scenario: "DOWN",
        user: "Jammy",
    },
    {
        id: "004",
        deviceType: "Apple",
        deviceID: "A003",
        limitations: [
            {
                id: "l1",
                limitName: "WATER_DAMAGE",
                description: "water damage",
                user: "Jammy",
            },
        ],
        scenario: "DOWN",
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
