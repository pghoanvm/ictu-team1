import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import type { CredentialResponse } from "@react-oauth/google";
import axios, { AxiosError } from "axios";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post(
        "https://webvtile.onrender.com/api/auth/login",
        {
          username,
          password,
        }
      );
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
const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => { 
  try {
     const res = await axios.post("http://localhost:8080/api/auth/google", { 
      token: credentialResponse.credential }); 
      login(res.data); // lưu JWT và role 
      alert("Đăng nhập Google thành công!"); 
       navigate("/");
    } catch (err) {
       alert("Google login thất bại!"); 
      }
     };
  return (
    <div className="container mx-auto p-4">
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
        
       
        <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => console.log("Đăng nhập Google thất bại")}
          />
        </GoogleOAuthProvider>


        <div className="flex justify-between text-sm text-blue-500">
          <Link to="/register">Đăng ký tài khoản</Link>
          <Link to="/forgot-password">Quên mật khẩu?</Link>
        </div>
      </div>
      
    </div>
  );
}
