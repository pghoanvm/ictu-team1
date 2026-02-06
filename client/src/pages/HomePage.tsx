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
    // Giữ nguyên API của bạn
    axios
      .get("https://webvtile.onrender.com/api/products/newest")
      .then((res) => setProducts(res.data))
      .catch((err) => console.error(err));
  }, []);

  // Danh sách danh mục giữ nguyên link ảnh của bạn
  const categories = [
    {
      name: "Áo Khoác",
      image:
        "https://aothudong.com/upload/product/atd-129/ao-khoac-kaki-lot-long-nam-tinh.jpg",
    },
    {
      name: "Quần Dài",
      image:
        "https://product.hstatic.net/200000690725/product/avt_web_1150_x_1475_px__9a19ababcc044b6890e913a22fe32c22_master.png",
    },
    {
      name: "Áo Len",
      image:
        "https://4menshop.com/images/thumbs/2022/03/ao-len-co-tron-bo-soc-al005-mau-nau-16418.JPG",
    },
    {
      name: "Phụ Kiện",
      image:
        "https://cdn.hstatic.net/products/200000690725/al011_63e4d647752348dfb69f2538e4e13982_master.png",
    },
  ];

  return (
    <div className="font-sans text-gray-900 bg-white">
      {/* 1. HERO BANNER - Full Screen Impact */}
      <div className="relative w-full h-[60vh] md:h-[85vh] mb-20 overflow-hidden">
        <img
          src="https://5.pik.vn/c43ae84914d62d566009da1cf414f89c2fa48b317e0c317f6b2bd51964550738.webp"
          alt="BST Thu Đông 2025"
          className="absolute inset-0 w-full h-full object-cover object-center animate-fade-in"
        />
        {/* Lớp phủ đen mờ để chữ dễ đọc hơn */}
        <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center text-white text-center px-4">
          <p className="text-sm md:text-lg font-bold uppercase tracking-[0.2em] mb-4">
            New Collection
          </p>
          <h1 className="text-4xl md:text-7xl font-black uppercase tracking-widest mb-8 drop-shadow-2xl">
            BST THU ĐÔNG 2025
          </h1>
          <Link
            to="/collection"
            className="group relative bg-white text-black px-10 py-4 font-bold uppercase text-sm tracking-wider hover:bg-black hover:text-white transition-all duration-300"
          >
            Xem Ngay
            {/* Hiệu ứng gạch chân khi hover */}
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-black group-hover:bg-white transition-all"></span>
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 2. DANH MỤC SẢN PHẨM - Grid Layout */}
        <div className="mb-24">
          <h2 className="text-3xl font-black uppercase text-center mb-12 tracking-widest">
            Danh Mục Nổi Bật
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat, index) => (
              <Link
                key={index}
                to="/shop"
                className="group relative h-[400px] overflow-hidden cursor-pointer"
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                {/* Lớp phủ khi hover */}
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300"></div>

                {/* Tên danh mục */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-white text-xl font-bold uppercase tracking-widest border-2 border-white px-6 py-2 group-hover:bg-white group-hover:text-black transition-all duration-300">
                    {cat.name}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* 3. DANH SÁCH SẢN PHẨM MỚI */}
        <div className="mb-24">
          <div className="flex flex-col md:flex-row justify-between items-end mb-10 border-b border-gray-200 pb-4">
            <div>
              <h2 className="text-3xl font-black uppercase tracking-widest mb-2">
                Sản phẩm mới
              </h2>
              <p className="text-gray-500 text-sm">
                Cập nhật xu hướng thời trang mới nhất
              </p>
            </div>
            <Link
              to="/shop"
              className="text-sm font-bold uppercase border-b-2 border-black pb-1 hover:text-gray-600 hover:border-gray-600 transition mt-4 md:mt-0"
            >
              Xem tất cả &rarr;
            </Link>
          </div>

          {/* Lưới sản phẩm */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
            {products.length > 0
              ? products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))
              : // Loading Skeleton đơn giản
                [1, 2, 3, 4].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-gray-200 aspect-[3/4] mb-4"></div>
                    <div className="h-4 bg-gray-200 w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 w-1/2"></div>
                  </div>
                ))}
          </div>
        </div>
      </div>
    </div>
  );
}
