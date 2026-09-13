import { useState } from "react";

export default function SignupForm({ onSignup, onSwitchToLogin }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setError(null);
    setSubmitting(true);
    try {
      await onSignup({ username: username.trim(), email: email.trim(), password });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="auth-card" onSubmit={handleSubmit}>
      <h1 className="auth-card__title">Create your account</h1>
      <p className="auth-card__subtitle">Your notes will be private to you.</p>

      {error && <p className="auth-card__error">{error}</p>}

      <label className="auth-field">
        <span className="auth-field__label">Username</span>
        <input
          type="text"
          className="auth-field__input"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          minLength={3}
          required
          autoFocus
        />
      </label>

      <label className="auth-field">
        <span className="auth-field__label">Email</span>
        <input
          type="email"
          className="auth-field__input"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
      </label>

      <label className="auth-field">
        <span className="auth-field__label">Password</span>
        <input
          type="password"
          className="auth-field__input"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          minLength={6}
          required
        />
      </label>

      <button type="submit" className="btn btn--primary auth-card__submit" disabled={submitting}>
        {submitting ? "Creating account…" : "Sign up"}
      </button>

      <p className="auth-card__switch">
        Already have an account?{" "}
        <button type="button" className="auth-card__link" onClick={onSwitchToLogin}>
          Log in
        </button>
      </p>
    </form>
  );
}
