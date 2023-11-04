import { BodyPutType } from "../types/data";
import * as dataRepo from "../repo/data-repo";

const handleUpdateDataAndWriteLogs: (
    idDataNeedUpdate: string
) => (putBody: BodyPutType) => Promise<string> =
    (idDataNeedUpdate) => async (putBody) => {
        console.log(putBody);
        const needUpdateData = await dataRepo.getDataById(idDataNeedUpdate);
        return "asd";
    };
