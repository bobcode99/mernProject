import { BodyPutType, Data, LimitIdType, LimitationsType } from "../types/data";
import * as repo from "../repo/data-repo";

import { Option, none, some, fold } from "fp-ts/lib/Option";
import { pipe } from "fp-ts/lib/function";
import * as A from "fp-ts/lib/Array";

function extractAddDeleteIdsAndUsers(putBody: BodyPutType) {
    const result: { ADD: string[]; DELETE: string[]; user: string } = {
        ADD: [],
        DELETE: [],
        user: putBody.actionWithUserLimits.user,
    };
    const actionWithUserLimits = putBody.actionWithUserLimits;
    if (actionWithUserLimits.ADD) {
        result.ADD = actionWithUserLimits.ADD.map((item) => item.id);
    }

    if (actionWithUserLimits.DELETE) {
        result.DELETE = actionWithUserLimits.DELETE.map((item) => item.id);
    }

    return result;
}

export const updateData = async (
    idNeedUpdate: string,
    bodyPut: BodyPutType
) => {
    const needAddLimitsIdArr = bodyPut.actionWithUserLimits.ADD;
    const needDeleteLimitsIdArr = bodyPut.actionWithUserLimits.ADD;
    const needUpdateData = await repo.getDataById(idNeedUpdate);

    const limitationsFromData = needUpdateData.limitations;

    const needUpdateLimitations: [LimitationsType] = [
        {
            id: "l8",
            limitName: "WATER_DAMAGE3",
            description: "water damage",
            user: "Jammy",
            date: new Date("2023-11-04T09:50:08.761Z"),
        },
    ];
    return await repo.updateData(idNeedUpdate, needUpdateLimitations);
};

// -----------------------------------------

// function updateDataObject(
//     originalData: Data,
//     body: BodyPutType
// ): { updatedData: Data; actionLogs: string[] } {
//     // Create a deep copy of the original data
//     const updatedData: Data = JSON.parse(JSON.stringify(originalData));

//     const actionLogs: string[] = [];

//     // Remove IDs from 'add' if they already exist
//     if (body.add && body.add.length > 0) {
//         const addedIds = body.add.filter(
//             (id) => !updatedData.limitations.some((limit) => limit.id === id)
//         );
//         if (addedIds.length > 0) {
//             updatedData.limitations = updatedData.limitations.concat(
//                 addedIds.map((id) => ({
//                     id,
//                     limitName: `LimitName${id}`,
//                     description: `Description${id}`,
//                     user: `User${id}`,
//                 }))
//             );
//             actionLogs.push(`Added: ${addedIds.join(", ")}`);
//         }
//     }

//     // Remove IDs from 'delete' if they exist
//     if (body.delete && body.delete.length > 0) {
//         const deletedIds = body.delete.filter((id) =>
//             updatedData.limitations.some((limit) => limit.id === id)
//         );
//         if (deletedIds.length > 0) {
//             updatedData.limitations = updatedData.limitations.filter(
//                 (limit) => !deletedIds.includes(limit.id)
//             );
//             actionLogs.push(`Deleted: ${deletedIds.join(", ")}`);
//         }
//     }

//     return { updatedData, actionLogs };
// }

