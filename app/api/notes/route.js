import { connectDB } from "../../../lib/mongodb";
import Note from "../../../models/Note";
import { NextResponse } from "next/server";

// GET all notes
export async function GET() {
  try {
    await connectDB();
    const notes = await Note.find().sort({ createdAt: -1 });
    return NextResponse.json(notes);
  } catch (err) {
    console.error("GET /api/notes error:", err);
    return NextResponse.json([], { status: 500 });
  }
}

// POST new note
export async function POST(req) {
  try {
    await connectDB();
    const data = await req.json();

    if (!data.title || !data.title.trim()) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const newNote = new Note({
      title: data.title.trim(),
      content: data.content || "",
    });

    await newNote.save();
    return NextResponse.json(newNote, { status: 201 });
  } catch (err) {
    console.error("POST /api/notes error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// DELETE note
export async function DELETE(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) return NextResponse.json({ error: "ID is required" }, { status: 400 });

    await Note.findByIdAndDelete(id);
    return NextResponse.json({ message: "Deleted successfully" });
  } catch (err) {
    console.error("DELETE /api/notes error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}


// UPDATE note
export async function PUT(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const data = await req.json();

    if (!id) return NextResponse.json({ error: "ID is required" }, { status: 400 });
    if (!data.title || !data.title.trim()) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const updatedNote = await Note.findByIdAndUpdate(
      id,
      { title: data.title.trim(), content: data.content || "" },
      { new: true }
    );

    return NextResponse.json(updatedNote);
  } catch (err) {
    console.error("PUT /api/notes error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

