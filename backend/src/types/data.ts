export type Data = {
    id: string;
    deviceType: string;
    deviceID: string;
    limitations: Array<LimitationsType>;
    scenario: string;
};

export type LimitIdType = string;

export type LimitationsType = {
    id: LimitIdType;
    limitName: string;
    description: string;
    user: string;
    date: Date;
};

type LimitWithIdNameDesc = Omit<LimitationsType, "user" | "date">;

export type BodyPutType = {
    actionWithUserLimits: {
        user: string;
        ADD: Array<LimitWithIdNameDesc>;
        DELETE: Array<LimitWithIdNameDesc>;
    };
};
