// models/Limitation.ts

import mongoose from "mongoose";

export type ILimitation = {
    id: number;
    name: string;
    description: string;
    version: string;
    status: boolean;
};

const limitationSchema: mongoose.Schema = new mongoose.Schema(
    {
        id: { type: Number, required: true },
        name: { type: String, required: true },
        description: { type: String, required: true },
        version: { type: String, required: true },
        status: { type: Boolean, required: true },
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
    mongoose.model<ILimitation>("Limitation", limitationSchema);
