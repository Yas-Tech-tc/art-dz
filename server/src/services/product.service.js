import { Product } from "../models/Product.js";
import { AppError } from "../utils/AppError.js";
import { escapeRegex } from "../utils/escapeRegex.js";


// Définir les méthodes de tri autorisées
const SORTS = {
  newest: { createdAt: -1, _id: -1 }, // Du plus récent au plus ancien
  "price-asc": { price: 1, _id: 1 },  // Du moins cher au plus cher
  "price-desc": { price: -1, _id: 1 }, // Du plus cher au moins cher
  name: { name: 1, _id: 1 },          // Ordre alphabétique
};


// Créer une fonction qui retourne une erreur 404 si le produit n'existe pas
const productNotFound = () => new AppError(404, "PRODUCT_NOT_FOUND", "Produit introuvable.");


// Fonction pour récupérer la liste des produits avec recherche, filtres, tri et pagination
export async function listProducts({ page, limit, category, q, sort }) {

  // Créer un objet qui contiendra les conditions de recherche
  const filter = {};

  // Ajouter la catégorie au filtre si elle est fournie
  if (category) filter.category = category;

  // Vérifier si un mot-clé de recherche est fourni
  if (q) {

    // Créer une Regex pour rechercher le mot sans distinguer majuscules et minuscules
    const regex = new RegExp(escapeRegex(q), "i");

    // Chercher le mot dans le nom OU dans la description
    filter.$or = [{ name: regex }, { description: regex }];
  }

  // Exécuter les deux requêtes MongoDB en parallèle
  const [items, total] = await Promise.all([

    // Récupérer les produits correspondant au filtre
    Product.find(filter)

      // Appliquer le tri choisi
      .sort(SORTS[sort])

      // Ignorer les produits des pages précédentes
      .skip((page - 1) * limit)

      // Limiter le nombre de produits récupérés
      .limit(limit),

    // Compter le nombre total de produits correspondant au filtre
    Product.countDocuments(filter),
  ]);

  // Retourner les produits et les informations de pagination
  return { items, page, limit, total, pages: Math.ceil(total / limit) };
}


// Fonction pour récupérer un seul produit grâce à son ID
export async function getProduct(id) {

  // Rechercher le produit dans MongoDB par son ID
  const product = await Product.findById(id);

  // Si le produit n'existe pas, lancer une erreur 404
  if (!product) throw productNotFound();

  // Retourner le produit trouvé
  return product;
}


// Fonction pour créer un nouveau produit dans MongoDB
export function createProduct(data) {

  // Enregistrer le produit avec les données reçues
  return Product.create(data);
}


// Fonction pour modifier un produit existant
export async function updateProduct(id, data) {

  // Rechercher le produit par son ID et appliquer les modifications
  const product = await Product.findByIdAndUpdate(
    id,

    // $set permet de modifier uniquement les champs fournis dans data
    { $set: data },

    {
      returnDocument: "after", // Retourner le produit après sa modification
      runValidators: true      // Vérifier les données avec les validateurs du modèle
    }
  );

  // Si aucun produit n'a été trouvé, lancer une erreur 404
  if (!product) throw productNotFound();

  // Retourner le produit modifié
  return product;
}


// Fonction pour supprimer un produit grâce à son ID
export async function deleteProduct(id) {

  // Rechercher le produit par son ID et le supprimer de MongoDB
  const product = await Product.findByIdAndDelete(id);

  // Si aucun produit n'a été trouvé, lancer une erreur 404
  if (!product) throw productNotFound();
}
