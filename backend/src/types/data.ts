export type Data = {
  deviceType: string;
  devideID: string;
  limitation: Array<Limit>;
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
