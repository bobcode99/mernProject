import mongoose from "mongoose";

export type User = {
    name: string;
    email: string;
};
const UserSchema = new mongoose.Schema({
    name: String,
    email: String,
});

// const UserModel = mongoose.model<User>("User", UserSchema);

export default mongoose.models.Limit ||
    mongoose.model<User>("Limit", UserSchema);
