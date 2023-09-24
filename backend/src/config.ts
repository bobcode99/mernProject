import * as dotenv from "dotenv";
// import { cleanEnv, port, url } from "envalid";

import { AppConfig } from "./types/appConfig";

dotenv.config();

console.log(process.env.FASTIFY_PORT);
// export const env: AppConfig = cleanEnv(process.env, {
//   FASTIFY_PORT: port({
//     default: 8888,
//   }),
//   FASTIFY_HOST: url({
//     default: "localhost",
//   }),
//   MONGO_CONNECTION_STRING: url(),
// });
const port = parseInt(process.env.FASTIFY_PORT || "8888");
export const env: AppConfig = {
    FASTIFY_HOST: process.env.FASTIFY_HOST || "0.0.0.0",
    FASTIFY_PORT: port,
    MONGO_CONNECTION_STRING:
        process.env.MONGO_CONNECTION_STRING_DATA_POOL ||
        "mongodb://localhost:27017/dataPool",
};
