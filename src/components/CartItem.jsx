import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import ProductImage from "./ProductImage";
import QuantitySelector from "./QuantitySelector";
import { removeItem, setQuantity } from "../store/cartSlice";
import { formatPrice } from "../utils/formatPrice";

function CartItem({ product, quantity }) {
  const dispatch = useDispatch();
  const mainImage = product.images?.[0] || product.imageUrl;

  return (
    <li className="flex gap-4 border-b border-night/10 py-5">
      <Link to={`/produit/${product.id}`} className="h-24 w-24 shrink-0 sm:h-28 sm:w-28">
        <ProductImage
          src={mainImage}
          alt={product.name}
          className="h-full w-full rounded-xl"
        />
      </Link>

      <div className="flex flex-1 flex-col gap-3">
        <div className="flex justify-between gap-4">
          <div>
            <h3 className="text-base leading-snug">
              <Link to={`/produit/${product.id}`} className="hover:text-terracotta">
                {product.name}
              </Link>
            </h3>
            <p className="mt-1 text-sm text-night/70">{formatPrice(product.price)} l'unité</p>
          </div>
          <p className="font-bold">{formatPrice(product.price * quantity)}</p>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <QuantitySelector
            value={quantity}
            onChange={(q) => dispatch(setQuantity({ id: product.id, quantity: q }))}
          />
          <button
            onClick={() => dispatch(removeItem(product.id))}
            className="min-h-11 cursor-pointer px-2 text-sm font-medium underline hover:text-terracotta"
          >
            Supprimer
          </button>
        </div>
      </div>
    </li>
  );
}

export default CartItem;
