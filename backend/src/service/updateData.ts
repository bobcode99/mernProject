import {
    BodyPutType,
    Data,
    LimitIdType,
    LimitationsType,
    needAddDeleteIdsUserType,
} from "../types/data";
import * as dataRepo from "../repo/data-repo";
import { startSession } from "mongoose";
import { LogsType, LogsWithNoId } from "../types/logsType";
import { addLogs } from "./logs";
import { v4 as uuidv4 } from "uuid";
export const extractAddDeleteIdsAndUsers = (putBody: BodyPutType) => {
    const result: needAddDeleteIdsUserType = {
        ADD: [],
        DELETE: [],
        user: putBody.actionWithUserLimits.user,
    };
    const actionWithUserLimits = putBody.actionWithUserLimits;
    console.log("actionWithUserLimits: ", actionWithUserLimits);
    if (actionWithUserLimits.ADD) {
        result.ADD = actionWithUserLimits.ADD.map((item) => item.id);
    }

    if (actionWithUserLimits.DELETE) {
        result.DELETE = actionWithUserLimits.DELETE.map((item) => item.id);
    }
    console.log("result: ", JSON.stringify(result));

    return result;
};

export const idExistsInLimitations = (
    needUpdateLimitations: Array<LimitationsType>,
    id: LimitIdType
) => needUpdateLimitations.some((limit) => limit.id === id);

const limitsAdds = (
    limitsNeedAdd: Array<LimitationsType>,
    needAddDeleteIdsAndUser: needAddDeleteIdsUserType
) => {
    let shouldAddIds: string[] = [];
    if (needAddDeleteIdsAndUser.ADD && needAddDeleteIdsAndUser.ADD.length > 0) {
        console.log("HI");

        shouldAddIds = needAddDeleteIdsAndUser.ADD.filter(
            (id) => !idExistsInLimitations(limitsNeedAdd, id)
        );
    }
    return shouldAddIds;
};

const limitsDelete = (
    limitsNeedDelete: Array<LimitationsType>,
    needAddDeleteIdsAndUser: needAddDeleteIdsUserType
) => {
    let shouldDeleteIds: string[] = [];
    if (
        needAddDeleteIdsAndUser.DELETE &&
        needAddDeleteIdsAndUser.DELETE.length > 0
    ) {
        shouldDeleteIds = needAddDeleteIdsAndUser.DELETE.filter((id) =>
            idExistsInLimitations(limitsNeedDelete, id)
        );
    }
    return shouldDeleteIds;
};

const getCreateLogs: (
    logsWithNoId: LogsWithNoId,
    shouldIds: string[]
) => LogsWithNoId | null = (logsWithNoId, shouldIds) => {
    if (shouldIds.length === 0) {
        return null; // No need to create logs
    }
    return {
        user: logsWithNoId.user,
        deviceType: logsWithNoId.deviceType,
        deviceId: logsWithNoId.deviceId,
        limitations: logsWithNoId.limitations,
        scenario: logsWithNoId.scenario,
        action: logsWithNoId.action,
        dateAt: logsWithNoId.dateAt,
        actionDescription: `${logsWithNoId.action} ${shouldIds.join(", ")}`,
    };
};

