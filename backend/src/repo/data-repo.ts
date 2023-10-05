import DataSchema from "./../models/dataModel";
import { Data } from "./../types/data";

export const getData: () => Promise<Array<Data>> = () => {
    return DataSchema.find().exec();
};

export const addData: (dataBody: Data) => Promise<Data> = (dataBody) => {
    return DataSchema.create(dataBody);
};

export const updateData: (
    id: string,
    dataBody: Data
) => Promise<Data | null> = (id, dataBody) => {
    return DataSchema.findByIdAndUpdate(id, dataBody, { new: true });
};

export const deleteTodo: (id: string) => Promise<Data | null> = (id) => {
    return DataSchema.findByIdAndDelete(id);
};
