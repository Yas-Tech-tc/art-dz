import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import Container from "../components/Container";
import Button from "../components/Button";
import ProductGallery from "../components/ProductGallery";
import QuantitySelector from "../components/QuantitySelector";
import SectionTitle from "../components/SectionTitle";
import ProductGrid from "../components/ProductGrid";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";
import { useGetProductByIdQuery, useGetProductsQuery } from "../api/api";
import { getCategoryName } from "../data/categories";
import { formatPrice } from "../utils/formatPrice";
import { addItem } from "../store/cartSlice";

function ProductView({ product }) {
  const [quantity, setQuantity] = useState(1);
  const dispatch = useDispatch();

  const { data: catData } = useGetProductsQuery({
    category: product.category,
    limit: 5,
  });

  const similar = (catData?.items ?? [])
    .filter((p) => p.id !== product.id)
    .slice(0, 4);

  const galleryImages = product.images?.length
    ? product.images
    : product.imageUrl
      ? [product.imageUrl]
      : [];

  function handleAdd() {
    dispatch(addItem({ id: product.id, quantity }));
  }

  return (
    <Container className="py-8">
      {/* Fil d'Ariane */}
      <nav aria-label="Fil d'Ariane" className="mb-6 text-sm text-night/70">
        <Link to="/" className="hover:text-terracotta">Accueil</Link> /{" "}
        <Link to="/boutique" className="hover:text-terracotta">Boutique</Link> /{" "}
        <Link to={`/boutique?categorie=${product.category}`} className="hover:text-terracotta">
          {getCategoryName(product.category)}
        </Link>{" "}
        / <span className="text-night">{product.name}</span>
      </nav>

      <div className="grid gap-8 md:grid-cols-2 lg:gap-12">
        <ProductGallery images={galleryImages} name={product.name} />

        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-olive">
            {getCategoryName(product.category)}
          </p>
          <h1 className="mt-1 text-3xl leading-tight">{product.name}</h1>
          <p className="mt-3 text-2xl font-bold">{formatPrice(product.price)}</p>

          <p className={`mt-2 font-medium ${product.inStock ? "text-olive" : "text-night/60"}`}>
            {product.inStock ? "En stock" : "Épuisé"}
          </p>

          <p className="mt-5 leading-relaxed">{product.description}</p>

          <dl className="mt-5 grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 border-t border-night/10 pt-5">
            <dt className="font-bold">Matériaux</dt>
            <dd>{product.materials || "Non précisé"}</dd>
            <dt className="font-bold">Dimensions</dt>
            <dd>{product.dimensions || "Non précisé"}</dd>
            <dt className="font-bold">Fabrication</dt>
            <dd>Fait main en Algérie</dd>
          </dl>

          {product.inStock && (
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <QuantitySelector value={quantity} onChange={setQuantity} />
              <Button onClick={handleAdd} className="flex-1 sm:flex-none">
                Ajouter · {formatPrice(product.price * quantity)}
              </Button>
            </div>
          )}

          <Link to="/boutique" className="mt-8 inline-block font-bold hover:text-terracotta">
            ← Retour à la boutique
          </Link>
        </div>
      </div>

      {/* Produits similaires */}
      {similar.length > 0 && (
        <section className="mt-16">
          <SectionTitle title="Dans la même catégorie" />
          <ProductGrid products={similar} />
        </section>
      )}
    </Container>
  );
}

function ProductDetail() {
  const { id } = useParams();
  const { data: product, isLoading, isError, error, refetch } = useGetProductByIdQuery(id);

  if (isLoading) {
    return (
      <Container className="py-16">
        <LoadingState message="Chargement du produit..." />
      </Container>
    );
  }

  if (isError || !product) {
    return (
      <Container className="py-16">
        <ErrorState error={error} onRetry={refetch} />
        <Link to="/boutique" className="mt-4 inline-block font-bold text-terracotta">
          ← Retour à la boutique
        </Link>
      </Container>
    );
  }

  return <ProductView key={product.id} product={product} />;
}

export default ProductDetail;
