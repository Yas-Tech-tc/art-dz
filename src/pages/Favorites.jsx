import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Container from "../components/Container";
import SectionTitle from "../components/SectionTitle";
import ProductGrid from "../components/ProductGrid";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";
import { pruneInvalidFavorites, selectFavoriteIds } from "../store/favoritesSlice";
import { useGetProductsQuery } from "../api/api";

function Favorites() {
  const dispatch = useDispatch();
  const ids = useSelector(selectFavoriteIds);
  const { data, isLoading, isError, error, refetch } = useGetProductsQuery({ limit: 100 });
  const products = data?.items ?? [];

  useEffect(() => {
    if (data?.items) {
      dispatch(pruneInvalidFavorites(data.items.map((p) => p.id)));
    }
  }, [data, dispatch]);

  const list = products.filter((p) => ids.includes(p.id));

  if (isLoading && ids.length > 0) {
    return (
      <Container className="py-10">
        <LoadingState message="Chargement de vos favoris..." />
      </Container>
    );
  }

  if (isError && ids.length > 0) {
    return (
      <Container className="py-10">
        <ErrorState error={error} onRetry={refetch} />
      </Container>
    );
  }

  return (
    <Container className="py-10">
      <SectionTitle title="Mes favoris" subtitle={`${list.length} produit(s)`} />

      {list.length === 0 ? (
        <div className="py-8">
          <p>Vous n'avez pas encore de favoris. Cliquez sur le cœur d'un produit pour le retrouver ici.</p>
          <Link to="/boutique" className="mt-4 inline-block font-bold text-terracotta hover:underline">
            Voir la boutique
          </Link>
        </div>
      ) : (
        <ProductGrid products={list} />
      )}
    </Container>
  );
}

export default Favorites;
