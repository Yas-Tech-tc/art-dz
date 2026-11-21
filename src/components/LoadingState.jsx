import { useEffect, useState } from "react";

function LoadingState({ message = "Chargement en cours..." }) {
  const [isSlow, setIsSlow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsSlow(true), 4000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div role="status" aria-live="polite" className="flex flex-col items-center justify-center py-12 text-center">
      <div
        className="h-10 w-10 animate-spin rounded-full border-4 border-night/20 border-t-terracotta"
        aria-hidden="true"
      />
      <p className="mt-4 font-medium text-night">{message}</p>

      {isSlow && (
        <p className="mt-2 max-w-md rounded-xl bg-saffron/25 px-4 py-3 text-sm text-night">
          Le serveur démarre (hébergement gratuit) : le premier chargement peut prendre 30 à 60 secondes. Merci de patienter...
        </p>
      )}
    </div>
  );
}

export default LoadingState;
