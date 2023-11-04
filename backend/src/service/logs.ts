import { LogsType } from "../types/logsType";
import * as repo from "./../repo/logs-repo";

export const getAllLogs = repo.getAllLogs();
export const addLogs = (logsBody: LogsType) => repo.addLogs(logsBody);
