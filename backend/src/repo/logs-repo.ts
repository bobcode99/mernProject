import { ClientSession } from "mongoose";
import { LogsType } from "../types/logsType";
import LogsSchema from "./../models/logs";
export const addLogs: (
    logsBody: LogsType,
    session: ClientSession
) => Promise<LogsType> = (logsBody, session) => {
    return LogsSchema.create(logsBody, { session: session }).then(
        (createdLogs) => {
            // Ensure only one document is created
            if (Array.isArray(createdLogs)) {
                return createdLogs[0];
            } else {
                return createdLogs;
            }
        }
    );
};

export const getAllLogs: () => Promise<Array<LogsType>> = () => {
    return LogsSchema.find().exec();
};
