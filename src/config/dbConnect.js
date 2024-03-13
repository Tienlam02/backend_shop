const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    conn.connection.readyState === 1
      ? console.log("ConnectDB Successfully")
      : console.log("Connecting");
  } catch (error) {
    console.log("Connect DB failed");
    console.log(error);
  }
};

module.exports = connectDB;
