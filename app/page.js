"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [notes, setNotes] = useState([]);
  const [form, setForm] = useState({ title: "", content: "" });
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [dark, setDark] = useState(false);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const res = await fetch("/api/notes");
      if (!res.ok) throw new Error("Failed to fetch notes");
      const data = await res.json();
      setNotes(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching notes:", err);
      setNotes([]);
    }
  };

  const saveNote = async () => {
    if (!form.title.trim()) {
      alert("Title is required");
      return;
    }

    try {
      let res;
      if (editingId) {
        res = await fetch(`/api/notes/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        setEditingId(null);
      } else {
        res = await fetch("/api/notes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
      }

      if (!res.ok) {
        const errorData = await res.json();
        alert(errorData.error || "Failed to save note");
        return;
      }

      setForm({ title: "", content: "" });
      await fetchNotes();
    } catch (err) {
      console.error(err);
    }
  };

  const editNote = (note) => {
    setForm({ title: note.title, content: note.content });
    setEditingId(note._id);
  };

  const deleteNote = async (id) => {
    try {
      const res = await fetch(`/api/notes?id=${id}`, { method: "DELETE" });
      if (!res.ok) {
        const errorData = await res.json();
        alert(errorData.error || "Failed to delete note");
      }
      await fetchNotes();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredNotes = Array.isArray(notes)
    ? notes.filter((n) => n.title.toLowerCase().includes(search.toLowerCase()))
    : [];

  return (
    <div className={dark ? "dark bg-gray-900 min-h-screen text-white" : "bg-gray-100 min-h-screen"}>
      <div className="container mx-auto p-6">
        <div className="flex justify-between mb-6">
          <h1 className="text-3xl font-bold">📝 Notes App</h1>
          <button onClick={() => setDark(!dark)} className="px-4 py-2 rounded bg-gray-700 text-white">
            {dark ? "Light Mode" : "Dark Mode"}
          </button>
        </div>

        <div className="mb-4">
          <input
            type="text"
            placeholder="Search notes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="p-2 w-full border rounded"
          />
        </div>

        <div className="mb-6">
          <input
            type="text"
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="p-2 w-full border rounded mb-2"
          />
          <textarea
            placeholder="Content"
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            className="p-2 w-full border rounded mb-2"
          />
          <button onClick={saveNote} className="px-4 py-2 bg-blue-600 text-white rounded">
            {editingId ? "Update Note" : "Add Note"}
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredNotes.map((note) => (
            <div key={note._id} className="p-4 border rounded shadow bg-white dark:bg-gray-800">
              <h2 className="font-bold text-lg">{note.title}</h2>
              <p>{note.content}</p>
              <div className="mt-2 flex gap-2">
                <button onClick={() => editNote(note)} className="px-3 py-1 bg-yellow-500 text-white rounded">Edit</button>
                <button onClick={() => deleteNote(note._id)} className="px-3 py-1 bg-red-600 text-white rounded">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
