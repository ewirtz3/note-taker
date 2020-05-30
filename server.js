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

//defining route
const db_FILE = path.join(__dirname, "db", "db.json");

//middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

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
  readFileAsync(db_FILE, "utf8").then((notes) => {
    console.log(JSON.parse(notes));
    return res.json(JSON.parse(notes));
  });
});

app.post("/api/notes", function (req, res) {
  readFileAsync(db_FILE, "utf8").then((data) => {
    const newNote = req.body;
    newNote.id = uuidv4();
    let notesArray = JSON.parse(data);
    notesArray.push(newNote);
    writeFileAsync(db_FILE, JSON.stringify(notesArray)).then(() => {
      return res.json(notesArray);
    });
  });
});

app.delete("/api/notes/:id", function (req, res) {
  //get the data from the file
  readFileAsync(db_FILE, "utf8").then((data) => {
    let notesArray = JSON.parse(data);
    notesArray = notesArray.filter((note) => note.id !== req.params.id);
    writeFileAsync(db_FILE, JSON.stringify(notesArray)).then(() => {
      return res.json(notesArray);
    });
  });
  //parse the data from the file
  //filter the data to exclude the provided id
  //save updated (fitered) data to the file
  //end request (return a success msg)
  readFileAsync(path.join(__dirname, "db", "db.json"), "utf8").then(function (
    notes
  ) {});
});

//initializes the server to begin listening
app.listen(PORT, function () {
  console.log(`App listening on PORT ${PORT}`);
});
