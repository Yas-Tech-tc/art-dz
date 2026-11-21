# Art DZ — Intégration Frontend & Backend (TD-TP 4)

Ce document décrit l'architecture et le fonctionnement de l'intégration entre le frontend **React (Vite + Redux Toolkit / RTK Query)** et l'API REST **Express / MongoDB**.

## Liens de production
- **Application Frontend (Vercel) :** https://art-dz.vercel.app/
- **API Backend (Render) :** https://art-z-api.onrender.com

*(Note : sur l'hébergement gratuit Render, le premier appel après une période d'inactivité peut prendre 30 à 60 secondes le temps du démarrage du serveur.)*

---

## Architecture mise en place

### 1. Communication API centralisée (`src/api/api.js`)
- Utilisation de **RTK Query** (`createApi` + `fetchBaseQuery`) branché sur `import.meta.env.VITE_API_URL`.
- Injection automatique de l'en-tête `Authorization: Bearer <token>` dès qu'un utilisateur est authentifié.
- Invalidations automatiques par tags (`Product`, `User`) : après chaque création, modification ou suppression côté admin, le catalogue se recharge sans rechargement manuel de page.
- Déconnexion automatique (`logout`) déclenchée sur toute réponse serveur `401`.

### 2. Authentification et gestion des rôles (`src/store/authSlice.js`)
- Persistance du jeton et du profil dans `sessionStorage` (survit au rafraîchissement de la page, effacé à la fermeture de l'onglet).
- Revalidation automatique de la session au démarrage via `GET /api/auth/me`.
- Protection des routes côté interface avec `ProtectedRoute` et `AdminRoute` (`/admin/produits`), complétant la sécurité réelle assurée côté serveur (`401` / `403`).

### 3. Catalogue, filtres, panier et favoris dynamiques
- Suppression complète des données statiques locales (`products.js`).
- Filtrage par catégorie, recherche par mot-clé (`q`) et tri (`sort`) délégués directement à l'API MongoDB (`GET /api/products`).
- Validation des identifiants MongoDB (24 caractères hexadécimaux) et nettoyage automatique du panier et des favoris si un produit a été supprimé en base.

### 4. Gestion des états de chargement et d'erreur (`LoadingState`, `ErrorState`, `apiError.js`)
- Indicateur de chargement avec message d'information automatique au-delà de 4 secondes (réveil du serveur Render).
- Traduction des erreurs réseau et codes HTTP (`400` champ par champ, `401`, `403`, `404`, `409`, `429`, `5xx`) avec bouton **« Réessayer »**.

---

## Lancer le projet complet en local

1. **Démarrer le backend (`server/`) :**
   ```bash
   cd server
   npm install
   npm run dev
   ```
2. **Démarrer le frontend (racine) :**
   Créer un fichier `.env.local` à la racine avec `VITE_API_URL=http://localhost:3000/api`, puis :
   ```bash
   npm install
   npm run dev
   ```

## Comptes de test
Pour des raisons de sécurité, aucun identifiant administrateur n'est publié dans ce dépôt.
