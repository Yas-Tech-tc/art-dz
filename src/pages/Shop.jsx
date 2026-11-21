import { useSearchParams } from "react-router-dom";
import Container from "../components/Container";
import SectionTitle from "../components/SectionTitle";
import CategoryFilter from "../components/CategoryFilter";
import ProductGrid from "../components/ProductGrid";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";
import { useGetProductsQuery } from "../api/api";
import { categories } from "../data/categories";

const SORT_MAP = {
  nouveau: "newest",
  "prix-asc": "price-asc",
  "prix-desc": "price-desc",
};

function Shop() {
  const [params, setParams] = useSearchParams();
  const selected = params.get("categorie") ?? "all";
  const query = params.get("q") ?? "";
  const sort = params.get("tri") ?? "default";

  function update(key, value, replace = false) {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    setParams(next, { replace });
  }

  const apiParams = { limit: 50 };
  if (selected !== "all") apiParams.category = selected;
  if (query.trim()) apiParams.q = query.trim();
  if (SORT_MAP[sort]) apiParams.sort = SORT_MAP[sort];

  const { data, isLoading, isError, error, refetch } = useGetProductsQuery(apiParams);
  const list = data?.items ?? [];

  return (
    <Container className="py-10">
      <SectionTitle title="Notre boutique" subtitle={`${data?.total ?? list.length} produit(s)`} />

      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        <label className="flex-1">
          <span className="sr-only">Rechercher un produit</span>
          <input
            type="search"
            value={query}
            onChange={(e) => update("q", e.target.value, true)}
            placeholder="Rechercher un produit..."
            className="min-h-11 w-full rounded-full border-2 border-night/30 bg-cream px-5"
          />
        </label>

        <label>
          <span className="sr-only">Trier les produits</span>
          <select
            value={sort}
            onChange={(e) => update("tri", e.target.value === "default" ? "" : e.target.value)}
            className="min-h-11 w-full rounded-full border-2 border-night/30 bg-cream px-4 sm:w-auto"
          >
            <option value="default">Trier par</option>
            <option value="nouveau">Nouveautés</option>
            <option value="prix-asc">Prix croissant</option>
            <option value="prix-desc">Prix décroissant</option>
          </select>
        </label>
      </div>

      <CategoryFilter
        categories={categories}
        selected={selected}
        onSelect={(id) => update("categorie", id === "all" ? "" : id)}
      />

      {isLoading ? (
        <LoadingState message="Chargement de la boutique..." />
      ) : isError ? (
        <ErrorState error={error} onRetry={refetch} />
      ) : (
        <ProductGrid products={list} />
      )}
    </Container>
  );
}

export default Shop;
