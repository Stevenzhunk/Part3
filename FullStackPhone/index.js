const express = require("express");
const app = express();
const cors = require("cors"); //PORTS
const morgan = require("morgan"); //LOG
require("dotenv").config(); //ENV

const Phone = require("./models/phone");

morgan.token("type", (req, res) => {
  if (req.method !== "POST") {
    return "";
  }
  return JSON.stringify(req.body);
});

app.use(morgan(":method :url :status :response-time ms :type"));

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: "unknown endpoint" });
};

const errorHandler = (error, req, res, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return res.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return res.status(400).json({ error: error.message });
  }
  next(error);
};

app.use(express.json()) < app.use(cors());

//Loger req
const requestLogger = (req, res, next) => {
  console.log("Method:", req.method);
  console.log("Path:  ", req.path);
  console.log("Body:  ", req.body);
  console.log("---");
  next();
};
app.use(requestLogger);
//

app.get("/api/persons", (req, res) => {
  Phone.find({}).then((person) => {
    res.json(person);
  });
});

app.get("/", (req, res) => {
  res.send("<h1>My PhoneBook Api Rest</h1>");
});

app.get("/info", (req, res) => {
  const date = new Date();
  const sum = Phone.length;
  res.send(
    `<p>Phone have info for ${sum} people</p> 
    <p>${date}</p>`
  );
});

app.get("/api/persons/:id", (req, res) => {
  Phone.findById(req.params.id)
    .then((phone) => {
      if (phone) {
        res.json(phone);
      } else {
        res.status(404).end();
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(400).send({ error: "malformatted id" });
    });
});

app.delete("/api/persons/:id", (req, res, next) => {
  Phone.findByIdAndDelete(req.params.id)
    .then((result) => {
      res.status(400).end;
    })
    .catch((error) => next(error));
});

app.post("/api/persons", (req, res, next) => {
  const body = req.body;

  if (!body.name) {
    return res.status(400).json({
      error: "name missing",
    });
  }

  if (!body.number) {
    return res.status(400).json({
      error: "number missing",
    });
  }

  const person = new Phone({
    name: body.name,
    number: body.number,
  });
  //console.log(person)

  person
    .save()
    .then((savedPerson) => savedPerson.toJSON())
    .then((savedPersonandFormat) => {
      res.json(savedPersonandFormat);
    })
    .catch((error) => next(error));

  //persons=persons.concat(person)
});

app.put("/api/persons/:id", (req, res, next) => {
  const body = req.body;

  const person = {
    name: body.name,
    number: body.number,
  };

  Phone.findByIdAndUpdate(req.params.id, person, { new: true })
    .then((udapteNumber) => {
      res.json(udapteNumber);
    })
    .catch((error) => next(error));
});

app.use(errorHandler);
app.use(unknownEndpoint);
const PORT = process.env.PORT;
app.listen(PORT);
console.log(`Server running on port ${PORT}`);
