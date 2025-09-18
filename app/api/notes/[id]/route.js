import { connectDB } from "../../../../lib/mongodb";
import Note from "../../../../models/Note";
import { NextResponse } from "next/server";



// UPDATE note
export async function PUT(req, { params }) {
  await connectDB();
  const data = await req.json();
  const updated = await Note.findByIdAndUpdate(params.id, data, { new: true });
  return NextResponse.json(updated);
}

// DELETE note
export async function DELETE(req, { params }) {
  await connectDB();
  await Note.findByIdAndDelete(params.id);
  return NextResponse.json({ message: "Note deleted" });
}

