import "dotenv/config";
import express from "express";
import log from "../utils/logger";
import cors from "cors";

import { v1Router } from "./http/api/v1";
import { isProduction } from "../../config";

const app = express();

const options = {
  origin: isProduction ? "http://localhost:3000" : "*",
};

app.use(cors());
app.options(options.origin, cors);

app.use(express.json({}));

app.use("/api/v1", v1Router);

const port = process.env.APP_PORT;

app.listen(port || 4000, () => {
  log.info(`App started at http://localhost:${port}`);
});
