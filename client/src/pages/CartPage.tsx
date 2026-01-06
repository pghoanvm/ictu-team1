import { useState } from "react";
import { useCart } from "../context/CartContext";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

// 1. IMPORT CÁI NÀY ĐỂ LẤY THÔNG TIN USER
import { useAuth } from "../context/AuthContext";

export default function CartPage() {
  const { cart, removeFromCart, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();

  // 2. LẤY USER TỪ CONTEXT
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleOrder = async () => {
    // 3. KIỂM TRA ĐĂNG NHẬP (Bắt buộc phải đăng nhập mới gán được đơn hàng)
    if (!user) {
      alert("Bạn cần đăng nhập để thực hiện đặt hàng!");
      navigate("/login"); // Chuyển hướng sang trang login (nếu bạn có)
      return;
    }

    if (!formData.name || !formData.phone || !formData.address) {
      alert("Vui lòng điền đầy đủ thông tin nhận hàng!");
      return;
    }

    try {
      await axios.post("https://webvtile.onrender.com/api/orders", {
        customerName: formData.name,
        phone: formData.phone,
        address: formData.address,
        totalPrice: totalPrice,
        items: cart,

        // 4. QUAN TRỌNG NHẤT: GỬI KÈM USERNAME
        username: user.username,
      });

      alert("🎉 Đặt hàng thành công! Shop sẽ sớm liên hệ bạn.");
      clearCart();
      navigate("/");
    } catch (error) {
      alert("Lỗi đặt hàng. Vui lòng thử lại!");
      console.error(error);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h2 className="text-2xl font-bold text-gray-600">
          Giỏ hàng trống trơn! 😭
        </h2>
        <Link to="/" className="mt-4 text-blue-600 hover:underline">
          ← Đi mua sắm ngay
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-8 grid grid-cols-1 md:grid-cols-2 gap-10">
      {/* CỘT TRÁI: DANH SÁCH HÀNG */}
      <div>
        <h2 className="text-2xl font-bold mb-4">1. Giỏ hàng của bạn</h2>
        <div className="space-y-4">
          {cart.map((item) => (
            <div
              key={item.id}
              className="flex gap-4 bg-white p-4 rounded border shadow-sm"
            >
              <img
                src={item.imageUrl}
                alt={item.name}
                className="w-20 h-20 object-cover rounded"
              />
              <div className="flex-1">
                <h3 className="font-bold">{item.name}</h3>
                <p className="text-red-500">
                  {item.price.toLocaleString("vi-VN")} đ
                </p>
                <p className="text-sm text-gray-500">
                  Số lượng: {item.quantity}
                </p>
              </div>
              <button
                onClick={() => removeFromCart(item.id)}
                className="text-gray-400 hover:text-red-500"
              >
                Xóa
              </button>
            </div>
          ))}
        </div>
        <div className="mt-4 text-right text-xl font-bold">
          Tổng tiền:{" "}
          <span className="text-red-600">
            {totalPrice.toLocaleString("vi-VN")} đ
          </span>
        </div>
      </div>

      {/* CỘT PHẢI: FORM THANH TOÁN */}
      <div className="bg-gray-50 p-6 rounded-lg border h-fit sticky top-24">
        <h2 className="text-2xl font-bold mb-4">2. Thông tin giao hàng</h2>

        {/* Hiện tên user đang đăng nhập cho chuyên nghiệp */}
        {user && (
          <div className="mb-4 text-sm text-blue-600 bg-blue-50 p-2 rounded">
            Đang đặt hàng với tài khoản: <strong>{user.username}</strong>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Họ tên người nhận
            </label>
            <input
              name="name"
              className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Ví dụ: Nguyễn Văn A"
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Số điện thoại
            </label>
            <input
              name="phone"
              className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Ví dụ: 0987..."
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Địa chỉ nhận hàng
            </label>
            <textarea
              name="address"
              className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none h-24"
              placeholder="Ví dụ: Số 10, Đường Z, Hà Nội..."
              onChange={handleChange}
            />
          </div>

          <div className="pt-4">
            <button
              onClick={handleOrder}
              className="w-full bg-black text-white py-3 rounded-lg font-bold text-lg hover:bg-gray-800 transition transform active:scale-95"
            >
              🚀 XÁC NHẬN ĐẶT HÀNG
            </button>
            <p className="text-center text-xs text-gray-500 mt-2">
              Thanh toán tiền mặt khi nhận hàng (COD)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
