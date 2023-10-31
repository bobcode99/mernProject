import mongoose, { Schema } from "mongoose";
import limitSchema from "../limitationBackend/schema/limitSchema";
import { LogsType } from "../types/logsType";

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
    },
    {
        timestamps: true,
    }
);

logsSchema.set("toJSON", {
    virtuals: true,
    versionKey: false,
});

export default mongoose.models.Limit ||
    mongoose.model<LogsType>("Limit", logsSchema);
