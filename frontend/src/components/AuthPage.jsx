import { useState } from "react";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";

export default function AuthPage({ onLogin, onSignup }) {
  const [mode, setMode] = useState("login"); // login | signup

  return (
    <div className="auth-page">
      <div className="auth-page__brand">
        <h1 className="auth-page__brand-title">Notebook</h1>
        <p className="auth-page__brand-subtitle">A quiet place to keep your notes.</p>
      </div>

      {mode === "login" ? (
        <LoginForm onLogin={onLogin} onSwitchToSignup={() => setMode("signup")} />
      ) : (
        <SignupForm onSignup={onSignup} onSwitchToLogin={() => setMode("login")} />
      )}
    </div>
  );
}
