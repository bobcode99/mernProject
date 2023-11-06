export type Data = {
    id: string;
    deviceType: string;
    deviceID: string;
    limitations: Array<LimitationsType>;
    scenario: string;
};

export type DataWithTimestamps = Data & {
    createdAt: Date;
    updatedAt: Date;
};

export type LimitIdType = string;

export type LimitationsType = {
    id: LimitIdType;
    limitName: string;
    description: string;
    user: string;
    date: Date;
};

export type LimitWithIdNameDesc = Omit<LimitationsType, "user" | "date">;

export type BodyPutType = {
    actionWithUserLimits: {
        user: string;
        ADD: Array<LimitWithIdNameDesc>;
        DELETE: Array<LimitWithIdNameDesc>;
    };
};

export type needAddDeleteIdsUserType = {
    ADD: string[];
    DELETE: string[];
    user: string;
};

type BodyPutTypeThree =
    | { Add: Array<LimitWithIdNameDesc>; User: string }
    | { Delete: Array<LimitWithIdNameDesc>; User: string }
    | {
          Add: Array<LimitWithIdNameDesc>;
          Delete: Array<LimitWithIdNameDesc>;
          User: string;
      };
