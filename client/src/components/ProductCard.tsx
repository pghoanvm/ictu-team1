import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

// SỬA: Khai báo đầy đủ các trường để khớp với hệ thống
interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  description: string; // <-- Đã thêm
  category: string; // <-- Đã thêm
}

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();

  return (
    <div className="group relative border border-transparent hover:border-gray-200 hover:shadow-lg transition-all duration-300 bg-white pb-4">
      {/* 1. ẢNH SẢN PHẨM & NÚT MUA NHANH */}
      <div className="relative overflow-hidden w-full aspect-[3/4]">
        <Link to={`/product/${product.id}`}>
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </Link>

        {/* Nút "Thêm vào giỏ" trượt từ dưới lên */}
        <button
          onClick={() => addToCart(product)}
          className="absolute bottom-0 left-0 right-0 bg-black text-white text-xs font-bold uppercase py-3 
                     translate-y-full transition-transform duration-300 group-hover:translate-y-0 hover:bg-gray-800 z-10 cursor-pointer"
        >
          + Thêm vào giỏ
        </button>

        {/* Nhãn Sale */}
        <span className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-bold px-2 py-1">
          -20%
        </span>
      </div>

      {/* 2. THÔNG TIN */}
      <div className="text-center mt-3 px-2">
        <h3 className="text-sm text-gray-700 hover:text-black transition-colors truncate font-medium">
          <Link to={`/product/${product.id}`}>{product.name}</Link>
        </h3>
        <div className="mt-1 flex justify-center items-center gap-2">
          <span className="text-red-600 font-bold text-sm md:text-base">
            {product.price.toLocaleString("vi-VN")}₫
          </span>
          <span className="text-gray-400 text-xs line-through">
            {(product.price * 1.2).toLocaleString("vi-VN")}₫
          </span>
        </div>
      </div>
    </div>
  );
}
