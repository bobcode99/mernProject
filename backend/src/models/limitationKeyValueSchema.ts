import { Schema } from "mongoose";

const limitationValue = new Schema({
    limitName: String,
    description: String,
    user: String,
    date: Date,
});
export const limitationKeyValueSchema: Schema = new Schema({
    limitationId: {
        type: [limitationValue],
        require: true,
    },
});
