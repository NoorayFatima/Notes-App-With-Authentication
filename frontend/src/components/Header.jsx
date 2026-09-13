// Presentational component: receives everything via props, holds no
// state of its own.
export default function Header({ noteCount, username, isComposing, onToggleCompose, onLogout }) {
  const subtitle =
    noteCount === 0
      ? "No notes yet"
      : `${noteCount} ${noteCount === 1 ? "note" : "notes"}`;

  return (
    <header className="header">
      <div>
        <h1 className="header__title">Notebook</h1>
        <p className="header__meta">
          {subtitle}
          {username && <span className="header__user"> · {username}</span>}
        </p>
      </div>

      <div className="header__actions">
        <button
          type="button"
          className="header__new-btn"
          aria-pressed={isComposing}
          onClick={onToggleCompose}
        >
          {isComposing ? "Cancel" : "+ New note"}
        </button>
        <button type="button" className="header__logout-btn" onClick={onLogout}>
          Log out
        </button>
      </div>
    </header>
  );
}
