// data/notes.js
// -----------------------------------------------------------------------
// This is our "fake database" for now. It's just a JavaScript array that
// lives in the computer's memory (RAM) while the server is running.
//
// IMPORTANT: This means all notes disappear when you restart the server.
// Next week you'll swap this out for a real database (like MongoDB or
// PostgreSQL), but the REST API logic you write this week barely changes!
// -----------------------------------------------------------------------

let notes = [
  {
    id: 1,
    title: "Welcome to your Notes API",
    content: "This is your first note. Try GET, POST, PUT, DELETE on it!",
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    title: "Learn Express.js",
    content: "Express makes building REST APIs with Node.js much easier.",
    createdAt: new Date().toISOString(),
  },
];

// A simple counter to generate the next unique ID.
// (Real databases usually do this automatically for you.)
let nextId = 3;

function getNextId() {
  return nextId++;
}

module.exports = { notes, getNextId };
