import { useState } from "react";

const TAG_COLORS = [
  "var(--tag-1)",
  "var(--tag-2)",
  "var(--tag-3)",
  "var(--tag-4)",
  "var(--tag-5)",
];

function tagColorFor(id) {
  let hash = 0;
  for (let i = 0; i < id.length; i += 1) {
    hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  }
  return TAG_COLORS[hash % TAG_COLORS.length];
}

function formatDate(isoString) {
  return new Date(isoString).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

export default function NoteCard({ note, onEdit, onDelete, isDeleting }) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  function startEditing() {
    setTitle(note.title);
    setContent(note.content);
    setError(null);
    setIsEditing(true);
  }

  async function handleSave(event) {
    event.preventDefault();

    if (!title.trim() || !content.trim()) {
      setError("A note needs both a title and some content.");
      return;
    }

    setSaving(true);
    setError(null);
    try {
      await onEdit(note._id, { title: title.trim(), content: content.trim() });
      setIsEditing(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  if (isEditing) {
    return (
      <form
        className="note-card note-card--editing"
        style={{ "--tag-color": tagColorFor(note._id) }}
        onSubmit={handleSave}
      >
        {error && <p className="compose__error">{error}</p>}

        <input
          className="compose__field compose__title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          autoFocus
        />
        <textarea
          className="compose__field compose__body"
          value={content}
          onChange={(event) => setContent(event.target.value)}
          rows={4}
        />

        <div className="note-card__footer">
          <button
            type="button"
            className="btn btn--ghost"
            onClick={() => setIsEditing(false)}
          >
            Cancel
          </button>
          <button type="submit" className="btn btn--primary" disabled={saving}>
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
      </form>
    );
  }

  return (
    <article
      className="note-card"
      style={{ "--tag-color": tagColorFor(note._id) }}
    >
      <h3 className="note-card__title">{note.title}</h3>
      <p className="note-card__body">{note.content}</p>

      <div className="note-card__footer">
        <span className="note-card__date">{formatDate(note.createdAt)}</span>
        <div className="note-card__actions">
          <button type="button" className="note-card__edit" onClick={startEditing}>
            Edit
          </button>
          <button
            type="button"
            className="note-card__delete"
            onClick={() => onDelete(note._id)}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting…" : "Delete"}
          </button>
        </div>
      </div>
    </article>
  );
}