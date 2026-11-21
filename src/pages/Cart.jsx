import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Container from "../components/Container";
import SectionTitle from "../components/SectionTitle";
import Button from "../components/Button";
import CartItem from "../components/CartItem";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";
import { clearCart, pruneInvalidItems, selectCartItems } from "../store/cartSlice";
import { useGetProductsQuery } from "../api/api";
import { formatPrice } from "../utils/formatPrice";

function Cart() {
  const dispatch = useDispatch();
  const items = useSelector(selectCartItems);
  const [ordered, setOrdered] = useState(false);

  const { data, isLoading, isError, error, refetch } = useGetProductsQuery({ limit: 100 });
  const products = data?.items ?? [];

  useEffect(() => {
    if (data?.items) {
      dispatch(pruneInvalidItems(data.items.map((p) => p.id)));
    }
  }, [data, dispatch]);

  if (isLoading && items.length > 0) {
    return (
      <Container className="py-16">
        <LoadingState message="Chargement de votre panier..." />
      </Container>
    );
  }

  if (isError && items.length > 0) {
    return (
      <Container className="py-16">
        <ErrorState error={error} onRetry={refetch} />
      </Container>
    );
  }

  const lines = items
    .map((item) => ({
      product: products.find((p) => p.id === item.id),
      quantity: item.quantity,
    }))
    .filter((line) => line.product);

  const total = lines.reduce((sum, line) => sum + line.product.price * line.quantity, 0);

  function handleOrder() {
    dispatch(clearCart());
    setOrdered(true);
  }

  if (lines.length === 0) {
    return (
      <Container className="py-16 text-center">
        <h1 className="text-3xl">
          {ordered ? "Merci pour votre commande !" : "Votre panier est vide"}
        </h1>
        <p className="mx-auto mt-3 max-w-md">
          {ordered
            ? "Commande enregistrée : merci pour votre confiance."
            : "Découvrez nos créations faites main et ajoutez vos coups de cœur."}
        </p>
        <Link
          to="/boutique"
          className="mt-8 inline-flex min-h-12 items-center rounded-full bg-terracotta px-8 font-bold text-white hover:bg-terracotta-dark"
        >
          Voir la boutique
        </Link>
      </Container>
    );
  }

  return (
    <Container className="py-10">
      <SectionTitle title="Votre panier" subtitle={`${lines.length} produit(s) différent(s)`} />

      <div className="grid gap-10 lg:grid-cols-[1fr_340px]">
        <ul>
          {lines.map((line) => (
            <CartItem key={line.product.id} product={line.product} quantity={line.quantity} />
          ))}
        </ul>

        <aside className="h-fit rounded-2xl border border-night/10 bg-cream p-6 lg:sticky lg:top-24">
          <h2 className="text-xl">Récapitulatif</h2>

          <dl className="mt-4 grid grid-cols-[1fr_auto] gap-y-2">
            <dt>Sous-total</dt>
            <dd>{formatPrice(total)}</dd>
            <dt>Livraison</dt>
            <dd className="text-night/70">Calculée à la commande</dd>
            <dt className="border-t border-night/10 pt-3 text-lg font-bold">Total</dt>
            <dd className="border-t border-night/10 pt-3 text-lg font-bold">
              {formatPrice(total)}
            </dd>
          </dl>

          <Button onClick={handleOrder} className="mt-6 w-full">
            Valider la commande
          </Button>
          <button
            onClick={() => dispatch(clearCart())}
            className="mt-3 min-h-11 w-full cursor-pointer text-sm font-medium underline hover:text-terracotta"
          >
            Vider le panier
          </button>
        </aside>
      </div>
    </Container>
  );
}

export default Cart;
