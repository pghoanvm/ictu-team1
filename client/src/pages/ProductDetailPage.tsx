import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { useCart } from "../context/CartContext";
import type { Product } from "../types/Product";

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  useEffect(() => {
    // Gọi API lấy chi tiết sản phẩm theo ID
    axios
      .get(`https://webvtile.onrender.com/api/products/${id}`)
      .then((res) => {
        setProduct(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      // Thêm sản phẩm với số lượng đã chọn (Loop add nhiều lần hoặc sửa hàm addToCart để nhận quantity)
      // Ở đây mình gọi hàm addToCart cơ bản, bạn có thể nâng cấp Context sau
      for (let i = 0; i < quantity; i++) {
        addToCart(product);
      }
      alert(`Đã thêm ${quantity} sản phẩm vào giỏ!`);
    }
  };

  if (loading) return <div className="text-center py-20">Đang tải...</div>;
  if (!product)
    return <div className="text-center py-20">Không tìm thấy sản phẩm.</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 font-sans">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 mb-8">
        <Link to="/" className="hover:text-black">
          Trang chủ
        </Link>{" "}
        /
        <Link to="/shop" className="hover:text-black ml-1">
          Sản phẩm
        </Link>{" "}
        /<span className="text-black font-bold ml-1">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Cột Trái: Ảnh */}
        <div className="bg-gray-100 aspect-[3/4] rounded-lg overflow-hidden">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover hover:scale-105 transition duration-500"
          />
        </div>

        {/* Cột Phải: Thông tin */}
        <div>
          <h1 className="text-3xl font-black uppercase tracking-wide mb-2">
            {product.name}
          </h1>
          <p className="text-lg text-gray-500 mb-6">{product.category}</p>

          <div className="text-3xl text-red-600 font-black mb-8">
            {product.price.toLocaleString("vi-VN")} đ
          </div>

          <p className="text-gray-600 leading-relaxed mb-8">
            {product.description || "Chưa có mô tả cho sản phẩm này."}
          </p>

          {/* Chọn số lượng */}
          <div className="flex items-center mb-8">
            <span className="font-bold mr-4 uppercase text-sm">Số lượng:</span>
            <div className="flex items-center border border-gray-300">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="px-4 py-2 hover:bg-gray-100 font-bold"
              >
                -
              </button>
              <span className="px-4 py-2 font-bold min-w-[3rem] text-center">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="px-4 py-2 hover:bg-gray-100 font-bold"
              >
                +
              </button>
            </div>
          </div>

          {/* Nút hành động */}
          <div className="flex gap-4">
            <button
              onClick={handleAddToCart}
              className="flex-1 bg-black text-white py-4 font-bold uppercase tracking-widest hover:bg-gray-800 transition"
            >
              Thêm vào giỏ
            </button>
            <button className="w-14 flex items-center justify-center border border-gray-300 hover:bg-gray-100 transition">
              ❤️
            </button>
          </div>

          {/* Cam kết */}
          <div className="mt-10 border-t pt-6 space-y-3 text-sm text-gray-500">
            <p>✅ Miễn phí vận chuyển cho đơn hàng trên 500k</p>
            <p>✅ Đổi trả miễn phí trong vòng 7 ngày</p>
            <p>✅ Cam kết hàng chính hãng 100%</p>
          </div>
        </div>
      </div>
    </div>
  );
}
