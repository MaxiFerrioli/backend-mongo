const mongoose = require("mongoose");
const password = require("./password.js");
const { model, Schema } = mongoose;

const connectionString = `mongodb+srv://maxiferrioli:${password}@cluster0.zzo0is4.mongodb.net/1er-backend?retryWrites=true&w=majority`;

//Conexion a mongodb

mongoose
  .connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("database connected");
  })
  .catch((err) => {
    console.log(err);
  });

const noteSchema = new Schema({
  content: String,
  date: Date,
  important: Boolean,
});

const Note = model("Note", noteSchema);

// Note.find({}).then((result) => {
//   console.log(result);
//   mongoose.connection.close();
// });

// const note = new Note({
//   content: "Mongodb es increible",
//   date: new Date(),
//   important: true,
// });

// note
//   .save()
//   .then((result) => {
//     console.log(result);
//     mongoose.connection.close();
//   })
//   .catch((err) => {
//     console.log(err);
//   });
