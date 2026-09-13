import { useState } from "react";
import { useAuth } from "./hooks/useAuth";
import { useNotes } from "./hooks/useNotes";
import AuthPage from "./components/AuthPage";
import Header from "./components/Header";
import ComposeCard from "./components/ComposeCard";
import NotesGrid from "./components/NotesGrid";
import SkeletonGrid from "./components/SkeletonGrid";
import ErrorBanner from "./components/ErrorBanner";
import "./App.css";

export default function App() {
  const { user, status: authStatus, signup, login, logout } = useAuth();

  // While we haven't yet confirmed if a stored token is valid, show
  // nothing (or a minimal loading state) rather than flashing the login
  // screen and then immediately swapping to the notes screen.
  if (authStatus === "checking") {
    return (
      <main className="page">
        <p className="auth-page__checking">Checking your session…</p>
      </main>
    );
  }

  if (authStatus === "signed-out") {
    return <AuthPage onLogin={login} onSignup={signup} />;
  }

  return <NotesApp user={user} onLogout={logout} />;
}

// Split out so useNotes (and its useEffect that fetches on mount) only
// ever runs once we know the user is actually signed in.
function NotesApp({ user, onLogout }) {
  const { notes, status, error, pendingIds, addNote, editNote, removeNote, reload } =
    useNotes(onLogout);
  const [isComposing, setIsComposing] = useState(false);

  return (
    <main className="page">
      <Header
        noteCount={notes.length}
        username={user?.username}
        isComposing={isComposing}
        onToggleCompose={() => setIsComposing((open) => !open)}
        onLogout={onLogout}
      />

      {status === "error" && <ErrorBanner message={error} onRetry={reload} />}

      {isComposing && (
        <ComposeCard onCreate={addNote} onCancel={() => setIsComposing(false)} />
      )}

      {status === "loading" ? (
        <SkeletonGrid />
      ) : (
        <NotesGrid
          notes={notes}
          pendingIds={pendingIds}
          onEdit={editNote}
          onDelete={removeNote}
        />
      )}
    </main>
  );
}
