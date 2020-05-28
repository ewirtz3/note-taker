const fs = require("fs");
const path = require("path");
const util = require("util");
const { v4: uuidv4 } = require("uuid");
const express = require("express");

//setting up Express and defining PORT
const app = express();
const PORT = process.env.PORT || 3000;

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
app
  .get("/api/notes", function (req, res) {
    fs.readFile("db.json", () => {
      return res.json(notes);
    });
  })
  .post(function (req, res) {
    const newNote = req.body;
    fs.appendFile("db.json", newNote);
    return newNote;
  });
