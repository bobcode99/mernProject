export type Data = {
    id: string;
    deviceType: string;
    deviceID: string;
    limitations: Array<LimitationsType>;
    scenario: string;
    user: string;
};

export type LimitIdType = string;

export type LimitationsType = {
    id: LimitIdType;
    limitName: string;
    description: string;
    user: string;
};

export type BodyPut = {
    add: Array<LimitIdType>;
    delete: Array<LimitIdType>;
};
