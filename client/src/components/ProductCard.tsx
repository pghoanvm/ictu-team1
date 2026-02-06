// client/src/components/ProductCard.tsx
import { Link } from "react-router-dom";
import type { Product } from "../types/Product";
import { useCart } from "../context/CartContext";

interface Props {
  product: Product;
}

const ProductCard = ({ product }: Props) => {
  const { addToCart } = useCart();

  return (
    <div className="group relative">
      {/* 1. Ảnh sản phẩm có hiệu ứng zoom nhẹ */}
      <div className="aspect-[3/4] w-full overflow-hidden bg-gray-100 relative">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />

        {/* Nút Quick Add hiện ra khi hover */}
        <button
          onClick={() => addToCart(product)}
          className="absolute bottom-4 left-4 right-4 bg-white text-black py-3 font-bold uppercase text-sm opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 shadow-lg hover:bg-black hover:text-white"
        >
          Thêm vào giỏ
        </button>
      </div>

      {/* 2. Thông tin sản phẩm */}
      <div className="mt-4 flex justify-between items-start">
        <div>
          <h3 className="text-sm font-medium text-gray-900">
            <Link to={`/product/${product.id}`}>
              <span aria-hidden="true" className="absolute inset-0" />
              {product.name}
            </Link>
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {product.category || "Fashion"}
          </p>
        </div>
        <p className="text-sm font-bold text-gray-900">
          {new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
          }).format(product.price)}
        </p>
      </div>
    </div>
  );
};

export default ProductCard;
