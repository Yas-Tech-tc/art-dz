import { useState } from "react";
import ProductImage from "./ProductImage";

function ProductGallery({ images = [], name }) {
  const [current, setCurrent] = useState(0);
  const safeImages = images.filter(Boolean);

  return (
    <div>
      <ProductImage
        src={safeImages[current] || ""}
        alt={name}
        className="aspect-square w-full rounded-2xl"
      />

      {safeImages.length > 1 && (
        <div className="mt-3 flex gap-3">
          {safeImages.map((img, i) => (
            <button
              key={`${img}-${i}`}
              onClick={() => setCurrent(i)}
              aria-label={`Voir la photo ${i + 1}`}
              aria-pressed={i === current}
              className={`h-20 w-20 cursor-pointer overflow-hidden rounded-lg border-2 ${
                i === current ? "border-night" : "border-transparent"
              }`}
            >
              <ProductImage src={img} alt="" className="h-full w-full" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProductGallery;
