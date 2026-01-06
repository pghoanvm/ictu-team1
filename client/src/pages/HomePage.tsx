import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  description: string;
}

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch("https://webvtile.onrender.com/api/products/newest")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error("Lỗi lấy sản phẩm:", err));
  }, []);

  return (
    <div className="p-8">
      <div className="text-2xl font-bold text-blue-600 mb-6">
        🔥 Quần áo mới nhất
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="border p-4 rounded shadow hover:shadow-lg transition"
          >
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-48 object-cover mb-4 rounded"
            />
            <h3 className="font-bold text-lg">{product.name}</h3>
            <p className="text-red-500 font-bold">
              {product.price.toLocaleString()} đ
            </p>
            <Link
              to={`/product/${product.id}`}
              className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full block text-center"
            >
              Xem chi tiết
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
