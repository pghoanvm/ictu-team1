import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");
    setError("");

    try {
      // Gọi API
      const res = await axios.post(
        "https://webvtile.onrender.com/api/auth/forgot-password",
        { email },
      );

      // 👇 HIỂN THỊ MẬT KHẨU MỚI TỪ SERVER
      setMessage(res.data); // Server trả về: "Mật khẩu mới của bạn là: xt82ka"
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.response?.data || "Có lỗi xảy ra, vui lòng thử lại!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Quên Mật Khẩu
        </h2>

        {/* Hiển thị lỗi nếu có */}
        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        {/* 👇 KHUNG HIỂN THỊ MẬT KHẨU MỚI (MÀU XANH) */}
        {message && (
          <div className="bg-green-100 border border-green-400 text-green-800 p-4 rounded mb-4 text-center">
            <p className="font-bold text-lg">{message}</p>
            <p className="text-xs mt-2 text-gray-600">
              Hãy dùng mật khẩu này để đăng nhập ngay!
            </p>
          </div>
        )}

        {!message && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Nhập Email của bạn:
              </label>
              <input
                type="email"
                className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition font-bold disabled:bg-gray-400"
            >
              {isLoading ? "Đang xử lý..." : "Lấy Mật Khẩu Mới"}
            </button>
          </form>
        )}

        <div className="mt-4 text-center">
          <Link to="/login" className="text-sm text-blue-600 hover:underline">
            Quay lại Đăng nhập
          </Link>
        </div>
      </div>
    </div>
  );
}
