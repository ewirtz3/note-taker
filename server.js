//setting up dependencies
const fs = require("fs");
const path = require("path");
const { promisify } = require("util");
const { v4: uuidv4 } = require("uuid");
const express = require("express");

//setting up Express and defining PORT
const app = express();
const PORT = process.env.PORT || 3000;

//promisifying fs.readFile and fs.appendFile
const readFileAsync = promisify(fs.readFile);
const appendFileAsync = promisify(fs.appendFile);

//middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//creating HTML routes
app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/notes", function (req, res) {
  res.sendFile(path.join(__dirname, "public", "notes.html"));
});

//creating API routes
app.get("/api/notes", function (req, res) {
  readFileAsync(path.join(__dirname, "db", "db.json"), "utf8").then(function (
    notes
  ) {
    return res.json(notes);
  });
});

app.post("/api/notes", function (req, res) {
  console.log("sure whatever", req.body);
  const newNote = req.body;
  newNote.id = uuidv4();
  appendFileAsync(
    path.join(__dirname, "db", "db.json"),
    JSON.stringify(newNote)
  ).then(function () {
    return res.json(newNote);
  });
});

app.delete("/api/notes/:id", function (id) {
  readFileAsync(path.join(__dirname, "db", "db.json"), "utf8").then(function (
    notes
  ) {});
});

//initializes the server to begin listening
app.listen(PORT, function () {
  console.log(`App listening on PORT ${PORT}`);
});
