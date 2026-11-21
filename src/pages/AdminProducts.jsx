import { useState } from "react";
import Container from "../components/Container";
import SectionTitle from "../components/SectionTitle";
import Button from "../components/Button";
import ProductForm from "../components/ProductForm";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";
import {
  useCreateProductMutation,
  useDeleteProductMutation,
  useGetProductsQuery,
  useUpdateProductMutation,
} from "../api/api";
import { getCategoryName } from "../data/categories";
import { formatPrice } from "../utils/formatPrice";
import { parseApiError } from "../utils/apiError";

function AdminProducts() {
  const { data, isLoading, isError, error, refetch } = useGetProductsQuery({ limit: 100 });
  const products = data?.items ?? [];

  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formError, setFormError] = useState(null);
  const [actionMessage, setActionMessage] = useState(null);

  async function handleCreate(payload) {
    setFormError(null);
    setActionMessage(null);
    try {
      await createProduct(payload).unwrap();
      setShowCreateForm(false);
      setActionMessage({ type: "success", text: "Produit créé avec succès." });
    } catch (err) {
      setFormError(parseApiError(err));
    }
  }

  async function handleUpdate(payload) {
    if (!editingProduct) return;
    setFormError(null);
    setActionMessage(null);
    try {
      await updateProduct({ id: editingProduct.id, ...payload }).unwrap();
      setEditingProduct(null);
      setActionMessage({ type: "success", text: "Produit mis à jour avec succès." });
    } catch (err) {
      setFormError(parseApiError(err));
    }
  }

  async function handleDelete(product) {
    const confirmed = window.confirm(
      `Voulez-vous vraiment supprimer « ${product.name} » ? Cette action est irréversible.`
    );
    if (!confirmed) return;

    setActionMessage(null);
    try {
      await deleteProduct(product.id).unwrap();
      if (editingProduct?.id === product.id) setEditingProduct(null);
      setActionMessage({ type: "success", text: `« ${product.name} » a été supprimé.` });
    } catch (err) {
      const parsed = parseApiError(err);
      setActionMessage({ type: "error", text: parsed.message });
    }
  }

  return (
    <Container className="py-10">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <SectionTitle
          title="Gestion des produits"
          subtitle={`${data?.total ?? products.length} produit(s) en catalogue`}
        />
        {!showCreateForm && !editingProduct && (
          <Button
            onClick={() => {
              setFormError(null);
              setActionMessage(null);
              setShowCreateForm(true);
            }}
          >
            + Nouveau produit
          </Button>
        )}
      </div>

      {actionMessage && (
        <div
          role="status"
          className={`mb-6 rounded-xl p-4 text-sm font-medium ${
            actionMessage.type === "error"
              ? "bg-terracotta/15 text-terracotta"
              : "bg-olive/15 text-olive"
          }`}
        >
          {actionMessage.text}
        </div>
      )}

      {showCreateForm && (
        <ProductForm
          onSubmit={handleCreate}
          onCancel={() => {
            setShowCreateForm(false);
            setFormError(null);
          }}
          isLoading={isCreating}
          serverError={formError}
        />
      )}

      {editingProduct && (
        <ProductForm
          key={editingProduct.id}
          initialProduct={editingProduct}
          onSubmit={handleUpdate}
          onCancel={() => {
            setEditingProduct(null);
            setFormError(null);
          }}
          isLoading={isUpdating}
          serverError={formError}
        />
      )}

      {isLoading ? (
        <LoadingState message="Chargement du catalogue administrateur..." />
      ) : isError ? (
        <ErrorState error={error} onRetry={refetch} />
      ) : products.length === 0 ? (
        <p className="py-8">Aucun produit dans la base de données.</p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-night/15 bg-cream">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-night/15 bg-night/5">
                <th className="p-4 font-bold">Nom</th>
                <th className="p-4 font-bold">Catégorie</th>
                <th className="p-4 font-bold">Prix</th>
                <th className="p-4 font-bold">Stock</th>
                <th className="p-4 text-right font-bold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b border-night/10 last:border-b-0">
                  <td className="p-4 font-medium">{product.name}</td>
                  <td className="p-4 text-night/80">{getCategoryName(product.category)}</td>
                  <td className="p-4 font-bold">{formatPrice(product.price)}</td>
                  <td className="p-4">
                    <span
                      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-bold ${
                        product.stock > 0
                          ? "bg-olive/15 text-olive"
                          : "bg-terracotta/15 text-terracotta"
                      }`}
                    >
                      {product.stock}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="inline-flex gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setShowCreateForm(false);
                          setFormError(null);
                          setActionMessage(null);
                          setEditingProduct(product);
                        }}
                        className="min-h-9 cursor-pointer rounded-lg border border-night/25 px-3 font-medium hover:border-night"
                      >
                        Modifier
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(product)}
                        className="min-h-9 cursor-pointer rounded-lg border border-terracotta/40 px-3 font-medium text-terracotta hover:bg-terracotta hover:text-white"
                      >
                        Supprimer
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Container>
  );
}

export default AdminProducts;
