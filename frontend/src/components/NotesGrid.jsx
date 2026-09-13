import NoteCard from "./NoteCard";

export default function NotesGrid({ notes, pendingIds, onEdit, onDelete }) {
  if (notes.length === 0) {
    return (
      <div className="state-block">
        <p className="state-block__title">Nothing here yet</p>
        <p className="state-block__text">
          Add your first note with the button above.
        </p>
      </div>
    );
  }

  return (
    <div className="notes-grid">
      {notes.map((note) => (
        <NoteCard
          key={note._id}
          note={note}
          onEdit={onEdit}
          onDelete={onDelete}
          isDeleting={pendingIds.has(note._id)}
        />
      ))}
    </div>
  );
}
