import mongoose, { Schema } from "mongoose";

import { Data } from "../types/data";

export const limitSchema: Schema = new Schema(
    {
        id: String,
        limitName: String,
        description: String,
        user: String,
        date: Date,
    },
    {
        _id: false,
    }
);

const LimitSchema: Schema = new Schema(
    {
        id: { type: String, required: true, unique: true },
        deviceType: { type: String, required: true },
        deviceID: { type: String, required: true },
        limitations: {
            type: [limitSchema],
            required: true,
        },
        scenario: { type: String, required: true },
        // createdDate: { type: Date, default: Date.now },
    },
    {
        timestamps: true,
    }
);

// LimitSchema.set("toJSON", {
//     virtuals: true,
//     versionKey: false,
// });

export default mongoose.models.Limit ||
    mongoose.model<Data>("Limit", LimitSchema);