// Example usage:
const originalData: Data = {
    id: "1",
    deviceType: "DeviceType",
    deviceID: "DeviceID",
    limitations: [
        {
            id: "l1",
            limitName: "Limit1",
            description: "Description1",
            user: "User1",
            date: new Date("2023-11-04T09:50:08.761Z"),
        },
        {
            id: "l2",
            limitName: "Limit2",
            description: "Description2",
            user: "User2",
            date: new Date("2023-11-04T09:50:08.761Z"),
        },
        {
            id: "l9",
            limitName: "Limit9",
            description: "Description9",
            user: "User2",
            date: new Date("2023-11-04T09:50:08.761Z"),
        },
        {
            id: "l10",
            limitName: "Limit10",
            description: "Description10",
            user: "User10",
            date: new Date("2023-11-04T09:50:08.761Z"),
        },
    ],
    scenario: "Scenario",
};
function updateDataObjectMoreClean(
    originalData: Data,
    body: BodyPutType
): { updatedData: Data; actionLogs: string[] } {
    // Create a deep copy of the original data
    const updatedData: Data = JSON.parse(JSON.stringify(originalData));

    const actionLogs: string[] = [];

    // Function to check if an ID exists in the limitations
    const idExistsInLimitations = (id: LimitIdType) =>
        updatedData.limitations.some((limit) => limit.id === id);

    const dateNow = new Date();
    const needAddLimitsIdsAndUser = extractAddDeleteIdsAndUsers(body);
    if (needAddLimitsIdsAndUser.ADD && needAddLimitsIdsAndUser.ADD.length > 0) {
        const addedIds = needAddLimitsIdsAndUser.ADD.filter(
            (id) => !idExistsInLimitations(id)
        );
        if (addedIds.length > 0) {
            updatedData.limitations = updatedData.limitations.concat(
                addedIds.map((id) => ({
                    id,
                    limitName: `LimitName${id} new`,
                    description: `Description${id} new`,
                    user: `User${id}`,
                    date: new Date(dateNow),
                }))
            );
            actionLogs.push(`Added: ${addedIds.join(", ")}`);
        }
    }

    if (
        needAddLimitsIdsAndUser.DELETE &&
        needAddLimitsIdsAndUser.DELETE.length > 0
    ) {
        const deletedIds = needAddLimitsIdsAndUser.DELETE.filter(
            idExistsInLimitations
        );
        if (deletedIds.length > 0) {
            updatedData.limitations = updatedData.limitations.filter(
                (limit) => !deletedIds.includes(limit.id)
            );
            actionLogs.push(`Deleted: ${deletedIds.join(", ")}`);
        }
    }

    return { updatedData, actionLogs };
}

// function updateDataObjectFp(
//     originalData: Data,
//     body: BodyPut
// ): { updatedData: Data; actionLogs: string[] } {
//     const updatedData: Data = { ...originalData };

//     const idExistsInLimitations = (id: LimitIdType) =>
//         updatedData.limitations.some((limit) => limit.id === id);

//     const addedIds = pipe(
//         body.ADD,
//         A.filter((id) => !idExistsInLimitations(id))
//     );

//     const deletedIds = pipe(body.delete, A.filter(idExistsInLimitations));

//     const addLog =
//         addedIds.length > 0 ? some(`Added: ${addedIds.join(", ")}`) : none;
//     const deleteLog =
//         deletedIds.length > 0
//             ? some(`Deleted: ${deletedIds.join(", ")}`)
//             : none;

//     const actionLogs = pipe(
//         A.catOptions([addLog, deleteLog]),
//         A.map((log) => some(log)),
//         A.concat([]),
//         fold(
//             () => [],
//             (logs) => logs
//         )
//     );

//     updatedData.limitations = pipe(
//         addedIds,
//         A.map((id) => ({
//             id,
//             limitName: `LimitName${id}`,
//             description: `Description${id}`,
//             user: `User${id}`,
//         }))
//     );

//     updatedData.limitations = pipe(
//         updatedData.limitations,
//         A.filter((limit) => !deletedIds.includes(limit.id))
//     );

//     return { updatedData, actionLogs };
// }

const bodyNeedPut: BodyPutType = {
    actionWithUserLimits: {
        ADD: [
            { id: "l2", description: "l2 des", limitName: "Limit 2" },
            { id: "l3", description: "l3 des", limitName: "Limit 3" },
            { id: "l10", description: "l10 des", limitName: "Limit 10" },
            { id: "l6", description: "l6 des", limitName: "Limit 6" },
        ],
        DELETE: [
            { id: "l1", description: "l1 des", limitName: "limit 1" },
            { id: "l4", description: "l4 des", limitName: "limit 4" },
            { id: "l9", description: "l9 des", limitName: "limit 9" },
        ],
        user: "Konapi",
    },
    // add: ["l2", "l3", "l10", "l6"], // List of ids to add (l2, l10 already exists)
    // delete: ["l1", "l4", "l9"], // List of ids to delete (l1, l9 will be delete, l4 is will not delete)
};

const { updatedData, actionLogs } = updateDataObjectMoreClean(
    originalData,
    bodyNeedPut
);

// Log the actionLogs
actionLogs.forEach((log) => {
    console.log(log);
});

console.log("updateResult: ", updatedData);
