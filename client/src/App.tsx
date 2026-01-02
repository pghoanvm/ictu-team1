import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ShopPage from "./pages/ShopPage";
import LoginPage from "./pages/LoginPage";
import CartPage from "./pages/CartPage";
import ChatBot from "./components/ChatBot";
import AdminPage from "./pages/AdminPage";
import { CartProvider, useCart } from "./context/CartContext"; // <--- Import mới

// Tạo một component con cho Menu để hiển thị số lượng giỏ hàng
function Navbar() {
  const { cart } = useCart();
  return (
    <nav className="bg-gray-800 p-4 text-white flex justify-between items-center sticky top-0 z-40">
      <div className="flex gap-4 font-bold">
        <Link to="/" className="hover:text-yellow-400">
          Trang chủ
        </Link>
        <Link to="/shop" className="hover:text-yellow-400">
          Sản phẩm
        </Link>
      </div>
      <div className="flex gap-4 items-center">
        <Link to="/cart" className="relative hover:text-yellow-400">
          🛒 Giỏ hàng
          {cart.length > 0 && (
            <span className="absolute -top-2 -right-3 bg-red-500 text-xs rounded-full px-2 py-0.5">
              {cart.reduce((acc, item) => acc + item.quantity, 0)}
            </span>
          )}
        </Link>
        <Link to="/login" className="hover:text-yellow-400">
          Đăng nhập
        </Link>
      </div>
    </nav>
  );
}

function App() {
  return (
    <CartProvider>
      {" "}
      {/* Bao bọc toàn bộ App */}
      <BrowserRouter>
        <Navbar /> {/* Menu đã tách ra để dùng được hook useCart */}
        <div className="container mx-auto mt-5 p-4">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/shop" element={<ShopPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/admin" element={<AdminPage />} />
          </Routes>
        </div>
        <ChatBot />
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;
