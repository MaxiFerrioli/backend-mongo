module.exports = (error, request, response, next) => {
  console.log(error);

  if (error.name === "CastError") {
    response.status(400).send({ error: "id used is malformed" });
  } else {
    response.status(500).end();
  }
};
