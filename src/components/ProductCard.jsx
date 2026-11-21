import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import Button from "./Button";
import FavoriteButton from "./FavoriteButton";
import ProductImage from "./ProductImage";
import { addItem } from "../store/cartSlice";
import { formatPrice } from "../utils/formatPrice";
import { getCategoryName } from "../data/categories";

function ProductCard({ product }) {
  const dispatch = useDispatch();
  const { id, name, price, category, images = [], imageUrl, isNewArrival, isNew, inStock } = product;
  const mainImage = images.at(0) || imageUrl;
  const showNewBadge = isNewArrival ?? isNew;

  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-night/10 bg-cream">
      <div className="relative">
        <Link to={`/produit/${id}`} className="block aspect-square bg-sand">
          <ProductImage src={mainImage} alt={name} className="h-full w-full" />
        </Link>
        {showNewBadge && (
          <span className="pointer-events-none absolute left-3 top-3 rounded-full bg-saffron px-3 py-1 text-xs font-bold text-night">
            Nouveau
          </span>
        )}
        <FavoriteButton productId={id} name={name} />
      </div>

      <div className="flex flex-1 flex-col gap-1 p-4">
        <p className="text-xs font-bold uppercase tracking-wide text-olive">
          {getCategoryName(category)}
        </p>
        <h3 className="text-base leading-snug">
          <Link to={`/produit/${id}`} className="hover:text-terracotta">
            {name}
          </Link>
        </h3>

        <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-3">
          <span className="font-bold">{formatPrice(price)}</span>
          <Button onClick={() => dispatch(addItem({ id, quantity: 1 }))} disabled={!inStock}>
            {inStock ? "Ajouter" : "Épuisé"}
          </Button>
        </div>
      </div>
    </article>
  );
}

export default ProductCard;
