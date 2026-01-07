import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Navbar />

          {/* QUAN TRỌNG: Dùng min-h-screen và bỏ container để web tràn viền */}
          <div className="min-h-screen bg-white">
            <Routes>
              <Route path="/" element={<HomePage />} />

              {/* Các trang con cần khung thì bọc container riêng bên trong chúng, hoặc để tự do */}
              <Route
                path="/shop"
                element={
                  <div className="container mx-auto p-4">
                    <ShopPage />
                  </div>
                }
              />
              <Route
                path="/cart"
                element={
                  <div className="container mx-auto p-4">
                    <CartPage />
                  </div>
                }
              />
              <Route
                path="/login"
                element={
                  <div className="container mx-auto p-4">
                    <LoginPage />
                  </div>
                }
              />
              <Route
                path="/register"
                element={
                  <div className="container mx-auto p-4">
                    <RegisterPage />
                  </div>
                }
              />
              <Route
                path="/forgot-password"
                element={
                  <div className="container mx-auto p-4">
                    <ForgotPasswordPage />
                  </div>
                }
              />

              <Route
                path="/my-orders"
                element={
                  <div className="container mx-auto p-4">
                    <MyOrdersPage />
                  </div>
                }
              />
              <Route
                path="/admin"
                element={
                  <div className="container mx-auto p-4">
                    <AdminPage />
                  </div>
                }
              />
              <Route
                path="/admin/edit/:id"
                element={
                  <div className="container mx-auto p-4">
                    <EditProductPage />
                  </div>
                }
              />

              {/* Trang chi tiết sản phẩm cũng nên có container cho đẹp */}
              <Route
                path="/product/:id"
                element={
                  <div className="container mx-auto p-4">
                    <ProductDetailPage />
                  </div>
                }
              />
            </Routes>
          </div>

          <Footer />
          <ChatBot />
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
