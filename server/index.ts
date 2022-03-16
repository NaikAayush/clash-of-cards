import express from "express";

import cors from "cors";
import { createClient } from "redis";
import { RedisClientType } from "@node-redis/client";

import "dotenv/config";
import { pinata } from "./routes/pinata";
import { contract } from "./routes/contract";

export let client: RedisClientType;

(async () => {
  client = createClient({ url: process.env.redis });
  client.on("error", (err) => console.log("Redis Client Error", err));
  await client.connect();
  //   console.log(await client.flushDb());
  //   console.log(await client.dbSize());
})();

const app = express();

const options: cors.CorsOptions = {
  origin: "*",
};
app.use(cors(options));
const port = 8080;

app.use("", pinata);
app.use("", contract);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
