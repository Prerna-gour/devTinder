const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect("mongodb+srv://PrernaGour:Prerna%402904@namastenode.yan6aff.mongodb.net/devTinder",);
};

module.exports = connectDB;


