import * as productService from "../services/product.service.js"; // Importer toutes les fonctions du service des produits

// Fonction pour récupérer la liste des produits avec les filtres et la pagination, puis l'envoyer au frontend.
export async function list(req, res) {
  const data = await productService.listProducts(req.valid.query);
  res.status(200).json({ success: true, data });
}

// Récupérer un produit par son ID et l'envoyer au frontend.
export async function getOne(req, res) {
  const product = await productService.getProduct(req.valid.params.id);
  res.status(200).json({ success: true, data: { product } });
}

export async function create(req, res) {
  const product = await productService.createProduct(req.valid.body);
  res.status(201).json({ success: true, data: { product } });
}

export async function update(req, res) {
  const product = await productService.updateProduct(req.valid.params.id, req.valid.body);
  res.status(200).json({ success: true, data: { product } });
}

export async function remove(req, res) {
  await productService.deleteProduct(req.valid.params.id);
  res.status(200).json({ success: true, data: { message: "Produit supprimé." } });
}


