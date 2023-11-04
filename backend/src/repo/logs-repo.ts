import { LogsType } from "../types/logsType";
import LogsSchema from "./../models/logs";
export const addLogs: (logsBody: LogsType) => Promise<LogsType> = (
    logsBody
) => {
    return LogsSchema.create(logsBody);
};

export const getAllLogs: () => Promise<Array<LogsType>> = () => {
    return LogsSchema.find().exec();
};
