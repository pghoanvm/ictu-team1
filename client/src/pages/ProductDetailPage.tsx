import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  category: string;
}

export default function ProductDetailPage() {
  const { id } = useParams(); // Lấy ID từ đường dẫn (ví dụ: /product/123)
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    // Gọi API lấy chi tiết 1 sản phẩm theo ID
    fetch(`https://webvtile.onrender.com/api/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  if (loading)
    return <div className="p-10 text-center">Đang tải sản phẩm...</div>;
  if (!product)
    return (
      <div className="p-10 text-center text-red-500">
        Không tìm thấy sản phẩm!
      </div>
    );

  return (
    <div className="container mx-auto p-4">
      <div className="p-8 max-w-6xl mx-auto">
        {/* Nút quay lại */}
        <Link
          to="/"
          className="text-blue-500 hover:underline mb-4 inline-block"
        >
          &larr; Quay lại trang chủ
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-4">
          {/* Cột Trái: Ảnh sản phẩm */}
          <div className="border rounded-lg overflow-hidden shadow-lg">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-96 object-cover"
            />
          </div>

          {/* Cột Phải: Thông tin chi tiết */}
          <div>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <p className="text-gray-500 mb-4">Danh mục: {product.category}</p>

            <div className="text-3xl text-red-600 font-bold mb-6">
              {product.price.toLocaleString()} đ
            </div>

            <p className="text-gray-700 leading-relaxed mb-8">
              {product.description || "Chưa có mô tả cho sản phẩm này."}
            </p>

            {/* Các nút bấm */}
            <div className="flex gap-4">
              <button
                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 transition"
                onClick={() => addToCart(product)}
              >
                Thêm vào giỏ
              </button>
              <button className="bg-gray-200 text-black px-8 py-3 rounded-lg font-bold hover:bg-gray-300 transition">
                Mua ngay
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
