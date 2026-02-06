import { useCart } from "../context/CartContext";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  // State form thanh toán
  const [customerInfo, setCustomerInfo] = useState({
    customerName: user?.username || "",
    phone: "",
    address: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalPrice = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert("Vui lòng đăng nhập để đặt hàng!");
      navigate("/login");
      return;
    }

    if (cart.length === 0) return;

    setIsSubmitting(true);
    try {
      // Chuẩn bị dữ liệu gửi xuống Server
      const orderData = {
        customerName: customerInfo.customerName,
        phone: customerInfo.phone,
        address: customerInfo.address,
        totalPrice: totalPrice,
        items: cart.map((item) => ({
          productId: item.id,
          productName: item.name,
          quantity: item.quantity,
          price: item.price,
        })),
      };

      // GỌI API ĐẶT HÀNG
      await axios.post("https://webvtile.onrender.com/api/orders", orderData);

      alert("✅ Đặt hàng thành công! Chúng tôi sẽ sớm liên hệ.");
      clearCart(); // Xóa giỏ hàng
      navigate("/my-orders"); // Chuyển sang trang đơn hàng của tôi
    } catch (error) {
      console.error(error);
      alert("❌ Đặt hàng thất bại. Vui lòng thử lại!");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center font-sans">
        <h2 className="text-2xl font-black uppercase mb-4">Giỏ hàng trống</h2>
        <p className="text-gray-500 mb-8">Bạn chưa chọn sản phẩm nào.</p>
        <Link
          to="/shop"
          className="bg-black text-white px-8 py-3 uppercase font-bold text-sm hover:bg-gray-800 transition"
        >
          Mua sắm ngay
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 font-sans">
      <h1 className="text-3xl font-black uppercase tracking-widest mb-10">
        Giỏ hàng của bạn
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* --- CỘT TRÁI: DANH SÁCH SẢN PHẨM --- */}
        <div className="space-y-6">
          {cart.map((item) => (
            <div key={item.id} className="flex gap-4 border-b pb-6">
              <div className="w-24 h-32 flex-shrink-0 bg-gray-100 overflow-hidden">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-lg uppercase">{item.name}</h3>
                  <p className="text-sm text-gray-500">{item.category}</p>
                  <p className="mt-1 font-medium">
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(item.price)}
                  </p>
                </div>
                <div className="flex justify-between items-center mt-4">
                  <div className="flex items-center border border-gray-300">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="px-3 py-1 hover:bg-gray-100"
                    >
                      -
                    </button>
                    <span className="px-3 py-1 text-sm font-bold">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="px-3 py-1 hover:bg-gray-100"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-xs text-red-500 font-bold uppercase hover:underline"
                  >
                    Xóa
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* --- CỘT PHẢI: FORM THANH TOÁN --- */}
        <div className="bg-gray-50 p-8 h-fit">
          <h2 className="text-xl font-bold uppercase mb-6 border-b pb-2">
            Thông tin giao hàng
          </h2>
          <form onSubmit={handleCheckout} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase mb-1">
                Họ và tên
              </label>
              <input
                required
                type="text"
                className="w-full p-3 border border-gray-300 focus:outline-none focus:border-black text-sm"
                placeholder="Nhập họ tên..."
                value={customerInfo.customerName}
                onChange={(e) =>
                  setCustomerInfo({
                    ...customerInfo,
                    customerName: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase mb-1">
                Số điện thoại
              </label>
              <input
                required
                type="tel"
                className="w-full p-3 border border-gray-300 focus:outline-none focus:border-black text-sm"
                placeholder="Nhập số điện thoại..."
                value={customerInfo.phone}
                onChange={(e) =>
                  setCustomerInfo({ ...customerInfo, phone: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase mb-1">
                Địa chỉ nhận hàng
              </label>
              <textarea
                required
                rows={3}
                className="w-full p-3 border border-gray-300 focus:outline-none focus:border-black text-sm"
                placeholder="Số nhà, đường, phường/xã..."
                value={customerInfo.address}
                onChange={(e) =>
                  setCustomerInfo({ ...customerInfo, address: e.target.value })
                }
              ></textarea>
            </div>

            <div className="border-t pt-4 mt-6">
              <div className="flex justify-between text-lg font-black uppercase mb-6">
                <span>Tổng cộng:</span>
                <span>
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(totalPrice)}
                </span>
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-black text-white py-4 font-bold uppercase tracking-widest hover:bg-gray-800 transition disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Đang xử lý..." : "Đặt hàng ngay"}
              </button>
              <p className="text-center text-xs text-gray-500 mt-4">
                Thanh toán khi nhận hàng (COD). Miễn phí vận chuyển.
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
