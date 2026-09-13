import { apiRequest } from "./client";

export function fetchNotes() {
  return apiRequest("/notes", { method: "GET" });
}

export function createNote({ title, content }) {
  return apiRequest("/notes", {
    method: "POST",
    body: JSON.stringify({ title, content }),
  });
}

export function updateNote(id, { title, content }) {
  return apiRequest(`/notes/${id}`, {
    method: "PUT",
    body: JSON.stringify({ title, content }),
  });
}

export function deleteNote(id) {
  return apiRequest(`/notes/${id}`, { method: "DELETE" });
}
