import mongoose, { Schema } from "mongoose";
import { LogsType } from "../types/logsType";
import { limitSchema } from "./dataModel";

const logsSchema: Schema = new Schema(
    {
        logId: { type: String, required: true, unique: true },
        deviceType: { type: String, required: true },
        deviceID: { type: String, required: true },
        limitations: {
            type: [limitSchema],
            required: true,
        },
        scenario: { type: String, required: true },
        user: { type: String, required: true },
        action: { type: String, enum: ["ADD", "DELETE"] },
        dateAt: { type: Date, required: true },
        actionDescription: { type: String, required: true },
        uuid: { type: String },
    },
    {
        timestamps: true,
    }
);

logsSchema.set("toJSON", {
    virtuals: true,
    versionKey: false,
});

export default mongoose.models.Logs ||
    mongoose.model<LogsType>("Logs", logsSchema);
