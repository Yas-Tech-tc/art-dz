import bcrypt from "bcryptjs";
import { User } from "../models/User.js";
import { AppError } from "../utils/AppError.js";
import { signToken } from "./token.service.js";

// Nombre de rounds utilisés par bcrypt pour le hashage des mots de passe.
const ROUNDS = Number(process.env.BCRYPT_ROUNDS) || 12;

// Hash fictif utilisé lorsqu'un utilisateur n'existe pas.
const DUMMY_HASH = bcrypt.hashSync("mot-de-passe-factice", ROUNDS);

// Fonction permettant d'inscrire un nouvel utilisateur.
export async function registerUser({ name, email, password }) {

  // Hashage du mot de passe avant son stockage dans la base de données.
  const passwordHash = await bcrypt.hash(password, ROUNDS);

  try {
    // Création de l'utilisateur dans MongoDB.
    return await User.create({ name, email, passwordHash });

  } catch (err) {

    // Le code 11000 indique une violation d'unicité dans MongoDB( email n'existe pas)
    if (err.code === 11000) {

      // Génération d'une erreur personnalisée HTTP 409 Conflict.
      throw new AppError(
        409,
        "EMAIL_TAKEN",
        "Un compte existe déjà avec cette adresse e-mail."
      );
    }

    // Si l'erreur est différente, on la transmet au gestionnaire d'erreurs.
    throw err;
  }
}

// Fonction permettant de connecter un utilisateur existant.
export async function loginUser({ email, password }) {

  // Recherche de l'utilisateur dans MongoDB par son e-mail.
  // select("+passwordHash") permet de récupérer le hash du mot de passe,
  const user = await User.findOne({ email }).select("+passwordHash");

  // Comparaison du mot de passe fourni avec le hash stocké.
  // Si l'utilisateur n'existe pas, on compare avec DUMMY_HASH
  // pour limiter les différences de temps de réponse.
  const valid = await bcrypt.compare(
    password,
    user?.passwordHash ?? DUMMY_HASH
  );

  // Si l'utilisateur n'existe pas OU si le mot de passe est incorrect,
  // on renvoie la même erreur pour éviter de révéler si l'e-mail existe.
  if (!user || !valid) {
    throw new AppError(
      401,
      "INVALID_CREDENTIALS",
      "E-mail ou mot de passe incorrect."
    );
  }

  // Si les identifiants sont corrects :
  //  Génération d'un JWT contenant l'identifiant de l'utilisateur.
  //  Retour de l'utilisateur et du token au contrôleur.
  return { user, token: signToken(user.id) };
}