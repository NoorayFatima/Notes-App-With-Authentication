import { useState } from "react";

// Controlled form for creating a note. Kept self-contained: it owns its
// own draft state (title/content while typing) and only reports upward
// via onCreate once the user submits successfully.
export default function ComposeCard({ onCreate, onCancel }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    if (!title.trim() || !content.trim()) {
      setError("A note needs both a title and some content.");
      return;
    }

    setSaving(true);
    setError(null);
    try {
      await onCreate({ title: title.trim(), content: content.trim() });
      setTitle("");
      setContent("");
      onCancel();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="compose" onSubmit={handleSubmit}>
      {error && <p className="compose__error">{error}</p>}

      <input
        className="compose__field compose__title"
        placeholder="Title"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        autoFocus
      />

      <textarea
        className="compose__field compose__body"
        placeholder="Write something down..."
        value={content}
        onChange={(event) => setContent(event.target.value)}
        rows={3}
      />

      <div className="compose__divider" />

      <div className="compose__footer">
        <span className="compose__hint">{content.length} characters</span>
        <div className="compose__actions">
          <button type="button" className="btn btn--ghost" onClick={onCancel}>
            Discard
          </button>
          <button type="submit" className="btn btn--primary" disabled={saving}>
            {saving ? "Saving…" : "Save note"}
          </button>
        </div>
      </div>
    </form>
  );
}
