import { useEffect, useState } from "react";
import axios from "axios";
import type { Product } from "../types/Product";
import { useCart } from "../context/CartContext"; // <--- Import

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const { addToCart } = useCart(); // <--- Lấy hàm từ kho

  useEffect(() => {
    // ... (Giữ nguyên phần gọi API cũ) ...
    axios
      .get("http://localhost:8080/api/products")
      .then((res) => setProducts(res.data));
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Danh sách sản phẩm
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="border rounded-lg shadow-lg overflow-hidden"
          >
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-64 object-cover"
            />
            <div className="p-4">
              <h2 className="text-xl font-semibold">{product.name}</h2>
              <div className="mt-4 flex justify-between items-center">
                <span className="text-red-600 font-bold">
                  {product.price.toLocaleString("vi-VN")} đ
                </span>

                {/* SỬA NÚT BẤM TẠI ĐÂY */}
                <button
                  onClick={() => addToCart(product)}
                  className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 active:scale-95 transition"
                >
                  Thêm vào giỏ
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
