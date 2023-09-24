import * as dotenv from "dotenv";
import { AppConfig } from "../types/appConfig";
// import { cleanEnv, port, url } from "envalid";

dotenv.config();

console.log(process.env.FASTIFY_PORT_LIMITATION_DATA_POOL);
// export const env: AppConfig = cleanEnv(process.env, {
//   FASTIFY_PORT: port({
//     default: 8888,
//   }),
//   FASTIFY_HOST: url({
//     default: "localhost",
//   }),
//   MONGO_CONNECTION_STRING: url(),
// });
const port = parseInt(process.env.FASTIFY_PORT_LIMITATION_DATA_POOL || "8889");
export const env: AppConfig = {
    FASTIFY_HOST: process.env.FASTIFY_HOST || "0.0.0.0",
    FASTIFY_PORT: port,
    MONGO_CONNECTION_STRING:
        process.env.MONGO_CONNECTION_STRING_LIMITATION_DATA_POOL ||
        "mongodb://localhost:27017/dataPool",
};
