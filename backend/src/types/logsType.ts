import { Limit } from "./data";
export type actionType = "ADD" | "DELETE";
export type LogsType = {
    logId: string;
    deviceType: string;
    deviceId: string;
    limitations: Array<Limit>;
    scenario: string;
    user: string;
    action: actionType;
};
