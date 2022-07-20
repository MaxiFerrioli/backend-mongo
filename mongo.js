const mongoose = require("mongoose");
const connectionString = process.env.MONGO_DB_URI;

//Conexion a mongodb
mongoose
  .connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // useFindAndModify: false,
    // useCreateIndex: true,
  })
  .then(() => {
    console.log("database connected");
  })
  .catch((err) => {
    console.log(err);
  });

process.on("uncaughtException", () => {
  mongoose.connection.disconnect();
});
