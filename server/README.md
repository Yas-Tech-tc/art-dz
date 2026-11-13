# Art-Z API — Backend e-commerce

**Étudiant :** [Prénom Nom]
**Module :** WAMD, TD-TP 3, ENSTA, S1 2026

## Description

API REST (Node.js, Express, MongoDB) pour la boutique React/Redux du TD-TP 2.
Elle gère le catalogue de produits, l'inscription et la connexion, et protège
l'écriture par jeton JWT (ou jeton OAuth 2.0 de Google) et par un contrôle de rôle.

## Technologies

Node.js 20+, Express 5, MongoDB Atlas + Mongoose, JWT (`jsonwebtoken`), `bcryptjs`,
`zod` (validation), `helmet`, `cors`, `express-rate-limit`, `dotenv`.
Tests : Postman.

## Architecture

```
server/src/
├── config/        base de données, origines CORS, contrôle de l'environnement
├── models/        User, Product
├── validators/    schémas zod
├── middlewares/   authentification, validation, limitation de débit, erreurs
├── services/      logique métier (produits, authentification, jetons, OAuth)
├── controllers/   adaptent HTTP et services
├── routes/        définition des endpoints
└── scripts/       seed.js, makeAdmin.js
```

## Modèles de base de données

**Product** : `name`, `description`, `price` (entier, en DA), `category` (8 catégories),
`imageUrl`, `images[]`, `stock`, `featured`, `isNewArrival`, `materials`, `dimensions`.
Champ calculé : `inStock`.

**User** : `name`, `email` (unique, minuscules), `passwordHash` (jamais renvoyé),
`role` (`user` par défaut, `admin`, non modifiable par l'API).

## Endpoints

| Méthode | Route | Accès |
|---|---|---|
| POST | `/api/auth/register` | Public (limité) |
| POST | `/api/auth/login` | Public (5 requêtes / 15 min / IP) |
| GET | `/api/auth/me` | Jeton JWT ou jeton OAuth 2.0 |
| GET | `/api/products` | Public (`?category=&q=&sort=&page=&limit=`) |
| GET | `/api/products/:id` | Public |
| POST | `/api/products` | Jeton JWT + **rôle admin** |
| PUT | `/api/products/:id` | Jeton JWT + **rôle admin** |
| DELETE | `/api/products/:id` | Jeton JWT + **rôle admin** |
| GET | `/api/health` | Public |

Codes utilisés : 200, 201, 400, 401, 403, 404, 409, 413, 429, 500, 503.
Format d'erreur unique : `{ "success": false, "error": { "code", "message" } }`.

## ⚠️ Pour tester l'écriture des produits (important)

L'énoncé protège la création, la modification et la suppression par un jeton.
Ce projet ajoute volontairement un contrôle de rôle : **un compte normal reçoit `403 Forbidden`**
sur ces trois routes, car une boutique ne doit pas laisser n'importe quel utilisateur modifier
son catalogue. L'inscription ne permet jamais de choisir le rôle `admin`.

Pour obtenir un compte administrateur :

1. Inscrivez-vous via `POST /api/auth/register`.
2. Dans `server/`, lancez : `npm run make-admin -- votre-email@exemple.dz`
3. Connectez-vous via `POST /api/auth/login` : le jeton obtenu autorise l'écriture (`201`).

Sans jeton : `401`. Avec un jeton de compte normal : `403`. Avec un jeton admin : `201`.

## Authentification JWT

1. `POST /api/auth/login` vérifie l'e-mail et le mot de passe (comparaison bcrypt)
   puis renvoie un JWT signé (HS256, valable 1 heure).
2. Le client envoie `Authorization: Bearer <JWT>`.
3. Le middleware vérifie la signature, l'algorithme imposé, l'émetteur et l'expiration,
   puis recharge l'utilisateur en base : le rôle n'est jamais lu dans le jeton.
4. Jeton absent, falsifié ou expiré : `401`. Utilisateur sans les droits : `403`.

Le secret `JWT_SECRET` est lu dans l'environnement (32 caractères minimum, le serveur
refuse de démarrer sinon).

## OAuth 2.0 (Google)

Flux « Authorization Code avec PKCE » testé avec Postman. L'API reçoit
`Authorization: Bearer <access token>`, interroge Google pour valider le jeton,
vérifie que le jeton a été émis pour notre client (`aud`) et que l'e-mail est vérifié.
L'identité Google a le rôle `user` : elle est authentifiée mais ne peut pas écrire
de produits. Seul le client ID est utilisé par l'API (`GOOGLE_CLIENT_ID`), le client secret
reste dans Postman.

## Limitation de débit

`express-rate-limit` : 100 requêtes / 15 min / IP sur `/api`, **5 / 15 min** sur le login,
20 / heure sur l'inscription. Dépassement : `429 Too Many Requests`.

## Mesures de sécurité

Mots de passe hachés (bcrypt, coût 12), validation stricte des entrées (champs inconnus refusés),
protection contre l'injection NoSQL, Helmet, CORS en liste blanche (jamais `*`),
corps limité à 10 Ko, gestion centralisée des erreurs sans fuite d'informations internes,
secrets uniquement dans `.env`.

## Installation

```bash
git clone https://github.com/[pseudo]/[nom-du-depot].git
cd [nom-du-depot]/server
npm install
cp .env.example .env     # puis remplir les valeurs
npm run seed             # insère 16 produits d'exemple
npm run dev              # http://localhost:3000
```

## Configuration de MongoDB et de l'environnement

1. Créer un cluster gratuit **M0** sur MongoDB Atlas.
2. **Database Access** : créer un utilisateur avec le rôle `readWrite` sur la base `art-z`.
3. **Network Access** : autoriser votre adresse IP.
4. Copier la chaîne de connexion (en ajoutant `/art-z` avant le `?`) dans `MONGODB_URI`.
5. Générer le secret JWT :
   `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"`

| Variable | Rôle |
|---|---|
| `PORT` | port du serveur (3000) |
| `MONGODB_URI` | chaîne de connexion MongoDB |
| `JWT_SECRET` | secret de signature (32 caractères minimum) |
| `JWT_EXPIRES_IN` | durée de vie du jeton (`1h`) |
| `BCRYPT_ROUNDS` | coût du hachage (`12`) |
| `CORS_ORIGINS` | origines du frontend autorisées (séparées par des virgules) |
| `GOOGLE_CLIENT_ID` | identifiant client OAuth 2.0 (facultatif) |

Ne jamais publier le fichier `.env`.