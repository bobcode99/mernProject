import DataSchema from "./../models/dataModel";
import {
    BodyPutType,
    Data,
    DataWithTimestamps,
    LimitationsType,
} from "./../types/data";
import * as RTE from "fp-ts/ReaderTaskEither";
import { Document } from "mongoose";
export const getData: () => Promise<Array<Data>> = () => {
    return DataSchema.find().exec();
};

export const addData: (dataBody: Data) => Promise<Data> = (dataBody) => {
    return DataSchema.create(dataBody);
};

type ExtendedData = DataWithTimestamps & Document;
export const getDataById: (id: string) => Promise<ExtendedData> = (id) => {
    return DataSchema.findOne({ id: id }).exec();
};

export const updateData: (
    id: string,
    dataBody: LimitationsType[]
    // dataBody: Data
) => Promise<Data | null> = async (id, dataBody) => {
    console.log("dataBody: ", dataBody);

    const updatedDocument = DataSchema.findOneAndUpdate(
        { id: id },
        {
            limitations: dataBody,
        }, // Use the $set operator
        { new: true, context: "query" }
    ).exec();
    if (!updatedDocument) {
        console.log(`Document with id ${id} not found.`);
        return null;
    }
    return updatedDocument;
};

// export const updateData: (
//     id: string,
//     dataBody: LimitationsType[]
//     // dataNew: Data
// ) => Promise<Data | null> = (id, dataBody) => {
//     try {
//         const updatedDocument = DataSchema.findOneAndUpdate(
//             { id: id }, // Query to find the document by id
//             { limitations: dataBody }, // The update data
//             { new: true } // Return the updated document
//         );

//         console.log("Updated document:", updatedDocument);
//         return updatedDocument;
//     } catch (error) {
//         console.error("Error updating document:", error);
//         return error
//         throw error; // Handle the error as needed in your application
//     }
// };

export const deleteById: (id: string) => Promise<Data | null> = (id) => {
    return DataSchema.findOneAndDelete({ id: id });
};
