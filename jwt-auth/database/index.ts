import mongoose from "mongoose";

const { DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT } = process.env;

async function connect() {
  await mongoose
    .connect(
      `mongodb://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`
    )
    .catch((err) => console.log(err));
}

async function disconnect() {
  await mongoose.disconnect().catch((err) => console.log(err));
}

export default { connect, disconnect };
