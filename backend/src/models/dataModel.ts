import mongoose from "mongoose";

import { Data } from "../types/data";
import { Limit } from "../types/data";

const dataSchema: mongoose.Schema = new mongoose.Schema(
    {
        id: { type: String, required: true, unique: true },
        deviceType: { type: String, required: true },
        deviceId: { type: String, required: true },
        limitations: {
            type: [
                {
                    id: String,
                    name: String,
                    description: String,
                    status: Boolean,
                    version: String,
                },
            ],
            required: true,
        },
        scenario: { type: String, required: true },
        user: { type: String, required: true },
        log: { type: String, required: true },
        // createdDate: { type: Date, default: Date.now },
    },
    {
        timestamps: true,
    }
);

dataSchema.set("toJSON", {
    virtuals: true,
    versionKey: false,
});

export default mongoose.models.Limit ||
    mongoose.model<Data>("Limit", dataSchema);
