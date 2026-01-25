import { useEffect, useState } from "react";
import { useRef } from "react"
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import type { Product } from "../types/Product";
import { useCart } from "../context/CartContext";

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const productListRef = useRef<HTMLHeadingElement | null>(null);
  // URL PAGE
  const [searchParams, setSearchParams] = useSearchParams();
  const pageFromUrl = Number(searchParams.get("page")) || 1;

  const searchKeyword = searchParams.get("search")?.toLowerCase() || "";
  const [currentPage, setCurrentPage] = useState(pageFromUrl);
  const PRODUCTS_PER_PAGE = 6;

  const { addToCart } = useCart();

  // FETCH PRODUCTS
  useEffect(() => {
    axios
      .get("https://webvtile.onrender.com/api/products")
      .then((res) => setProducts(res.data));
  }, []);

  // SYNC PAGE -> URL + SCROLL TOP
  useEffect(() => {
  setSearchParams({
  page: currentPage.toString(),
  ...(searchKeyword && { search: searchKeyword }),
});

  productListRef.current?.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
}, [currentPage, setSearchParams]);


  // FILTER CATEGORY
  const filteredProducts = products.filter((p) => {
  const matchCategory = selectedCategory
    ? p.category === selectedCategory
    : true;

  const matchKeyword = searchKeyword
    ? p.name.toLowerCase().includes(searchKeyword)
    : true;

  return matchCategory && matchKeyword;
});
useEffect(() => {
  setCurrentPage(1);
}, [searchKeyword]);


  // PAGINATION LOGIC
  const totalPages = Math.ceil(
    filteredProducts.length / PRODUCTS_PER_PAGE
  );

  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const paginatedProducts = filteredProducts.slice(
    startIndex,
    startIndex + PRODUCTS_PER_PAGE
  );

  const categories = [
    {
      name: "Áo Khoác",
      image:
        "https://aothudong.com/upload/product/atd-129/ao-khoac-kaki-lot-long-nam-tinh.jpg",
    },
    {
      name: "Quần dài",
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

 const handleSelectCategory = (cat: string | null) => { 
  setSelectedCategory(cat);
  setCurrentPage(1);
  setSearchParams({ page: "1" }); 
   productListRef.current?.scrollIntoView({ behavior: "smooth" }); };

  return (
    <div className="container mx-auto p-4">
      <div className="p-8">
        {/* ===== DANH MỤC ===== */}
        <div className="max-w-7xl mx-auto px-4 mb-16">
          <h2 className="text-2xl font-bold uppercase text-center mb-8 tracking-wide">
            Danh Mục Sản Phẩm
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((cat, index) => (
              <div
                key={index}
                className="relative group overflow-hidden cursor-pointer h-64 md:h-80"
                onClick={() => handleSelectCategory(cat.name)}
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition"></div>
                <div className="absolute bottom-4 left-0 right-0 text-center">
                  <span className="bg-white px-6 py-2 uppercase font-bold text-sm tracking-wider">
                    {cat.name}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* QUAY LẠI */}
          {selectedCategory && (
            <div className="text-center mt-6">
              <button
                onClick={() => handleSelectCategory(null)}
                className="px-6 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Xem tất cả
              </button>
            </div>
          )}
        </div>

        {/* ===== DANH SÁCH ===== */}
        <h1  ref={productListRef}
            className="text-3xl font-bold mb-6 text-center">
          {selectedCategory
            ? `Sản phẩm: ${selectedCategory}`
            : "Danh sách sản phẩm"}
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {paginatedProducts.map((product) => (
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

        {/* ===== PHÂN TRANG ===== */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-10">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="px-3 py-2 bg-gray-100 rounded disabled:opacity-50"
            >
              ‹
            </button>

            {Array.from({ length: totalPages }).map((_, i) => {
              const page = i + 1;
              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-4 py-2 rounded ${
                    currentPage === page
                      ? "bg-black text-white"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  {page}
                </button>
              );
            })}

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="px-3 py-2 bg-gray-100 rounded disabled:opacity-50"
            >
              ›
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
