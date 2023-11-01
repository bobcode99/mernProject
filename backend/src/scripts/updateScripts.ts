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

const updateDataCombinations = async () => {
    const resultFind = await DataSchema.find({
        deviceType: "Apple",
        scenario: "DOWN",
        "limitations.limitName": { $nin: ["CAMERA_DIRTY", "BATTERY_LOW"] },
    });
    console.log(resultFind);
    const updateResultAdd = await DataSchema.updateMany(
        {
            deviceType: "Apple",
            scenario: "DOWN",
            "limitations.limitName": {
                $nin: ["CAMERA_DIRTY", "BATTERY_LOW"],
            },
        },
        {
            $addToSet: {
                limitations: {
                    $each: [
                        {
                            id: "l2",
                            limitName: "CAMERA_DIRTY",
                            description: "Dirty camera new",
                            user: "Jammy",
                        },
                        {
                            id: "l3",
                            limitName: "BATTERY_LOW",
                            description: "Battery in 10% below newwww",
                            user: "Jammy",
                        },
                    ],
                },
            },
        },
        { new: true }
    );
    console.log("updateResultAdd: ", updateResultAdd);

    const updateResultDelete = await DataSchema.updateMany(
        {
            deviceType: "Apple",
            scenario: "DOWN",
            "limitations.limitName": {
                $in: ["WATER_DAMAGE"],
            },
        },
        {
            $pull: {
                limitations: {
                    limitName: { $in: ["WATER_DAMAGE"] },
                },
            },
        },
        { new: true }
    );
    console.log("updateResultDelete: ", updateResultDelete);
};

const connectToDbAndDoStuff = async () => {
    try {
        await establishConnection(appConfig.MONGO_CONNECTION_STRING);
        // await updateDataCombinations();

        // const updatedDocuments = await DataSchema.find({
        //     deviceType: "Apple",
        //     scenario: "DOWN",
        //     $or: [
        //         {
        //             "limitations.limitName": {
        //                 $in: ["CAMERA_DIRTY", "BATTERY_LOW"],
        //             },
        //         },
        //         { "limitations.limitName": { $in: ["WATER_DAMAGE"] } },
        //     ],
        // });

        // console.log("Updated documents:", updatedDocuments);
    } catch (error) {
        throw new Error(`${error}`);
    }
};

connectToDbAndDoStuff().then(() => {
    console.log("done");
    closeMongoose();
});
