import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios, { AxiosError } from "axios";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post("http://localhost:8080/api/auth/login", {
        username,
        password,
      });
      login(res.data); // Lưu user vào context
      alert("Đăng nhập thành công!");

      // Nếu là admin thì vào trang admin, không thì về trang chủ
      if (res.data.role === "ADMIN") navigate("/admin");
      else navigate("/");
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      alert("Lỗi: " + (error.response?.data?.message || "Sai thông tin!"));
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded shadow-lg bg-white">
      <h2 className="text-2xl font-bold mb-6 text-center">Đăng Nhập</h2>
      <input
        className="w-full border p-2 mb-4 rounded"
        placeholder="Tài khoản"
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        className="w-full border p-2 mb-4 rounded"
        type="password"
        placeholder="Mật khẩu"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        onClick={handleLogin}
        className="w-full bg-blue-600 text-white py-2 rounded font-bold mb-4"
      >
        Đăng Nhập
      </button>

      <div className="flex justify-between text-sm text-blue-500">
        <Link to="/register">Đăng ký tài khoản</Link>
        <Link to="/forgot-password">Quên mật khẩu?</Link>
      </div>
    </div>
  );
}
