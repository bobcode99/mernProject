export type Data = {
    id: string;
    deviceType: string;
    deviceID: string;
    limitations: Array<Limit>;
    scenario: string;
    user: string;
};

export type Limit = {
    id: string;
    limitName: string;
    description: string;
    user: string;
};

export type BodyPut = {
    add: [Limit];
    delete: [Limit];
};
