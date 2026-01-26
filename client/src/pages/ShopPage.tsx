import { useEffect, useState, useRef } from "react"; // 1. Đã thêm useRef
import axios from "axios";
import { useSearchParams } from "react-router-dom"; // 2. Đã thêm import này
import type { Product } from "../types/Product";
import { useCart } from "../context/CartContext";

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const productListRef = useRef<HTMLHeadingElement | null>(null);

  // URL PAGE
  const [searchParams, setSearchParams] = useSearchParams();

  // Logic lấy page từ URL an toàn hơn
  const pageFromUrl = Number(searchParams.get("page"));
  const initialPage = pageFromUrl > 0 ? pageFromUrl : 1;

  const searchKeyword = searchParams.get("search")?.toLowerCase() || "";
  const [currentPage, setCurrentPage] = useState(initialPage);
  const PRODUCTS_PER_PAGE = 6;

  const { addToCart } = useCart();

  // FETCH PRODUCTS
  useEffect(() => {
    axios
      .get("https://webvtile.onrender.com/api/products")
      .then((res) => setProducts(res.data))
      .catch((err) => console.error("Lỗi lấy sản phẩm:", err));
  }, []);

  // SYNC PAGE -> URL
  useEffect(() => {
    // Chỉ cập nhật URL nếu giá trị thay đổi để tránh lặp vô tận
    const params: any = { page: currentPage.toString() };
    if (searchKeyword) params.search = searchKeyword;

    setSearchParams(params);
  }, [currentPage, searchKeyword, setSearchParams]);

  // SCROLL TOP KHI ĐỔI TRANG
  useEffect(() => {
    if (productListRef.current) {
      // Chỉ scroll khi ref đã tồn tại
      // productListRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [currentPage]);

  // FILTER CATEGORY & SEARCH
  const filteredProducts = products.filter((p) => {
    // So sánh Category không phân biệt hoa thường để chính xác hơn
    const matchCategory = selectedCategory
      ? p.category?.toLowerCase() === selectedCategory.toLowerCase() // Thêm ?. và toLowerCase
      : true;

    const matchKeyword = searchKeyword
      ? p.name.toLowerCase().includes(searchKeyword)
      : true;

    return matchCategory && matchKeyword;
  });

  // Reset về trang 1 khi đổi bộ lọc
  useEffect(() => {
    setCurrentPage(1);
  }, [searchKeyword, selectedCategory]);

  // PAGINATION LOGIC
  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const paginatedProducts = filteredProducts.slice(
    startIndex,
    startIndex + PRODUCTS_PER_PAGE,
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
    // Khi chọn danh mục, không cần set URL page ngay vì useEffect sẽ tự làm
    setCurrentPage(1);

    // Scroll xuống danh sách sản phẩm cho trải nghiệm tốt hơn
    setTimeout(() => {
      productListRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  return (
    <div className="container mx-auto p-4 font-sans">
      <div className="py-8">
        {/* ===== DANH MỤC ===== */}
        <div className="max-w-7xl mx-auto px-4 mb-16">
          <h2 className="text-2xl font-bold uppercase text-center mb-8 tracking-wide">
            Danh Mục Sản Phẩm
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((cat, index) => (
              <div
                key={index}
                className={`relative group overflow-hidden cursor-pointer h-64 md:h-80 rounded-lg shadow-md transition-all ${
                  selectedCategory === cat.name ? "ring-4 ring-black" : ""
                }`}
                onClick={() => handleSelectCategory(cat.name)}
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div
                  className={`absolute inset-0 transition ${selectedCategory === cat.name ? "bg-black/10" : "bg-black/20 group-hover:bg-black/40"}`}
                ></div>
                <div className="absolute bottom-4 left-0 right-0 text-center">
                  <span className="bg-white px-6 py-2 uppercase font-bold text-sm tracking-wider shadow-lg">
                    {cat.name}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Nút Hủy lọc */}
          {selectedCategory && (
            <div className="text-center mt-6 animate-fade-in-up">
              <button
                onClick={() => handleSelectCategory(null)}
                className="px-6 py-2 bg-red-100 text-red-600 font-bold rounded hover:bg-red-200 transition"
              >
                ✕ Bỏ lọc: {selectedCategory}
              </button>
            </div>
          )}
        </div>

        {/* ===== DANH SÁCH ===== */}
        <h1
          ref={productListRef}
          className="text-3xl font-bold mb-6 text-center text-gray-800"
        >
          {selectedCategory
            ? `Sản phẩm: ${selectedCategory}`
            : searchKeyword
              ? `Kết quả tìm kiếm: "${searchKeyword}"`
              : "Tất cả sản phẩm"}
        </h1>

        {paginatedProducts.length === 0 ? (
          <div className="text-center text-gray-500 py-10 italic">
            Không tìm thấy sản phẩm nào.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {paginatedProducts.map((product) => (
              <div
                key={product.id}
                className="group border border-gray-100 rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300"
              >
                <div className="relative h-72 overflow-hidden">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition duration-500"
                  />
                  {/* Badge Sale giả lập nếu muốn */}
                  <div className="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
                    HOT
                  </div>
                </div>

                <div className="p-5">
                  <h2
                    className="text-lg font-bold text-gray-800 truncate"
                    title={product.name}
                  >
                    {product.name}
                  </h2>
                  <p className="text-sm text-gray-500 mb-4">
                    {product.category || "Thời trang"}
                  </p>

                  <div className="flex justify-between items-center">
                    <span className="text-red-600 font-black text-xl">
                      {product.price.toLocaleString("vi-VN")} đ
                    </span>

                    <button
                      onClick={() => addToCart(product)}
                      className="bg-black text-white px-4 py-2 rounded-lg font-bold hover:bg-gray-800 active:scale-95 transition flex items-center gap-2"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>
                      Thêm
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ===== PHÂN TRANG ===== */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-12">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="px-4 py-2 bg-white border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              ← Trước
            </button>

            {Array.from({ length: totalPages }).map((_, i) => {
              const page = i + 1;
              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-4 py-2 rounded font-bold transition ${
                    currentPage === page
                      ? "bg-black text-white shadow-lg transform scale-105"
                      : "bg-white border border-gray-300 hover:bg-gray-100 text-gray-700"
                  }`}
                >
                  {page}
                </button>
              );
            })}

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="px-4 py-2 bg-white border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Sau →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
