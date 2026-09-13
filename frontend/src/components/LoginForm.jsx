import { useState } from "react";

export default function LoginForm({ onLogin, onSwitchToSignup }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await onLogin({ email: email.trim(), password });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="auth-card" onSubmit={handleSubmit}>
      <h1 className="auth-card__title">Welcome back</h1>
      <p className="auth-card__subtitle">Log in to see your notes.</p>

      {error && <p className="auth-card__error">{error}</p>}

      <label className="auth-field">
        <span className="auth-field__label">Email</span>
        <input
          type="email"
          className="auth-field__input"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
          autoFocus
        />
      </label>

      <label className="auth-field">
        <span className="auth-field__label">Password</span>
        <input
          type="password"
          className="auth-field__input"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />
      </label>

      <button type="submit" className="btn btn--primary auth-card__submit" disabled={submitting}>
        {submitting ? "Logging in…" : "Log in"}
      </button>

      <p className="auth-card__switch">
        Don't have an account?{" "}
        <button type="button" className="auth-card__link" onClick={onSwitchToSignup}>
          Sign up
        </button>
      </p>
    </form>
  );
}
