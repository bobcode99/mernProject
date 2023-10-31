import DataSchema from "./../models/dataModel";
import { BodyPut, Data } from "./../types/data";

export const getData: () => Promise<Array<Data>> = () => {
    return DataSchema.find().exec();
};

export const addData: (dataBody: Data) => Promise<Data> = (dataBody) => {
    return DataSchema.create(dataBody);
};

export const getDataById: (id: string) => Promise<Data> = (id) => {
    return DataSchema.findOne({ id: id }).exec();
};

export const updateData: (
    id: string,
    dataBody: BodyPut
) => Promise<Data | null> = (id, dataBody) => {
    console.log("dataBody: ", dataBody);

    // const needDelete = dataBody.delete[0];
    return DataSchema.findOneAndUpdate(
        { id: id },
        {
            $addToSet: { limitations: { $each: dataBody.add } },
            // $pull: { limitations: { name: { $in: "WATER_DAMAGE" } } },
            // $pullAll: { limitations: dataBody.delete },
            // $pull: { limitations: { name: { $in: dataBody.delete } } },
        },
        { new: true }
    );
};

export const deleteById: (id: string) => Promise<Data | null> = (id) => {
    return DataSchema.findOneAndDelete({ id: id });
};
