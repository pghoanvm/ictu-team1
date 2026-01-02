import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");

  const handleReset = async () => {
    try {
      await axios.post("http://localhost:8080/api/auth/forgot-password", {
        email,
      });
      alert("Mật khẩu mới đã được gửi! (Hãy nhờ Admin xem Server Console)");
    } catch (err) {
      console.error(err);
      alert("Email không tồn tại trong hệ thống!");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded shadow-lg bg-white">
      <h2 className="text-2xl font-bold mb-4 text-center">Quên Mật Khẩu</h2>
      <p className="text-sm text-gray-500 mb-4 text-center">
        Nhập email bạn đã đăng ký để nhận mật khẩu mới.
      </p>

      <input
        className="w-full border p-2 mb-4 rounded"
        placeholder="Nhập email của bạn"
        onChange={(e) => setEmail(e.target.value)}
      />

      <button
        onClick={handleReset}
        className="w-full bg-orange-500 text-white py-2 rounded font-bold mb-4"
      >
        Lấy lại mật khẩu
      </button>

      <div className="text-center">
        <Link to="/login" className="text-blue-500 text-sm">
          Quay lại đăng nhập
        </Link>
      </div>
    </div>
  );
}
