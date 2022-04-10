import "dotenv/config";
import mongoose from "mongoose";
import log from "../../../utils/logger";

async function connect() {
  const dbUri = process.env.DDD_FORUM_DB_HOST as string;

  log.info(`[DB]: Connecting to the database in ${"dev"} mode.`);

  try {
    await mongoose.connect(dbUri);
    log.info(`[DB]: Connected to the database in ${"dev"} mode.`);
  } catch (err: any) {
    process.exit(1);
  }
}

export default connect;
