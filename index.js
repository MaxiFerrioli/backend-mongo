require("dotenv").config();
require("./mongo");
const express = require("express");
const app = express();
const Note = require("./models/Note");
const logger = require("./loggerMiddlewares");
const { response } = require("express");

//middlewares//
app.use(logger);
app.use(express.json());

let notes = [];

app.get("/", (request, response) => {
  response.send("<h1>Hello World</h1>");
});

app.get("/api/notes", (request, response) => {
  Note.find({}).then((notes) => {
    response.json(notes);
  });
});

app.get("/api/notes/:id", (request, response, next) => {
  const { id } = request.params;

  Note.findById(id)
    .then((note) => {
      if (note) {
        return response.json(note);
      } else {
        //Si existe el id mostralo, si no err 404.
        response.status(404).end();
      }
    })
    .catch((err) => {
      next(err);
    });
});

app.put("/api/notes/:id", (request, response, next) => {
  //Edita una nota
  const { id } = request.params;
  const note = request.body;
  const newNoteInfo = {
    content: note.content,
    important: note.important,
  };

  Note.findByIdAndUpdate(id, newNoteInfo).then((result) => {
    response.json(result);
  });
});

app.delete("/api/notes/:id", (request, response, next) => {
  const { id } = request.params;
  Note.findByIdAndRemove(id)
    .then((result) => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

app.post("/api/notes", (request, response) => {
  const note = request.params;

  if (!note || !note.content) {
    return response.status(400).json()({
      error: "required 'content' field is missing",
    });
  }

  const newNote = new Note({
    content: note.content,
    date: new Date(),
    important: note.import || false,
  });

  newNote.save().then((savedNote) => {
    response.json(savedNote);
  });
});

app.use((error, request, response, next) => {
  console.log(error);

  if (error.name === "CastError") {
    response.status(400).send({ error: "id used is malformed" });
  } else {
    response.status(500).end();
  }
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server runnig on por ${PORT}`);
});
