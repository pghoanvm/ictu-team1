import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

export default function RegisterPage() {
  const [form, setForm] = useState({ username: "", password: "", email: "" });
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      await axios.post("http://localhost:8080/api/auth/register", form);
      alert("Đăng ký thành công! Hãy đăng nhập.");
      navigate("/login");
    } catch (err) {
      console.error(err);
      alert("Đăng ký thất bại. Có thể tên đăng nhập đã tồn tại.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded shadow-lg bg-white">
      <h2 className="text-2xl font-bold mb-6 text-center">Đăng Ký Tài Khoản</h2>
      <input
        className="w-full border p-2 mb-4 rounded"
        placeholder="Tên đăng nhập"
        onChange={(e) => setForm({ ...form, username: e.target.value })}
      />
      <input
        className="w-full border p-2 mb-4 rounded"
        placeholder="Email (để lấy lại mật khẩu)"
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />
      <input
        className="w-full border p-2 mb-4 rounded"
        type="password"
        placeholder="Mật khẩu"
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />

      <button
        onClick={handleRegister}
        className="w-full bg-green-600 text-white py-2 rounded font-bold mb-4"
      >
        Đăng Ký
      </button>

      <div className="text-center">
        <Link to="/login" className="text-blue-500 text-sm">
          Đã có tài khoản? Đăng nhập
        </Link>
      </div>
    </div>
  );
}
