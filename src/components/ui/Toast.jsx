export default function Toast({ message }) {
  return (
    <div className="toast" role="status" aria-live="polite" data-show={message ? "true" : "false"}>
      {message}
    </div>
  );
}
