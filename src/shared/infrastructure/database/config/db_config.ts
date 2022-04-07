import mongoose from "mongoose";
import config from "config";
import log from "../../../utils/logger";

async function connect() {
  const dbUri = config.get<string>("dbUri");

  log.info(`[DB]: Connecting to the database in ${"dev"} mode.`);

  try {
    await mongoose.connect(dbUri);
    log.info(`[DB]: Connected to the database in ${"dev"} mode.`);
  } catch (err: any) {
    process.exit(1);
  }
}

export default connect;
