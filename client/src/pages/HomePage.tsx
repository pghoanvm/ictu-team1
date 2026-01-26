import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";

interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  description: string;
  category: string;
}

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    // Gọi API lấy sản phẩm
    axios
      .get("https://webvtile.onrender.com/api/products/newest")
      .then((res) => setProducts(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="font-sans">
      {/* 1. HERO BANNER */}
      <div className="w-full relative mb-12">
        <img
          src="https://vj-prod-website-cms.s3.ap-southeast-1.amazonaws.com/y1-1715921161692.jpg"
          alt="Banner"
          className="w-full object-cover min-h-[300px] md:h-auto"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white bg-black/20">
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-widest mb-4 drop-shadow-md">
            BST THU ĐÔNG 2025
          </h1>
          <Link
            to="/collection"
            className="bg-white text-black px-8 py-3 uppercase font-bold text-sm hover:bg-black hover:text-white transition"
          >
            Xem ngay
          </Link>
        </div>
      </div>

      {/* 2. DANH SÁCH SẢN PHẨM MỚI */}
      <div className="max-w-7xl mx-auto px-4 mb-12">
        <div className="flex justify-between items-end mb-6 border-b pb-4">
          <h2 className="text-2xl font-bold uppercase tracking-wide">
            <span className="text-red-600">🔥</span> Sản phẩm mới về
          </h2>
          <Link
            to="/shop"
            className="text-sm font-bold text-gray-500 hover:text-black uppercase"
          >
            Xem tất cả &rarr;
          </Link>
        </div>

        {/* Lưới sản phẩm */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>

      {/* 4. ẢNH BANNER PHỤ */}
      <div className="w-full mb-16 overflow-hidden">
        <img
          //src="https://theme.hstatic.net/1000333436/1001040510/14/banner_collection_1.jpg?v=680"
          //alt="Banner phụ"
          className="w-full object-cover hover:scale-105 transition duration-1000"
        />
      </div>
    </div>
  );
}
