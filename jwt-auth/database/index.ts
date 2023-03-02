import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

const { DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT } = process.env;

let mongoMemory: MongoMemoryServer | null = null;

async function connect() {
  if (
    DB_HOST === undefined ||
    DB_PORT === undefined ||
    DB_NAME === undefined ||
    DB_USER === undefined ||
    DB_PASSWORD === undefined
  ) {
    throw new Error("Database connection string is not defined");
  }
  if (mongoose.connection.readyState >= 1) return;
  await mongoose
    .connect(
      `mongodb://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`
    )
    .catch((err) => console.log(err));
}

async function disconnect() {
  await mongoose.disconnect().catch((err) => console.log(err));
}

async function connectMemoryDb() {
  if (mongoMemory) return;
  if (mongoose.connection.readyState >= 1) return;
  mongoMemory = await MongoMemoryServer.create();
  const uri = mongoMemory.getUri();
  await mongoose.connect(uri);
}
async function closeMemoryDb() {
  if (mongoMemory) {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongoMemory.stop();
  }
}

export default { connect, disconnect, closeMemoryDb, connectMemoryDb };
