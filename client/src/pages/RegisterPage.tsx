import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

export default function RegisterPage() {
  const [form, setForm] = useState({ username: "", password: "", email: "" });
  const navigate = useNavigate();

  // QUAN TRỌNG: Phải có chữ 'async' ở đây để dùng được 'await' bên dưới
  const handleRegister = async () => {
    // 1. Kiểm tra nhập liệu trống
    if (!form.username || !form.password || !form.email) {
      alert("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    // 2. Kiểm tra định dạng Email (phải có dấu @)
    if (!form.email.includes("@")) {
      alert("❌ Email phải có định dạng hợp lệ (ví dụ: abc@gmail.com)");
      return;
    }

    try {
      // 3. Gọi API đăng ký
      const response = await axios.post(
        "https://webvtile.onrender.com/api/auth/register",
        form
      );

      // Nếu thành công (Backend trả về 200 OK)
      alert("🎉 " + response.data);
      navigate("/login");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      // Nếu thất bại (Backend trả về lỗi 400, 500...)
      console.error(err);

      let message = "Đăng ký thất bại. Vui lòng thử lại!";

      if (err.response && err.response.data) {
        // Kiểm tra xem Backend trả về chuỗi văn bản hay Object lỗi
        message =
          typeof err.response.data === "string"
            ? err.response.data
            : err.response.data.message || JSON.stringify(err.response.data);
      }

      alert("❌ " + message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded shadow-lg bg-white font-sans">
      <h2 className="text-2xl font-bold mb-6 text-center tracking-tight text-gray-800">
        ĐĂNG KÝ TÀI KHOẢN
      </h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-bold mb-1 uppercase text-gray-500">
            Tên đăng nhập
          </label>
          <input
            className="w-full border p-3 rounded focus:ring-1 focus:ring-black outline-none transition"
            placeholder="Nhập tên đăng nhập..."
            onChange={(e) => setForm({ ...form, username: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-bold mb-1 uppercase text-gray-500">
            Email
          </label>
          <input
            type="email"
            className="w-full border p-3 rounded focus:ring-1 focus:ring-black outline-none transition"
            placeholder="example@gmail.com"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-bold mb-1 uppercase text-gray-500">
            Mật khẩu
          </label>
          <input
            className="w-full border p-3 rounded focus:ring-1 focus:ring-black outline-none transition"
            type="password"
            placeholder="Nhập mật khẩu..."
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </div>

        <button
          onClick={handleRegister}
          className="w-full bg-black text-white py-3 rounded font-bold hover:bg-gray-800 transition uppercase tracking-widest text-sm active:scale-95"
        >
          Đăng Ký Ngay
        </button>
      </div>

      <div className="text-center mt-6">
        <Link
          to="/login"
          className="text-gray-400 text-xs hover:text-black transition underline"
        >
          Đã có tài khoản? Đăng nhập tại đây
        </Link>
      </div>
    </div>
  );
}
