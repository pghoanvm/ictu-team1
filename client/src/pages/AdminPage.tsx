/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext"; // Import Auth để check quyền
import { useNavigate, Link } from "react-router-dom"; // Import Link để chuyển trang sửa

// Kiểu dữ liệu Đơn hàng
interface Order {
  id: string;
  customerName: string;
  phone: string;
  totalPrice: number;
  status: string;
  items: any[];
}

// Kiểu dữ liệu Sản phẩm
interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
}

export default function AdminPage() {
  const { user } = useAuth(); // Lấy thông tin user
  const navigate = useNavigate();

  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]); // State danh sách sản phẩm

  // State cho Form thêm sản phẩm
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: 0,
    imageUrl: "",
    description: "",
    category: "",
  });

  // --- 1. BẢO MẬT: CHẶN NGƯỜI LẠ ---
  useEffect(() => {
    if (!user || user.role !== "ADMIN") {
      // Nếu không phải Admin, chuyển hướng về trang chủ
      navigate("/");
    }
  }, [user, navigate]);

  // --- 2. LOAD DỮ LIỆU ---
  const fetchOrders = () => {
    axios
      .get("https://webvtile.onrender.com/api/orders")
      .then((res) => setOrders(res.data.reverse()))
      .catch((err) => console.error(err));
  };

  const fetchProducts = () => {
    axios
      .get("https://webvtile.onrender.com/api/products")
      .then((res) => setProducts(res.data.reverse())) // Lấy danh sách sản phẩm
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchOrders();
    fetchProducts();
  }, []);

  // --- 3. XỬ LÝ ĐƠN HÀNG ---
  const handleUpdateStatus = (id: string, newStatus: string) => {
    if (!window.confirm(`Xác nhận chuyển thành "${newStatus}"?`)) return;
    axios
      .put(`https://webvtile.onrender.com/api/orders/${id}?status=${newStatus}`)
      .then(() => {
        alert("Đã cập nhật đơn hàng!");
        fetchOrders();
      })
      .catch((err) => alert("Lỗi: " + err));
  };

  // --- 4. XỬ LÝ SẢN PHẨM (THÊM / XÓA) ---
  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.price || !newProduct.imageUrl) {
      alert("Vui lòng điền Tên, Giá và Link ảnh!");
      return;
    }

    axios
      .post("https://webvtile.onrender.com/api/products", newProduct)
      .then(() => {
        alert("🎉 Đã thêm sản phẩm mới thành công!");
        setNewProduct({
          name: "",
          price: 0,
          imageUrl: "",
          description: "",
          category: "",
        });
        fetchProducts(); // Load lại danh sách sản phẩm ngay lập tức
      })
      .catch((err) => alert("Lỗi thêm sản phẩm: " + err));
  };

  const handleDeleteProduct = (id: string) => {
    if (window.confirm("⚠️ Bạn chắc chắn muốn XÓA vĩnh viễn sản phẩm này?")) {
      axios
        .delete(`https://webvtile.onrender.com/api/products/${id}`)
        .then(() => {
          alert("Đã xóa sản phẩm!");
          setProducts(products.filter((p) => p.id !== id)); // Xóa trên giao diện
        })
        .catch((err) => alert("Lỗi xóa: " + err));
    }
  };

  // Nếu đang check quyền thì chưa hiện gì cả để tránh nháy trang
  if (!user || user.role !== "ADMIN") return null;

  return (
    <div className="max-w-6xl mx-auto py-10 px-4 space-y-12">
      <h1 className="text-4xl font-bold text-center text-red-600 mb-8">
        ⚙️ TRANG QUẢN TRỊ ADMIN
      </h1>

      {/* PHẦN 1: QUẢN LÝ ĐƠN HÀNG */}
      <div>
        <h2 className="text-2xl font-bold mb-4 text-gray-800 border-l-4 border-black pl-4">
          📦 Quản Lý Đơn Hàng
        </h2>
        <div className="overflow-x-auto bg-white shadow-lg rounded-lg border max-h-96 overflow-y-auto">
          <table className="min-w-full leading-normal">
            <thead>
              <tr className="bg-gray-800 text-white uppercase text-sm sticky top-0">
                <th className="py-3 px-6 text-left">Khách hàng</th>
                <th className="py-3 px-6 text-left">Tổng tiền</th>
                <th className="py-3 px-6 text-center">Trạng thái</th>
                <th className="py-3 px-6 text-center">Hành động</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm">
              {orders.map((order) => (
                <tr key={order.id} className="border-b hover:bg-gray-50">
                  <td className="py-4 px-6 font-medium">
                    {order.customerName} <br />
                    <span className="text-xs font-light">{order.phone}</span>
                  </td>
                  <td className="py-4 px-6 text-red-600 font-bold">
                    {order.totalPrice?.toLocaleString("vi-VN")} ₫
                  </td>
                  <td className="py-4 px-6 text-center">
                    <span
                      className={`px-2 py-1 rounded text-xs font-bold ${
                        order.status === "SHIPPED"
                          ? "bg-green-200 text-green-800"
                          : order.status === "CANCELLED"
                          ? "bg-red-200 text-red-800"
                          : "bg-yellow-200 text-yellow-800"
                      }`}
                    >
                      {order.status || "PENDING"}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-center flex gap-2 justify-center">
                    <button
                      onClick={() => handleUpdateStatus(order.id, "SHIPPED")}
                      className="bg-green-100 text-green-700 px-2 py-1 rounded hover:bg-green-200"
                    >
                      Giao
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(order.id, "CANCELLED")}
                      className="bg-red-100 text-red-700 px-2 py-1 rounded hover:bg-red-200"
                    >
                      Hủy
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* PHẦN 2: QUẢN LÝ SẢN PHẨM (MỚI) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cột trái: Form Thêm Sản Phẩm */}
        <div className="lg:col-span-1 bg-blue-50 p-6 rounded-xl border border-blue-200 h-fit">
          <h2 className="text-xl font-bold mb-4 text-blue-800">
            ➕ Thêm Sản Phẩm Mới
          </h2>
          <div className="space-y-3">
            <input
              className="border w-full p-2 rounded"
              placeholder="Tên sản phẩm"
              value={newProduct.name}
              onChange={(e) =>
                setNewProduct({ ...newProduct, name: e.target.value })
              }
            />
            <input
              type="number"
              className="border w-full p-2 rounded"
              placeholder="Giá (VNĐ)"
              value={newProduct.price || ""}
              onChange={(e) =>
                setNewProduct({ ...newProduct, price: Number(e.target.value) })
              }
            />
            <input
              className="border w-full p-2 rounded"
              placeholder="Link ảnh (URL)"
              value={newProduct.imageUrl}
              onChange={(e) =>
                setNewProduct({ ...newProduct, imageUrl: e.target.value })
              }
            />
            <input
              className="border w-full p-2 rounded"
              placeholder="Danh mục (Ví dụ: Áo)"
              value={newProduct.category}
              onChange={(e) =>
                setNewProduct({ ...newProduct, category: e.target.value })
              }
            />
            <textarea
              className="border w-full p-2 rounded h-20"
              placeholder="Mô tả..."
              value={newProduct.description}
              onChange={(e) =>
                setNewProduct({ ...newProduct, description: e.target.value })
              }
            />

            <button
              onClick={handleAddProduct}
              className="w-full bg-blue-600 text-white py-2 rounded font-bold hover:bg-blue-700 transition"
            >
              Lưu Sản Phẩm
            </button>
          </div>
        </div>

        {/* Cột phải: Danh sách sản phẩm hiện có */}
        <div className="lg:col-span-2">
          <h2 className="text-xl font-bold mb-4 text-gray-800 border-l-4 border-yellow-500 pl-4">
            ✏️ Danh sách sản phẩm (Sửa / Xóa)
          </h2>
          <div className="bg-white border rounded-lg overflow-hidden shadow-sm max-h-[500px] overflow-y-auto">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-gray-100 text-gray-700 uppercase sticky top-0">
                <tr>
                  <th className="px-4 py-3">Ảnh</th>
                  <th className="px-4 py-3">Tên & Giá</th>
                  <th className="px-4 py-3 text-center">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-2">
                      <img
                        src={p.imageUrl}
                        alt=""
                        className="w-12 h-12 object-cover rounded"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <div className="font-bold">{p.name}</div>
                      <div className="text-red-500">
                        {p.price.toLocaleString()} đ
                      </div>
                    </td>
                    <td className="px-4 py-2 text-center space-x-2">
                      {/* Nút Sửa: Chuyển sang trang Edit */}
                      <Link
                        to={`/admin/edit/${p.id}`}
                        className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded hover:bg-yellow-200"
                      >
                        Sửa
                      </Link>

                      {/* Nút Xóa: Gọi hàm xóa */}
                      <button
                        onClick={() => handleDeleteProduct(p.id)}
                        className="bg-red-100 text-red-700 px-3 py-1 rounded hover:bg-red-200"
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
