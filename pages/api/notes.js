
// pages/api/notes.js
import { connectDB } from "../../lib/mongodb";
import mongoose from "mongoose";

// Define a Note schema if not defined already
const NoteSchema = new mongoose.Schema({
  title: String,
  content: String,
});

const Note = mongoose.models.Note || mongoose.model("Note", NoteSchema);

export default async function handler(req, res) {
  await connectDB();

  if (req.method === "GET") {
    const notes = await Note.find({});
    res.status(200).json(notes);
  } else if (req.method === "POST") {
    const { title, content } = req.body;
    if (!title || !content) {
      return res.status(400).json({ error: "Title and content are required" });
    }
    const note = new Note({ title, content });
    await note.save();
    res.status(201).json(note);
  } else if (req.method === "DELETE") {
    const { id } = req.body;
    if (!id) return res.status(400).json({ error: "ID is required" });
    await Note.findByIdAndDelete(id);
    res.status(200).json({ message: "Note deleted" });
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