// export
export const handleUpdateDataAndWriteLogs: (
    idDataNeedUpdate: string
) => (putBody: BodyPutType) => Promise<string> =
    (idDataNeedUpdate) => async (putBody) => {
        // const sessionMongo = startSession();
        console.log(putBody);
        const needUpdateData = await dataRepo.getDataById(idDataNeedUpdate);
        console.log("needUpdateData: ", needUpdateData);
        let needUpdatedLimitations = [...needUpdateData.limitations];

        // const needUpdateData = JSON.parse(getFromDbDataNeedUpdate);
        const needAddDeleteIdsAndUsers = extractAddDeleteIdsAndUsers(putBody);

        console.log("needAddDeleteIdsAndUsers: ", needAddDeleteIdsAndUsers);
        const dateNow = new Date();

        const shouldAddIds = limitsAdds(
            needUpdateData.limitations,
            needAddDeleteIdsAndUsers
        );
        const shouldDeleteIds = limitsDelete(
            needUpdateData.limitations,
            needAddDeleteIdsAndUsers
        );
        const limitsObjToAdd = putBody.actionWithUserLimits.ADD.filter(
            (obj) => shouldAddIds?.includes(obj.id)
        );

        const limitsObjWithUserDate = limitsObjToAdd.map((limitObject) => ({
            ...limitObject, // Copy the existing properties
            user: needAddDeleteIdsAndUsers.user, // Add the user property
            date: dateNow, // Add the date property
        }));

        console.log("limitsObjToAdd: ", limitsObjToAdd);

        console.log("needUpdatedLimitations before: ", needUpdatedLimitations);
        console.log("limitsObjWithUserDate: ", limitsObjWithUserDate);

        if (shouldAddIds.length > 0) {
            needUpdatedLimitations = needUpdatedLimitations.concat(
                limitsObjWithUserDate
            );
        }
        console.log(
            "needUpdatedLimitations after add: ",
            needUpdatedLimitations
        );

        if (shouldDeleteIds.length > 0) {
            needUpdatedLimitations = needUpdatedLimitations.filter(
                (limit) => !shouldDeleteIds.includes(limit.id)
            );
        }
        console.log("needUpdatedLimitations final: ", needUpdatedLimitations);

        const {
            limitations,
            _id,
            createdAt,
            updatedAt,
            __v,
            ...dataExcludesLimitations
        } = needUpdateData;

        const dataWithNewLimitations: Data = {
            ...dataExcludesLimitations,
            limitations: needUpdatedLimitations,
        };
        console.log("dataWithNewLimitations: ", dataWithNewLimitations);
        // update
        const updateResult = dataRepo.updateData(
            idDataNeedUpdate,
            needUpdatedLimitations
        );
        console.log("updateResult: ", updateResult);

        // Since i got three scenario, first is only have add logs, second is only have delete logs, third is have both add and delete logs.
        const addLogsNeedWrite = getCreateLogs(
            {
                action: "ADD",
                scenario: needUpdateData.scenario,
                deviceId: needUpdateData.deviceID,
                deviceType: needUpdateData.deviceType,
                user: needAddDeleteIdsAndUsers.user,
                dateAt: dateNow,
                limitations: needUpdatedLimitations,
                actionDescription: `ADD ${shouldAddIds.join(", ")}`,
            },
            shouldAddIds
        );
        const deleteLogsNeedWrite = getCreateLogs(
            {
                action: "DELETE",
                scenario: needUpdateData.scenario,
                deviceId: needUpdateData.deviceID,
                deviceType: needUpdateData.deviceType,
                user: needAddDeleteIdsAndUsers.user,
                dateAt: dateNow,
                limitations: needUpdatedLimitations,
                actionDescription: `DELETE ${shouldDeleteIds.join(", ")}`,
            },
            shouldDeleteIds
        );

        // write logs
        if (addLogsNeedWrite && deleteLogsNeedWrite) {
            const uniqueIdRepresentSameAction = uuidv4();
            const realNeedCreateAddLogs: LogsType = {
                ...addLogsNeedWrite,
                logId: uuidv4(),
                uuid: uniqueIdRepresentSameAction,
            };
            const realDeleteCreateAddLogs: LogsType = {
                ...deleteLogsNeedWrite,
                logId: uuidv4(),
                uuid: uniqueIdRepresentSameAction,
            };
            await addLogs(realNeedCreateAddLogs);
            await addLogs(realDeleteCreateAddLogs);
        } else if (addLogsNeedWrite) {
            const realNeedCreateAddLogs: LogsType = {
                ...addLogsNeedWrite,
                logId: uuidv4(),
            };
            await addLogs(realNeedCreateAddLogs);
        } else if (deleteLogsNeedWrite) {
            const realDeleteCreateAddLogs: LogsType = {
                ...deleteLogsNeedWrite,
                logId: uuidv4(),
            };
            await addLogs(realDeleteCreateAddLogs);
        }
        return "asd";
    };
