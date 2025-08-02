const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
const initData = require("./data.js");

const mongoUrl =
  "mongodb+srv://wm66179:saifmalik28@cluster0.ti04esi.mongodb.net/crud?retryWrites=true&w=majority";
mongoose.connect(mongoUrl);

const initDB = async () => {
  await Listing.deleteMany({});
  initData.data = initData.data.map((obj) => ({
    ...obj,
    owner: "688e302c1f62956c8e226c49",
  }));
  await Listing.insertMany(initData.data);
  console.log("data was initilized");
};

initDB();

////////////////mongodb connected disconnected events///////////////////////////////////////////////
mongoose.connection.on("connected", function () {
  console.log("Mongoose is connected");
});
mongoose.connection.on("disconnected", function () {
  console.log("Mongoose is disconnected");
  process.exit(1);
});
mongoose.connection.on("error", function (err) {
  console.log("Mongoose connection error: ", err);
  process.exit(1);
});
process.on("SIGINT", function () {
  console.log("app is terminating");
  mongoose.connection.close(function () {
    console.log("Mongoose default connection closed");
    process.exit(0);
  });
});
