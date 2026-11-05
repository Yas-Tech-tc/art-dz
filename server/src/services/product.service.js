import { Product } from "../models/Product.js";
import { AppError } from "../utils/AppError.js";
import { escapeRegex } from "../utils/escapeRegex.js";

// Définir les méthodes de tri autorisées
const SORTS = {
  // Trier par date de création, du plus récent au plus ancien
  newest: { createdAt: -1, _id: -1 },

  // Trier par prix, du moins cher au plus cher
  "price-asc": { price: 1, _id: 1 },

  // Trier par prix, du plus cher au moins cher
  "price-desc": { price: -1, _id: 1 },

  // Trier par nom, dans l'ordre alphabétique
  name: { name: 1, _id: 1 },
};

// Fonction pour récupérer une liste de produits
// Elle reçoit les paramètres de pagination, recherche et tri
export async function listProducts({ page, limit, category, q, sort }) {

  // Créer un objet vide qui contiendra les conditions de recherche
  const filter = {};

  // Si une catégorie est fournie, ajouter cette condition au filtre
  if (category) filter.category = category;

  // Si un mot-clé est fourni, effectuer une recherche
  if (q) {

    // Créer une expression régulière sans tenir compte des majuscules
    const regex = new RegExp(escapeRegex(q), "i");

    // Chercher le mot dans le nom OU dans la description du produit
    filter.$or = [{ name: regex }, { description: regex }];
  }

  // Exécuter les deux requêtes MongoDB en parallèle
  const [items, total] = await Promise.all([

    // Rechercher les produits qui respectent les conditions du filtre
    Product.find(filter)

      // Appliquer le tri choisi par l'utilisateur
      .sort(SORTS[sort])

      // Ignorer les produits des pages précédentes
      .skip((page - 1) * limit)

      // Limiter le nombre de produits récupérés
      .limit(limit),

    // Compter tous les produits correspondant au filtre
    Product.countDocuments(filter),
  ]);

  // Retourner les produits et les informations de pagination
  return {
    items,                         // Liste des produits de la page actuelle
    page,                          // Numéro de la page actuelle
    limit,                         // Nombre maximum de produits par page
    total,                         // Nombre total de produits trouvés
    pages: Math.ceil(total / limit) // Nombre total de pages
  };
}

// Fonction pour récupérer un seul produit grâce à son ID
export async function getProduct(id) {

  // Rechercher le produit dans MongoDB à partir de son identifiant
  const product = await Product.findById(id);

  // Vérifier si le produit n'existe pas
  if (!product) {

    // Lancer une erreur HTTP 404 si le produit est introuvable
    throw new AppError(
      404,
      "PRODUCT_NOT_FOUND",
      "Produit introuvable."
    );
  }

  // Si le produit existe, le retourner
  return product;
}
