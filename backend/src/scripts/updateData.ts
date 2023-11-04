import { BodyPut, Data, LimitIdType, LimitationsType } from "../types/data";
import * as repo from "../repo/data-repo";

import { Option, none, some, fold } from "fp-ts/lib/Option";
import { pipe } from "fp-ts/lib/function";
import * as A from "fp-ts/lib/Array";

export const updateData = async (idNeedUpdate: string, bodyPut: BodyPut) => {
    const needAddLimitsIdArr = bodyPut.add;
    const needDeleteLimitsIdArr = bodyPut.delete;
    const needUpdateData = await repo.getDataById(idNeedUpdate);

    const limitationsFromData = needUpdateData.limitations;

    const needUpdateLimitations: [LimitationsType] = [
        {
            id: "l8",
            limitName: "WATER_DAMAGE3",
            description: "water damage",
            user: "Jammy",
        },
    ];
    return await repo.updateData(idNeedUpdate, needUpdateLimitations);
};

// -----------------------------------------

function updateDataObject(
    originalData: Data,
    body: BodyPut
): { updatedData: Data; actionLogs: string[] } {
    // Create a deep copy of the original data
    const updatedData: Data = JSON.parse(JSON.stringify(originalData));

    const actionLogs: string[] = [];

    // Remove IDs from 'add' if they already exist
    if (body.add && body.add.length > 0) {
        const addedIds = body.add.filter(
            (id) => !updatedData.limitations.some((limit) => limit.id === id)
        );
        if (addedIds.length > 0) {
            updatedData.limitations = updatedData.limitations.concat(
                addedIds.map((id) => ({
                    id,
                    limitName: `LimitName${id}`,
                    description: `Description${id}`,
                    user: `User${id}`,
                }))
            );
            actionLogs.push(`Added: ${addedIds.join(", ")}`);
        }
    }

    // Remove IDs from 'delete' if they exist
    if (body.delete && body.delete.length > 0) {
        const deletedIds = body.delete.filter((id) =>
            updatedData.limitations.some((limit) => limit.id === id)
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
        },
        {
            id: "l2",
            limitName: "Limit2",
            description: "Description2",
            user: "User2",
        },
        {
            id: "l9",
            limitName: "Limit9",
            description: "Description9",
            user: "User2",
        },
        {
            id: "l10",
            limitName: "Limit10",
            description: "Description10",
            user: "User10",
        },
    ],
    scenario: "Scenario",
    user: "User",
};
function updateDataObjectMoreClean(
    originalData: Data,
    body: BodyPut
): { updatedData: Data; actionLogs: string[] } {
    // Create a deep copy of the original data
    const updatedData: Data = JSON.parse(JSON.stringify(originalData));

    const actionLogs: string[] = [];

    // Function to check if an ID exists in the limitations
    const idExistsInLimitations = (id: LimitIdType) =>
        updatedData.limitations.some((limit) => limit.id === id);

    if (body.add && body.add.length > 0) {
        const addedIds = body.add.filter((id) => !idExistsInLimitations(id));
        if (addedIds.length > 0) {
            updatedData.limitations = updatedData.limitations.concat(
                addedIds.map((id) => ({
                    id,
                    limitName: `LimitName${id} new`,
                    description: `Description${id} new`,
                    user: `User${id}`,
                }))
            );
            actionLogs.push(`Added: ${addedIds.join(", ")}`);
        }
    }

    if (body.delete && body.delete.length > 0) {
        const deletedIds = body.delete.filter(idExistsInLimitations);
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
//         body.add,
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

const bodyNeedPut: BodyPut = {
    add: ["l2", "l3", "l10", "l6"], // List of ids to add (l2, l10 already exists)
    delete: ["l1", "l4", "l9"], // List of ids to delete (l1, l9 will be delete, l4 is will not delete)
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
