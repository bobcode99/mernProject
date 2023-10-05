export type Data = {
    id: string;
    deviceType: string;
    deviceID: string;
    limitations: Array<Limit>;
    scenario: string;
    user: string;
    log: string;
};

export type Limit = {
    id: string;
    name: string;
    description: string;
    status: boolean;
    version: string;
};
