import { model, Schema } from "mongoose";
export interface ICat {
    name: string;
    weight: number;
}

const catSchema: Schema = new Schema({
    name: {
        type: String,
        required: true,
    },
    weight: {
        type: Number,
        required: true,
    },
});
export const Cat = model<ICat>("cat", catSchema); // Cat Model
