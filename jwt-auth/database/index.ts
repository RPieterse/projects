import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

const { DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT } = process.env;

const mongoMemory = new MongoMemoryServer();

async function connect(useMemoryDb?: "memory") {
  if (useMemoryDb === "memory") {
    const uri = mongoMemory.getUri();
    await mongoose.connect(uri, {});
  } else {
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
}

async function disconnect(useMemoryDb?: "memory") {
  if (useMemoryDb === "memory") {
    await mongoMemory.stop();
  }
  await mongoose.disconnect().catch((err) => console.log(err));
}

async function clearMemoryDb() {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
}

async function closeMemoryDb() {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoMemory.stop();
}

export default { connect, disconnect, clearMemoryDb, closeMemoryDb };
