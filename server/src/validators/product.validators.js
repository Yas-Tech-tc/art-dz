
import { z } from "zod";
import { CATEGORY_IDS } from "../config/categories.js";

// Schema used to validate product IDs in route parameters.
export const idParam = z.object({
  // The ID must be a 24-character hexadecimal string,
  // which corresponds to the format of a MongoDB ObjectId.
  // The "i" flag allows uppercase and lowercase letters.
  id: z.string().regex(/^[a-f\d]{24}$/i, "Invalid ID"),
});

// Schema used to validate query parameters when listing products.
export const listProductsQuery = z.object({

  // Page number:
  // Converts the value to a number, requires an integer,
  // accepts values between 1 and 10000,
  // and defaults to 1 if not provided.
  page: z.coerce.number().int().min(1).max(10000).default(1),

  // Number of products per page:
  // Converts the value to a number, requires an integer,
  // accepts values between 1 and 100,
  // and defaults to 50 products.
  limit: z.coerce.number().int().min(1).max(100).default(50),

  // Product category:
  // Must be one of the category IDs defined in CATEGORY_IDS.
  // This field is optional, so users can retrieve all categories.
  category: z.enum(CATEGORY_IDS).optional(),

  // Search keyword:
  // Must be a string, removes extra spaces,
  // requires at least 1 character,
  // accepts a maximum of 100 characters,
  // and is optional.
  q: z.string().trim().min(1).max(100).optional(),

  // Product sorting option:
  // Accepts only the specified sorting values.
  // Defaults to "newest" if no sorting option is provided.
  sort: z.enum(["newest", "price-asc", "price-desc", "name"]).default("newest"),
});


// Définir un validateur pour les URL des images
const safeUrl = z
  .string() // La valeur doit être une chaîne de caractères
  .trim() // Supprimer les espaces au début et à la fin
  .max(500) // Limiter la longueur à 500 caractères
  .refine((value) => { // Ajouter des vérifications personnalisées

    // Accepter une chaîne vide
    if (value === "") return true;

    // Accepter les chemins locaux commençant par / (mais pas //)
    if (/^\/(?!\/)[\w\-./%]*$/.test(value)) return true;

    try {
      // Essayer de transformer la valeur en URL
      const url = new URL(value);

      // Accepter uniquement les URL utilisant HTTP ou HTTPS
      return url.protocol === "http:" || url.protocol === "https:";

    } catch {
      // Si l'URL est invalide, rejeter la valeur
      return false;
    }
  }, "URL d'image invalide (http, https ou chemin commençant par /)");


// Définir la structure et les règles de validation des champs d'un produit
const productFields = z.object({

  // Le nom doit contenir entre 2 et 120 caractères
  name: z.string().trim().min(2).max(120),

  // La description est une chaîne de 2000 caractères maximum
  description: z.string().trim().max(2000),

  // Le prix doit être un nombre entier positif ou égal à 0
  price: z.number().int().min(0).max(10_000_000),

  // La catégorie doit appartenir à la liste CATEGORY_IDS
  category: z.enum(CATEGORY_IDS),

  // Valider l'URL de l'image principale
  imageUrl: safeUrl,

  // Accepter un tableau contenant au maximum 8 URL d'images valides
  images: z.array(safeUrl).max(8),

  // Le stock doit être un entier entre 0 et 100000
  stock: z.number().int().min(0).max(100000),

  // Vérifier que featured est une valeur booléenne (true ou false)
  featured: z.boolean(),

  // Vérifier que isNewArrival est une valeur booléenne
  isNewArrival: z.boolean(),

  // Les matériaux doivent être une chaîne de 200 caractères maximum
  materials: z.string().trim().max(200),

  // Les dimensions doivent être une chaîne de 100 caractères maximum
  dimensions: z.string().trim().max(100),
});


// Créer le schéma de validation pour l'ajout d'un produit
export const createProductSchema = productFields

  // Rendre certains champs facultatifs lors de la création
  .partial({
    description: true,
    imageUrl: true,
    images: true,
    stock: true,
    featured: true,
    isNewArrival: true,
    materials: true,
    dimensions: true,
  })

  // Refuser les champs supplémentaires qui ne sont pas définis dans productFields
  .strict();


// Créer le schéma de validation pour la modification d'un produit
export const updateProductSchema = productFields

  // Rendre tous les champs facultatifs (on peut modifier seulement certains champs)
  .partial()

  // Refuser les champs supplémentaires non définis dans productFields
  .strict()

  // Vérifier qu'au moins un champ est fourni pour effectuer la modification
  .refine(
    (data) => Object.keys(data).length > 0,
    "Au moins un champ à modifier est requis"
  );
