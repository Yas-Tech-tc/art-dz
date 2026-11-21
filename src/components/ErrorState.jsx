import Button from "./Button";
import { parseApiError } from "../utils/apiError";

function ErrorState({ error, onRetry }) {
  const { message } = parseApiError(error);

  return (
    <div
      role="alert"
      className="my-6 flex flex-col items-center justify-center rounded-2xl border border-terracotta/30 bg-terracotta/10 px-6 py-10 text-center"
    >
      <p className="font-bold text-terracotta">{message}</p>
      {onRetry && (
        <Button onClick={onRetry} className="mt-4">
          Réessayer
        </Button>
      )}
    </div>
  );
}

export default ErrorState;
