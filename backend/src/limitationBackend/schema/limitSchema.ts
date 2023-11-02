// models/Limitation.ts

import mongoose from "mongoose";
import { LimitationsType } from "../../types/data";

const limitationSchema: mongoose.Schema = new mongoose.Schema(
    {
        id: { type: Number, required: true },
        name: { type: String, required: true },
        description: { type: String, required: true },
        user: String,
    },
    {
        timestamps: true,
    }
);

limitationSchema.set("toJSON", {
    virtuals: true,
    versionKey: false,
});

export default mongoose.models.ILimitation ||
    mongoose.model<LimitationsType>("Limitation", limitationSchema);
