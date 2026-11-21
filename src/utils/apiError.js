export function parseApiError(err) {
  if (!err) {
    return { message: "Une erreur inattendue est survenue.", fieldErrors: {}, status: null };
  }

  if (err.status === "FETCH_ERROR") {
    return {
      message: "Impossible de joindre le serveur. Vérifiez votre connexion ou réessayez.",
      fieldErrors: {},
      status: "FETCH_ERROR",
    };
  }

  if (err.status === "TIMEOUT_ERROR") {
    return {
      message: "Le serveur met trop de temps à répondre. Réessayez dans un instant.",
      fieldErrors: {},
      status: "TIMEOUT_ERROR",
    };
  }

  const status = err.status;
  const apiError = err.data?.error || {};
  const fieldErrors = {};

  if (Array.isArray(apiError.details)) {
    for (const item of apiError.details) {
      const key = item.field || (Array.isArray(item.path) ? item.path.at(0) : undefined);
      if (key && item.message) {
        fieldErrors[key] = item.message;
      }
    }
  } else if (apiError.details && typeof apiError.details === "object") {
    Object.assign(fieldErrors, apiError.details);
  }

  switch (status) {
    case 400:
      return {
        message: apiError.message || "Certains champs sont invalides.",
        fieldErrors,
        status,
      };
    case 401:
      return {
        message: apiError.message || "Identifiants invalides ou session expirée.",
        fieldErrors,
        status,
      };
    case 403:
      return {
        message: "Vous n’avez pas les droits nécessaires pour effectuer cette action.",
        fieldErrors,
        status,
      };
    case 404:
      return {
        message: "Produit ou ressource introuvable.",
        fieldErrors,
        status,
      };
    case 409:
      return {
        message: "Un compte existe déjà avec cet e-mail.",
        fieldErrors,
        status,
      };
    case 429:
      return {
        message: "Trop de tentatives, réessayez dans quelques minutes.",
        fieldErrors,
        status,
      };
    default:
      if (typeof status === "number" && status >= 500) {
        return {
          message: "Une erreur interne est survenue sur le serveur. Réessayez plus tard.",
          fieldErrors,
          status,
        };
      }
      return {
        message: apiError.message || "Une erreur est survenue.",
        fieldErrors,
        status,
      };
  }
}
