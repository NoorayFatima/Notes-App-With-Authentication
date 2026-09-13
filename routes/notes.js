const express = require("express");
const { protect } = require("../middleware/auth");

const {
  getAllNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
} = require("../controllers/notesController");

const router = express.Router();

// Every route below this line requires a valid JWT. protect() runs first
// for each request; if it calls next(), the matching handler runs next.
router.use(protect);

router.get("/", getAllNotes);
router.get("/:id", getNoteById);
router.post("/", createNote);
router.put("/:id", updateNote);
router.delete("/:id", deleteNote);

module.exports = router;
