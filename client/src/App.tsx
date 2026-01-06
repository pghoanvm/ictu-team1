import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ShopPage from "./pages/ShopPage";
import LoginPage from "./pages/LoginPage";
import CartPage from "./pages/CartPage";
import ChatBot from "./components/ChatBot";
import AdminPage from "./pages/AdminPage";
import RegisterPage from "./pages/RegisterPage";
import MyOrdersPage from "./pages/MyOrdersPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import EditProductPage from "./pages/EditProductPage";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { CartProvider, useCart } from "./context/CartContext";

// Tạo một component con cho Menu để hiển thị số lượng giỏ hàng
function Navbar() {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  return (
    <nav className="bg-gray-800 p-4 text-white flex justify-between items-center sticky top-0 z-40">
      <div className="flex gap-4 font-bold">
        {user && (
          <Link
            to="/my-orders"
            className="mr-4 font-bold text-blue-600 hover:text-blue-800"
          >
            📦 Đơn hàng của tôi
          </Link>
        )}
        {user?.role === "ADMIN" && (
          <Link to="/admin" className="font-bold text-red-500">
            Quản trị viên
          </Link>
        )}
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
          {user ? (
            <div className="flex items-center gap-2">
              <span className="text-yellow-400 font-bold">
                Xin chào, {user.username}
              </span>
              <button
                onClick={logout}
                className="text-xs bg-red-600 px-2 py-1 rounded"
              >
                Thoát
              </button>
            </div>
          ) : (
            <Link to="/login" className="...">
              Đăng nhập
            </Link>
          )}
        </Link>
      </div>
    </nav>
  );
}

function App() {
  return (
    <AuthProvider>
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
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/my-orders" element={<MyOrdersPage />} />
              <Route path="/product/:id" element={<ProductDetailPage />} />
              <Route path="/admin/edit/:id" element={<EditProductPage />} />
            </Routes>
          </div>
          <ChatBot />
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
