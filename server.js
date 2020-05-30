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
const writeFileAsync = promisify(fs.writeFile);

//middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

//defining data as an array
let notesArray = [];

//creating HTML routes
app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/notes", function (req, res) {
  res.sendFile(path.join(__dirname, "public", "notes.html"));
});

//creating API routes
app.get("/api/notes", function (req, res) {
  console.log("this route is hit");
  readFileAsync(path.join(__dirname, "db", "db.json"), "utf8").then((notes) => {
    console.log(JSON.parse(notes));
    notesArray = JSON.parse(notes);
    return res.json(JSON.parse(notes));
  });
});

app.post("/api/notes", function (req, res) {
  console.log("sure whatever", req.body);
  const newNote = req.body;
  newNote.id = uuidv4();
  notesArray.push(newNote);
  console.log(notesArray);
  writeFileAsync(
    path.join(__dirname, "db", "db.json"),
    JSON.stringify(notesArray)
  ).then(() => {
    readFileAsync(path.join(__dirname, "db", "db.json"), "utf8").then(() => {
      return res.json(JSON.parse(newNote));
    });
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
