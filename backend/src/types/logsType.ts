import { LimitationsType } from "./data";
export type actionType = "ADD" | "DELETE";
export type LogsType = {
    logId: string;
    deviceType: string;
    deviceId: string;
    limitations: Array<LimitationsType>;
    scenario: string;
    user: string;
    action: actionType;
    dateAt: Date;
    actionDescription: string;
    uuid?: string;
};

export type LogsWithNoId = Omit<LogsType, "logId" | "uuid">;
