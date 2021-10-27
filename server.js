// Modules
const express = require("express");
const fs = require("fs");
const path = require("path");

// Express Server
const app = express();
// Setting up PORT
const PORT = process.env.PORT || 3000;

//Body parsing, static, and routing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "./public")));

// Empty array for Notes Data
let notesData = [];

// API Routes
// API call GET
app.get("/api/notes", function (err, res) {
  let returnedNotesData = "";
  try {
    returnedNotesData = fs.readFileSync("./db/db.json", "utf8");
    console.log("Success file was read!");

    // Handles error
  } catch (err) {
    console.log("Error in app.get:");
    console.log(err);
  }
  // Send to browser
  if (returnedNotesData) {
    res.json(JSON.parse(returnedNotesData));
  }
});

// API call POST
app.post("/api/notes", function (req, res) {
  try {
    // Sets New Notes ID
    req.body.id = notesData.length;
    console.log(notesData);
    if (!Array.isArray(notesData)) {
      notesData = JSON.parse(notesData);
    }
    notesData.push(req.body);
    notesData = JSON.stringify(notesData);
    // Write New Note to File
    fs.writeFile("./db/db.json", notesData, "utf8", (err) => {
      if (err) throw err;
    });

    res.json(notesData);
    // Handles error
  } catch (err) {
    throw err;
  }
});

// API call DELETE
app.delete("/api/notes/:id", function (req, res) {
  try {
    notesData = fs.readFileSync("./db/db.json", "utf8");
    notesData = JSON.parse(notesData);

    // Deletes Old Notes from Array
    notesData = notesData.filter((note) => {
      return note.id != req.params.id;
    });

    notesData = JSON.stringify(notesData);

    // Write New Note to File
    fs.writeFile("./db/db.json", notesData, "utf8", (err) => {
      if (err) throw err;
    });

    res.json(JSON.parse(notesData));
    // Handles error
  } catch (err) {
    throw err;
  }
});

// ROUTES
//HTML Routes -- GET Requests
app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/notes.html"));
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/index.html"));
});

// PORT Listener
app.listen(PORT, () => {
  console.log("Server listening on: http://localhost:" + PORT);
});
