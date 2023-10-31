import mongoose from "mongoose";

export const establishConnection = async (connectionString: string) => {
    await mongoose.connect(connectionString);
};

export const closeMongoose = async () => {
    await mongoose.connection.close();
};
