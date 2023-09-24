// insertLimitations.ts

import mongoose from "mongoose";
import Limitation from "../schema/limitSchema";
mongoose.connect("mongodb://localhost:27017/dataPool");

const db = mongoose.connection;

db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", async () => {
    try {
        const limitationsData = [
            {
                id: 1,
                name: "BATTERY_LOW",
                description: "Battery in 10% below",
                version: "v1.0.0",
                status: true,
            },
            {
                id: 2,
                name: "CAMERA_DIRTY",
                description: "Dirty camera",
                version: "v1.0.1",
                status: true,
            },
            {
                id: 3,
                name: "WATER_DAMAGE",
                description: "The device has water inside",
                version: "v2.0.0",
                status: true,
            },
            {
                id: 4,
                name: "SLOT_FULL",
                description: "Slot full connect by USB",
                version: "v1.0.3",
                status: true,
            },
        ];

        await Limitation.insertMany(limitationsData);
        console.log("Limitations data inserted successfully.");
    } catch (err) {
        console.error("Error inserting limitations data:", err);
    } finally {
        mongoose.disconnect();
    }
});
