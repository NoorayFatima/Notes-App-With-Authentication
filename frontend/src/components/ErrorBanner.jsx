export default function ErrorBanner({ message, onRetry }) {
  return (
    <div className="error-banner">
      <p className="error-banner__text">{message}</p>
      <button type="button" className="error-banner__retry" onClick={onRetry}>
        Try again
      </button>
    </div>
  );
}
