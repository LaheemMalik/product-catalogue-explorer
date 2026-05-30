import styles from './ErrorState.module.css';

const messages = {
  timeout: {
    title: 'This is taking longer than usual.',
    body: 'The server is slow to respond. Try again in a moment.',
  },
  network: {
    title: "Couldn't reach the server.",
    body: 'Check your connection and try again.',
  },
  http: {
    title: 'Something went wrong on our end.',
    body: 'Please try again. If it keeps happening, come back later.',
  },
  parse: {
    title: 'Unexpected response from the server.',
    body: 'Try again — this is usually temporary.',
  },
};

function ErrorState({ error, onRetry }) {
  const { title, body } = messages[error?.type] ?? messages.http;

  return (
    <div className={styles.wrap} role="alert">
      <h2 className={styles.title}>{title}</h2>
      <p className={styles.body}>{body}</p>
      {onRetry && (
        <button className={styles.retry} onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  );
}

export default ErrorState;