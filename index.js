require("dotenv").config();
require("./mongo");
const express = require("express");
const app = express();
const Note = require("./models/Note");
const logger = require("./loggerMiddlewares");
const { response } = require("express");
const notFound = require("./middleware/notFound");
const handleErrors = require("./middleware/handleErrors");

//middlewares//
app.use(logger);
app.use(express.json());

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
  //Actualiza/edita una nota
  const { id } = request.params;
  const note = request.body;

  const newNoteInfo = {
    content: note.content,
    important: note.important,
  };
  Note.findByIdAndUpdate(id, newNoteInfo, { new: true })
    .then((result) => {
      response.json(result);
    })
    .catch((err) => next(err));
});

app.delete("/api/notes/:id", (request, response, next) => {
  const { id } = request.params;
  Note.findByIdAndRemove(id)
    .then(() => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

app.post("/api/notes", (request, response, next) => {
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

  newNote
    .save()
    .then((savedNote) => {
      response.json(savedNote);
    })
    .catch((err) => next(err));
});

app.use(notFound);
app.use(handleErrors);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server runnig on por ${PORT}`);
});
