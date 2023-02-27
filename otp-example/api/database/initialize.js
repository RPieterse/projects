const mongoose = require("mongoose");

async function connect(showLog = true) {
  await mongoose
    .set("strictQuery", false)
    .connect(`mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@127.0.0.1:27017/${process.env.DB_DATABASE}?authSource=admin`);
    if (showLog) console.log('DB Connected...')
}

async function disconnect(showLog = true){
  await mongoose.disconnect()
  if (showLog) console.log('DB Connection closed...')
}

const cleanup = async () => { 
  await disconnect()// Close MongodDB Connection when Process ends
  process.exit(); // Exit with default success-code '0'.
}

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);

module.exports = {connect, disconnect}
