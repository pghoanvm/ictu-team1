import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import type { Product } from "../types/Product";

export default function ShopPage() {
  // 1. Khởi tạo là mảng rỗng [] để tránh lỗi ban đầu
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(0);

  const productListRef = useRef<HTMLDivElement | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();

  const currentPage = parseInt(searchParams.get("page") || "0");
  const currentSearch = searchParams.get("search") || "";
  const currentCategory = searchParams.get("category") || null;
  const currentSort = searchParams.get("sort") || "desc";

  // 2. GỌI API
  useEffect(() => {
    setLoading(true);
    axios
      .get("https://webvtile.onrender.com/api/products", {
        params: {
          page: currentPage,
          limit: 8,
          search: currentSearch,
          category: currentCategory,
          sort: currentSort,
        },
      })
      .then((res) => {
        // --- LOG DATA ĐỂ KIỂM TRA (F12 -> Console) ---
        console.log("Dữ liệu API trả về:", res.data);

        // --- SỬA LỖI Ở ĐÂY: Kiểm tra kỹ trước khi set ---
        if (res.data && Array.isArray(res.data.products)) {
          setProducts(res.data.products);
          setTotalPages(res.data.totalPages || 0);
        } else if (Array.isArray(res.data)) {
          // Trường hợp API cũ trả về mảng trực tiếp
          setProducts(res.data);
          setTotalPages(1);
        } else {
          console.warn("API trả về sai cấu trúc:", res.data);
          setProducts([]); // Set về rỗng nếu lỗi
        }

        setLoading(false);

        if (currentPage > 0 && productListRef.current) {
          productListRef.current.scrollIntoView({ behavior: "smooth" });
        }
      })
      .catch((err) => {
        console.error("Lỗi lấy sản phẩm:", err);
        setProducts([]); // Nếu lỗi mạng, set rỗng để không crash web
        setLoading(false);
      });
  }, [currentPage, currentSearch, currentCategory, currentSort]);

  // 3. XỬ LÝ SỰ KIỆN
  const handleSelectCategory = (cat: string | null) => {
    const newParams: Record<string, string> = {
      page: "0",
      sort: currentSort,
    };
    if (cat) newParams.category = cat;
    if (currentSearch) newParams.search = currentSearch;
    setSearchParams(newParams);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < totalPages) {
      const params: Record<string, string> = {
        page: newPage.toString(),
        sort: currentSort,
      };
      if (currentSearch) params.search = currentSearch;
      if (currentCategory) params.category = currentCategory;
      setSearchParams(params);
    }
  };

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

  return (
    <div className="container mx-auto px-4 py-8 font-sans">
      {/* DANH MỤC */}
      <div className="max-w-7xl mx-auto mb-12">
        <h2 className="text-2xl font-bold uppercase text-center mb-8 tracking-wide">
          Danh Mục Sản Phẩm
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((cat, index) => (
            <div
              key={index}
              onClick={() => handleSelectCategory(cat.name)}
              className={`relative group overflow-hidden cursor-pointer h-40 md:h-64 rounded-lg shadow-md transition-all ${
                currentCategory === cat.name ? "ring-4 ring-black" : ""
              }`}
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div
                className={`absolute inset-0 transition ${currentCategory === cat.name ? "bg-black/10" : "bg-black/30 group-hover:bg-black/40"}`}
              ></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="bg-white px-4 py-2 uppercase font-bold text-xs md:text-sm tracking-wider shadow-lg">
                  {cat.name}
                </span>
              </div>
            </div>
          ))}
        </div>
        {currentCategory && (
          <div className="text-center mt-6">
            <button
              onClick={() => handleSelectCategory(null)}
              className="px-6 py-2 bg-gray-100 text-gray-600 font-bold rounded-full hover:bg-gray-200 transition text-sm"
            >
              ✕ Bỏ lọc: {currentCategory}
            </button>
          </div>
        )}
      </div>

      {/* HEADER & SORT */}
      <div
        ref={productListRef}
        className="flex flex-col md:flex-row justify-between items-center mb-8 border-b pb-4"
      >
        <h1 className="text-2xl font-black uppercase tracking-widest text-gray-800">
          {currentCategory
            ? currentCategory
            : currentSearch
              ? `Tìm kiếm: "${currentSearch}"`
              : "Tất cả sản phẩm"}
        </h1>
        <select
          value={currentSort}
          onChange={(e) => {
            const params: Record<string, string> = {
              page: "0",
              sort: e.target.value,
            };
            if (currentSearch) params.search = currentSearch;
            if (currentCategory) params.category = currentCategory;
            setSearchParams(params);
          }}
          className="mt-4 md:mt-0 border border-gray-300 p-2 rounded text-sm font-bold uppercase focus:ring-2 focus:ring-black outline-none"
        >
          <option value="desc">Mới nhất</option>
          <option value="asc">Cũ nhất</option>
        </select>
      </div>

      {/* DANH SÁCH SẢN PHẨM */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 aspect-[3/4] rounded-lg mb-2"></div>
              <div className="h-4 bg-gray-200 w-3/4 mb-1"></div>
              <div className="h-4 bg-gray-200 w-1/2"></div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {/* --- SỬA LỖI Ở ĐÂY: Thêm dấu ? để không crash nếu null --- */}
          {products?.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-gray-50 rounded-lg">
              <p className="text-xl text-gray-500 font-medium">
                Không tìm thấy sản phẩm nào.
              </p>
              <button
                onClick={() => setSearchParams({})}
                className="mt-4 text-black underline hover:text-red-600 font-bold"
              >
                Xem tất cả sản phẩm
              </button>
            </div>
          )}
        </>
      )}

      {/* PHÂN TRANG */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-16">
          <button
            disabled={currentPage === 0}
            onClick={() => handlePageChange(currentPage - 1)}
            className="px-4 py-2 border border-gray-300 hover:bg-black hover:text-white disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-black transition uppercase font-bold text-xs"
          >
            ← Trước
          </button>
          <span className="text-sm font-bold">
            Trang {currentPage + 1} / {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages - 1}
            onClick={() => handlePageChange(currentPage + 1)}
            className="px-4 py-2 border border-gray-300 hover:bg-black hover:text-white disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-black transition uppercase font-bold text-xs"
          >
            Sau →
          </button>
        </div>
      )}
    </div>
  );
}
