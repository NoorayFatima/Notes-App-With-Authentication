import { useCallback, useEffect, useState } from "react";
import { fetchNotes, createNote, updateNote, deleteNote } from "../api/notes";

// Centralizes all state for the notes list: the data itself, whether we're
// loading it, any error, and the actions that mutate it. Keeping this in
// one hook (rather than scattered useState calls in App) is what lets
// App.jsx stay a thin layout component.
//
// onUnauthorized is called whenever a request comes back 401 (token
// missing/expired) so App can log the user out and show the login screen
// again, instead of leaving them stuck looking at a dead notes list.
export function useNotes(onUnauthorized) {
  const [notes, setNotes] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | ready | error
  const [error, setError] = useState(null);
  const [pendingIds, setPendingIds] = useState(() => new Set());

  const load = useCallback(async () => {
    setStatus("loading");
    setError(null);
    try {
      const { data } = await fetchNotes();
      setNotes(data);
      setStatus("ready");
    } catch (err) {
      if (err.isAuthError) {
        onUnauthorized?.();
        return;
      }
      setError(err.message);
      setStatus("error");
    }
  }, [onUnauthorized]);

  useEffect(() => {
    load();
  }, [load]);

  const addNote = useCallback(
    async ({ title, content }) => {
      try {
        const { data } = await createNote({ title, content });
        setNotes((current) => [data, ...current]);
      } catch (err) {
        if (err.isAuthError) onUnauthorized?.();
        throw err;
      }
    },
    [onUnauthorized]
  );

  const editNote = useCallback(
    async (id, { title, content }) => {
      try {
        const { data } = await updateNote(id, { title, content });
        setNotes((current) =>
          current.map((note) => (note._id === id ? data : note))
        );
      } catch (err) {
        if (err.isAuthError) onUnauthorized?.();
        throw err;
      }
    },
    [onUnauthorized]
  );

  const removeNote = useCallback(
    async (id) => {
      setPendingIds((current) => new Set(current).add(id));
      try {
        await deleteNote(id);
        setNotes((current) => current.filter((note) => note._id !== id));
      } catch (err) {
        if (err.isAuthError) onUnauthorized?.();
        throw err;
      } finally {
        setPendingIds((current) => {
          const next = new Set(current);
          next.delete(id);
          return next;
        });
      }
    },
    [onUnauthorized]
  );

  return { notes, status, error, pendingIds, addNote, editNote, removeNote, reload: load };
}
