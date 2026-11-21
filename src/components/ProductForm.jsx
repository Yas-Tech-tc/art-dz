import { useState } from "react";
import Button from "./Button";
import { categories } from "../data/categories";

function ProductForm({ initialProduct = null, onSubmit, onCancel, isLoading, serverError }) {
  const isEdit = Boolean(initialProduct);

  const [name, setName] = useState(initialProduct?.name ?? "");
  const [category, setCategory] = useState(initialProduct?.category ?? categories.at(0)?.id ?? "");
  const [price, setPrice] = useState(initialProduct?.price ?? "");
  const [stock, setStock] = useState(initialProduct?.stock ?? 10);
  const [imageUrl, setImageUrl] = useState(
    initialProduct?.imageUrl || initialProduct?.images?.at(0) || ""
  );
  const [description, setDescription] = useState(initialProduct?.description ?? "");
  const [materials, setMaterials] = useState(initialProduct?.materials ?? "");
  const [dimensions, setDimensions] = useState(initialProduct?.dimensions ?? "");
  const [featured, setFeatured] = useState(Boolean(initialProduct?.featured));
  const [isNewArrival, setIsNewArrival] = useState(Boolean(initialProduct?.isNewArrival));

  const fieldErrors = serverError?.fieldErrors || {};

  function handleSubmit(e) {
    e.preventDefault();

    const cleanImage = imageUrl.trim();
    const payload = {
      name: name.trim(),
      category,
      price: Number.parseInt(price, 10) || 0,
      stock: Number.parseInt(stock, 10) || 0,
      imageUrl: cleanImage,
      images: cleanImage ? [cleanImage] : [],
      description: description.trim(),
      materials: materials.trim(),
      dimensions: dimensions.trim(),
      featured,
      isNewArrival,
    };

    onSubmit(payload);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-8 rounded-2xl border border-night/15 bg-cream p-6"
    >
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold">
          {isEdit ? `Modifier : ${initialProduct.name}` : "Ajouter un nouveau produit"}
        </h2>
        <button
          type="button"
          onClick={onCancel}
          className="cursor-pointer text-sm font-medium underline hover:text-terracotta"
        >
          Fermer
        </button>
      </div>

      {serverError && (
        <div role="alert" className="mb-4 rounded-xl bg-terracotta/15 p-3 text-sm font-medium text-terracotta">
          {serverError.message}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="prod-name" className="block text-sm font-bold">
            Nom du produit *
          </label>
          <input
            id="prod-name"
            type="text"
            required
            minLength={2}
            maxLength={120}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 min-h-11 w-full rounded-xl border-2 border-night/25 bg-white px-3"
          />
          {fieldErrors.name && <p className="mt-1 text-xs text-terracotta">{fieldErrors.name}</p>}
        </div>

        <div>
          <label htmlFor="prod-category" className="block text-sm font-bold">
            Catégorie *
          </label>
          <select
            id="prod-category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="mt-1 min-h-11 w-full rounded-xl border-2 border-night/25 bg-white px-3"
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          {fieldErrors.category && (
            <p className="mt-1 text-xs text-terracotta">{fieldErrors.category}</p>
          )}
        </div>

        <div>
          <label htmlFor="prod-price" className="block text-sm font-bold">
            Prix (en DA, entier) *
          </label>
          <input
            id="prod-price"
            type="number"
            required
            min={0}
            step={1}
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="mt-1 min-h-11 w-full rounded-xl border-2 border-night/25 bg-white px-3"
          />
          {fieldErrors.price && <p className="mt-1 text-xs text-terracotta">{fieldErrors.price}</p>}
        </div>

        <div>
          <label htmlFor="prod-stock" className="block text-sm font-bold">
            Stock *
          </label>
          <input
            id="prod-stock"
            type="number"
            required
            min={0}
            step={1}
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            className="mt-1 min-h-11 w-full rounded-xl border-2 border-night/25 bg-white px-3"
          />
          {fieldErrors.stock && <p className="mt-1 text-xs text-terracotta">{fieldErrors.stock}</p>}
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="prod-image" className="block text-sm font-bold">
            URL de l'image (https://... ou /images/...)
          </label>
          <input
            id="prod-image"
            type="text"
            maxLength={500}
            placeholder="https://exemple.com"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="mt-1 min-h-11 w-full rounded-xl border-2 border-night/25 bg-white px-3"
          />
          {(fieldErrors.imageUrl || fieldErrors.images) && (
            <p className="mt-1 text-xs text-terracotta">
              {fieldErrors.imageUrl || fieldErrors.images}
            </p>
          )}
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="prod-desc" className="block text-sm font-bold">
            Description
          </label>
          <textarea
            id="prod-desc"
            rows={3}
            maxLength={2000}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 w-full rounded-xl border-2 border-night/25 bg-white p-3"
          />
          {fieldErrors.description && (
            <p className="mt-1 text-xs text-terracotta">{fieldErrors.description}</p>
          )}
        </div>

        <div>
          <label htmlFor="prod-materials" className="block text-sm font-bold">
            Matériaux
          </label>
          <input
            id="prod-materials"
            type="text"
            maxLength={200}
            value={materials}
            onChange={(e) => setMaterials(e.target.value)}
            className="mt-1 min-h-11 w-full rounded-xl border-2 border-night/25 bg-white px-3"
          />
          {fieldErrors.materials && (
            <p className="mt-1 text-xs text-terracotta">{fieldErrors.materials}</p>
          )}
        </div>

        <div>
          <label htmlFor="prod-dimensions" className="block text-sm font-bold">
            Dimensions
          </label>
          <input
            id="prod-dimensions"
            type="text"
            maxLength={100}
            value={dimensions}
            onChange={(e) => setDimensions(e.target.value)}
            className="mt-1 min-h-11 w-full rounded-xl border-2 border-night/25 bg-white px-3"
          />
          {fieldErrors.dimensions && (
            <p className="mt-1 text-xs text-terracotta">{fieldErrors.dimensions}</p>
          )}
        </div>

        <div className="flex flex-wrap gap-6 sm:col-span-2">
          <label className="flex cursor-pointer items-center gap-2 font-medium">
            <input
              type="checkbox"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
              className="h-4 w-4"
            />
            Produit vedette (accueil)
          </label>

          <label className="flex cursor-pointer items-center gap-2 font-medium">
            <input
              type="checkbox"
              checked={isNewArrival}
              onChange={(e) => setIsNewArrival(e.target.checked)}
              className="h-4 w-4"
            />
            Badge « Nouveau »
          </label>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Button type="submit" disabled={isLoading}>
          {isLoading
            ? "Enregistrement..."
            : isEdit
              ? "Enregistrer les modifications"
              : "Créer le produit"}
        </Button>
        <button
          type="button"
          onClick={onCancel}
          className="min-h-11 cursor-pointer rounded-full border-2 border-night/25 px-6 font-bold hover:border-night"
        >
          Annuler
        </button>
      </div>
    </form>
  );
}

export default ProductForm;
