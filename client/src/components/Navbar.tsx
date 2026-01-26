import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const { user, logout } = useAuth(); // Lấy thông tin user
  const { cart } = useCart(); // Lấy giỏ hàng để hiện số lượng
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [showSearch, setShowSearch] = useState(false);
  const [keyword, setKeyword] = useState("");
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  // Tính tổng số lượng sản phẩm trong giỏ
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <nav className="bg-white border-b sticky top-0 z-50 font-sans">
      {/* 1. THANH THÔNG BÁO ĐEN TRÊN CÙNG (Top Bar) */}
      <div className="bg-black text-white text-[11px] md:text-xs text-center py-2 font-bold uppercase tracking-wider">
        Miễn phí vận chuyển cho đơn hàng trên 500k - Đổi trả trong 7 ngày
      </div>

      {/* 2. KHUNG NAVBAR CHÍNH */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* --- LOGO --- */}
          <div className="flex-shrink-0 flex items-center">
            {/* Nút Menu Mobile (Hamburger) - Chỉ hiện trên điện thoại */}
            <button
              className="md:hidden p-2 mr-2 text-gray-600"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>

            <Link
              to="/"
              className="text-3xl font-black tracking-widest uppercase text-black"
            >
              TEAM I
            </Link>
          </div>

          {/* --- MENU CHÍNH (Giữa - Ẩn trên mobile) --- */}
          <div className="hidden md:flex space-x-8 text-sm font-bold uppercase text-gray-800 tracking-wide">
            <Link
              to="/"
              className="hover:text-red-600 transition-colors duration-300 relative group"
            >
              Trang chủ
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-600 transition-all group-hover:w-full"></span>
            </Link>
            <Link
              to="/shop"
              className="hover:text-red-600 transition-colors duration-300 relative group"
            >
              Sản phẩm
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-600 transition-all group-hover:w-full"></span>
            </Link>
            <Link
              to="/collection"
              className="hover:text-red-600 transition-colors duration-300 relative group"
            >
              Bộ sưu tập
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-600 transition-all group-hover:w-full"></span>
            </Link>
            <Link
              to="/about"
              className="hover:text-red-600 transition-colors duration-300 relative group"
            >
              Về chúng tôi
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-600 transition-all group-hover:w-full"></span>
            </Link>
          </div>

          {/* --- ICON BÊN PHẢI (Tìm kiếm, User, Giỏ hàng) --- */}
          <div className="flex items-center space-x-4 md:space-x-6">
            {/* 1. Icon Tìm kiếm */}
            <div className="relative flex items-center">
              <input
                ref={inputRef}
                type="text"
                placeholder="Tìm sản phẩm theo tên..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && keyword.trim()) {
                    navigate(
                      `/shop?search=${encodeURIComponent(keyword)}&page=1`,
                    );
                    setShowSearch(false);
                  }
                }}
                className={`mr-2 px-3 py-1.5 border rounded-full text-sm transition-all duration-300
              focus:outline-none focus:ring-2 focus:ring-black
              ${showSearch ? "w-56 opacity-100" : "w-0 opacity-0 pointer-events-none"}
            `}
              />
              {/* ICON SEARCH */}
              <button
                onClick={() => {
                  setShowSearch((prev) => !prev);
                  setTimeout(() => inputRef.current?.focus(), 200);
                }}
                className="text-gray-600 hover:text-black transition z-10"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>
            </div>

            {/* 2. Icon User (Có Dropdown) */}
            <div className="relative group z-10">
              <Link
                to={user ? "/my-orders" : "/login"}
                className="text-gray-600 hover:text-black flex items-center gap-1 transition"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </Link>

              {/* Menu con khi rê chuột vào User */}
              {user && (
                <div className="absolute right-0 top-full mt-0 pt-2 hidden group-hover:block w-48">
                  <div className="bg-white border shadow-xl rounded-md overflow-hidden py-2 animate-fade-in-up">
                    <div className="px-4 py-2 border-b bg-gray-50 text-xs text-gray-500 font-bold uppercase">
                      Xin chào, {user.username}
                    </div>
                    {user.role === "ADMIN" && (
                      <Link
                        to="/admin"
                        className="block px-4 py-2 hover:bg-gray-100 text-sm text-red-600 font-bold"
                      >
                        ⚙️ Trang Quản Trị
                      </Link>
                    )}
                    <Link
                      to="/my-orders"
                      className="block px-4 py-2 hover:bg-gray-100 text-sm"
                    >
                      📦 Đơn hàng của tôi
                    </Link>
                    <button
                      onClick={logout}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm text-gray-600"
                    >
                      Đăng xuất
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* 3. Icon Giỏ hàng (Có số lượng) */}
            <Link
              to="/cart"
              className="relative text-gray-600 hover:text-black transition group"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 transform group-hover:scale-110 transition"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>

              {/* Badge số lượng */}
              {totalItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-red-600 text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full border-2 border-white">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>

      {/* 3. MENU MOBILE (Hiện khi bấm nút Hamburger) */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t p-4 space-y-4 shadow-lg absolute w-full left-0 z-40">
          <Link
            to="/"
            className="block font-bold uppercase text-gray-800"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Trang chủ
          </Link>
          <Link
            to="/shop"
            className="block font-bold uppercase text-gray-800"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Sản phẩm
          </Link>
          <div className="border-t pt-2">
            {!user ? (
              <Link to="/login" className="block text-blue-600 py-2">
                Đăng nhập
              </Link>
            ) : (
              <>
                <Link to="/my-orders" className="block py-2">
                  Đơn hàng của tôi
                </Link>
                {user.role === "ADMIN" && (
                  <Link
                    to="/admin"
                    className="block py-2 text-red-600 font-bold"
                  >
                    Quản trị viên
                  </Link>
                )}
                <button onClick={logout} className="block py-2 text-gray-500">
                  Đăng xuất
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
