/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

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

// [MỚI] Kiểu dữ liệu Bộ sưu tập
interface Collection {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  productIds?: string[];
}

const API_URL = "https://webvtile.onrender.com/api"; // Gom link API lại cho gọn

export default function AdminPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  // [MỚI] State cho Bộ sưu tập
  const [collections, setCollections] = useState<Collection[]>([]);
  const [newCollection, setNewCollection] = useState({
    name: "",
    description: "",
    imageUrl: "",
  });

  const [newProduct, setNewProduct] = useState({
    name: "",
    price: 0,
    imageUrl: "",
    description: "",
    category: "",
  });

  // --- 1. CHECK QUYỀN ---
  useEffect(() => {
    if (!user || user.role !== "ADMIN") {
      navigate("/");
    }
  }, [user, navigate]);

  // --- 2. LOAD DỮ LIỆU ---
  const fetchData = () => {
    // Lấy Đơn hàng
    axios
      .get(`${API_URL}/orders`)
      .then((res) => setOrders(res.data.reverse()))
      .catch((err) => console.error(err));

    // Lấy Sản phẩm
    axios
      .get(`${API_URL}/products`)
      .then((res) => setProducts(res.data.reverse()))
      .catch((err) => console.error(err));

    // [MỚI] Lấy Bộ sưu tập
    axios
      .get(`${API_URL}/collections`)
      .then((res) => setCollections(res.data.reverse()))
      .catch((err) => console.error("Lỗi lấy BST:", err));
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- 3. XỬ LÝ ĐƠN HÀNG ---
  const handleUpdateStatus = (id: string, newStatus: string) => {
    if (!window.confirm(`Xác nhận chuyển thành "${newStatus}"?`)) return;
    axios
      .put(`${API_URL}/orders/${id}?status=${newStatus}`)
      .then(() => {
        alert("Đã cập nhật đơn hàng!");
        fetchData();
      })
      .catch((err) => alert("Lỗi: " + err));
  };

  // --- 4. XỬ LÝ SẢN PHẨM ---
  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.price || !newProduct.imageUrl) {
      alert("Vui lòng điền đủ thông tin sản phẩm!");
      return;
    }
    axios
      .post(`${API_URL}/products`, newProduct)
      .then(() => {
        alert("🎉 Đã thêm sản phẩm!");
        setNewProduct({
          name: "",
          price: 0,
          imageUrl: "",
          description: "",
          category: "",
        });
        fetchData();
      })
      .catch((err) => alert("Lỗi thêm SP: " + err));
  };

  const handleDeleteProduct = (id: string) => {
    if (window.confirm("⚠️ Xóa sản phẩm này?")) {
      axios
        .delete(`${API_URL}/products/${id}`)
        .then(() => {
          alert("Đã xóa sản phẩm!");
          fetchData();
        })
        .catch((err) => alert("Lỗi xóa: " + err));
    }
  };

  // --- [MỚI] 5. XỬ LÝ BỘ SƯU TẬP ---
  const handleAddCollection = () => {
    if (!newCollection.name || !newCollection.imageUrl) {
      alert("Vui lòng nhập Tên và Link ảnh bộ sưu tập!");
      return;
    }
    // API backend của bạn là /api/collections/add
    axios
      .post(`${API_URL}/collections/add`, newCollection)
      .then(() => {
        alert("✨ Đã thêm bộ sưu tập mới!");
        setNewCollection({ name: "", description: "", imageUrl: "" });
        fetchData(); // Load lại danh sách
      })
      .catch((err) => alert("Lỗi thêm BST: " + err));
  };

  const handleDeleteCollection = (id: string) => {
    if (window.confirm("Bạn muốn xóa bộ sưu tập này?")) {
      axios
        .delete(`${API_URL}/collections/${id}`)
        .then(() => {
          alert("Đã xóa bộ sưu tập!");
          fetchData();
        })
        .catch((err) => alert("Lỗi xóa BST: " + err));
    }
  };

  if (!user || user.role !== "ADMIN") return null;

  return (
    <div className="max-w-6xl mx-auto py-10 px-4 space-y-12 pb-20">
      <h1 className="text-4xl font-bold text-center text-red-600 mb-8">
        ⚙️ TRANG QUẢN TRỊ ADMIN
      </h1>

      {/* PHẦN 1: QUẢN LÝ ĐƠN HÀNG */}
      <div>
        <h2 className="text-2xl font-bold mb-4 border-l-4 border-black pl-4">
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
                  <td className="py-4 px-6">
                    <span className="font-bold">{order.customerName}</span>
                    <br />
                    {order.phone}
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
                      className="bg-green-100 text-green-700 px-2 py-1 rounded"
                    >
                      Giao
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(order.id, "CANCELLED")}
                      className="bg-red-100 text-red-700 px-2 py-1 rounded"
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

      {/* PHẦN 2: QUẢN LÝ SẢN PHẨM */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="bg-blue-50 p-6 rounded-xl border border-blue-200 h-fit">
          <h2 className="text-xl font-bold mb-4 text-blue-800">
            ➕ Thêm Sản Phẩm
          </h2>
          <div className="space-y-3">
            <input
              className="border w-full p-2 rounded"
              placeholder="Tên SP"
              value={newProduct.name}
              onChange={(e) =>
                setNewProduct({ ...newProduct, name: e.target.value })
              }
            />
            <input
              type="number"
              className="border w-full p-2 rounded"
              placeholder="Giá"
              value={newProduct.price || ""}
              onChange={(e) =>
                setNewProduct({ ...newProduct, price: Number(e.target.value) })
              }
            />
            <input
              className="border w-full p-2 rounded"
              placeholder="Link ảnh"
              value={newProduct.imageUrl}
              onChange={(e) =>
                setNewProduct({ ...newProduct, imageUrl: e.target.value })
              }
            />
            <input
              className="border w-full p-2 rounded"
              placeholder="Danh mục"
              value={newProduct.category}
              onChange={(e) =>
                setNewProduct({ ...newProduct, category: e.target.value })
              }
            />
            <textarea
              className="border w-full p-2 rounded"
              placeholder="Mô tả"
              value={newProduct.description}
              onChange={(e) =>
                setNewProduct({ ...newProduct, description: e.target.value })
              }
            />
            <button
              onClick={handleAddProduct}
              className="w-full bg-blue-600 text-white py-2 rounded font-bold hover:bg-blue-700"
            >
              Lưu Sản Phẩm
            </button>
          </div>
        </div>

        <div className="lg:col-span-2">
          <h2 className="text-xl font-bold mb-4 border-l-4 border-yellow-500 pl-4">
            ✏️ Danh sách Sản phẩm
          </h2>
          <div className="bg-white border rounded-lg overflow-hidden shadow-sm max-h-[500px] overflow-y-auto">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-gray-100 uppercase sticky top-0">
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
                        className="w-10 h-10 object-cover rounded"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <div className="font-bold">{p.name}</div>
                      <div className="text-red-500">
                        {p.price.toLocaleString()} đ
                      </div>
                    </td>
                    <td className="px-4 py-2 text-center space-x-2">
                      <Link
                        to={`/admin/edit/${p.id}`}
                        className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded"
                      >
                        Sửa
                      </Link>
                      <button
                        onClick={() => handleDeleteProduct(p.id)}
                        className="bg-red-100 text-red-700 px-3 py-1 rounded"
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

      {/* --- PHẦN 3: QUẢN LÝ BỘ SƯU TẬP (NÂNG CẤP) --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-8 border-t-2 border-dashed">
        {/* Form thêm BST (Giữ nguyên) */}
        <div className="bg-purple-50 p-6 rounded-xl border border-purple-200 h-fit">
          <h2 className="text-xl font-bold mb-4 text-purple-800">
            📸 Thêm Bộ Sưu Tập
          </h2>
          <div className="space-y-3">
            <input
              className="border w-full p-2 rounded"
              placeholder="Tên Bộ Sưu Tập"
              value={newCollection.name}
              onChange={(e) =>
                setNewCollection({ ...newCollection, name: e.target.value })
              }
            />
            <input
              className="border w-full p-2 rounded"
              placeholder="Link Ảnh Bìa"
              value={newCollection.imageUrl}
              onChange={(e) =>
                setNewCollection({ ...newCollection, imageUrl: e.target.value })
              }
            />
            <textarea
              className="border w-full p-2 rounded h-24"
              placeholder="Mô tả..."
              value={newCollection.description}
              onChange={(e) =>
                setNewCollection({
                  ...newCollection,
                  description: e.target.value,
                })
              }
            />
            <button
              onClick={handleAddCollection}
              className="w-full bg-purple-600 text-white py-2 rounded font-bold hover:bg-purple-700 shadow-md transition"
            >
              + Lưu Bộ Sưu Tập
            </button>
          </div>
        </div>

        {/* Danh sách BST + Thêm sản phẩm */}
        <div className="lg:col-span-2">
          <h2 className="text-xl font-bold mb-4 border-l-4 border-purple-500 pl-4">
            📚 Danh sách & Sản phẩm
          </h2>
          <div className="space-y-6">
            {collections.map((col) => (
              <div
                key={col.id}
                className="border rounded-lg p-4 bg-white shadow-sm"
              >
                <div className="flex justify-between items-start mb-4 border-b pb-2">
                  <div className="flex gap-3">
                    <img
                      src={col.imageUrl}
                      alt={col.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div>
                      <h3 className="font-bold text-lg text-purple-900">
                        {col.name}
                      </h3>
                      <p className="text-xs text-gray-500">{col.description}</p>
                      <p className="text-xs font-bold mt-1 text-gray-600">
                        Đang có: {col.productIds?.length || 0} sản phẩm
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteCollection(col.id)}
                    className="text-xs bg-red-100 text-red-600 px-3 py-1 rounded font-bold hover:bg-red-200"
                  >
                    Xóa BST
                  </button>
                </div>

                {/* Khu vực chọn thêm sản phẩm */}
                <div className="bg-gray-50 p-3 rounded text-sm">
                  <label className="font-bold text-gray-700 block mb-2">
                    ➕ Thêm sản phẩm vào BST này:
                  </label>
                  <select
                    className="border p-2 rounded w-full mb-2"
                    onChange={(e) => {
                      const productId = e.target.value;
                      if (productId) {
                        if (window.confirm("Thêm sản phẩm này vào BST?")) {
                          axios
                            .post(
                              `${API_URL}/collections/${col.id}/add-product/${productId}`
                            )
                            .then(() => {
                              alert("Đã thêm sản phẩm!");
                              fetchData(); // Load lại
                            })
                            .catch((err) => alert("Lỗi: " + err));
                        }
                      }
                    }}
                    value=""
                  >
                    <option value="">-- Chọn sản phẩm để thêm --</option>
                    {products.map(
                      (p) =>
                        // Chỉ hiện những sản phẩm CHƯA có trong BST này
                        !col.productIds?.includes(p.id) && (
                          <option key={p.id} value={p.id}>
                            {p.name} - {p.price.toLocaleString()}đ
                          </option>
                        )
                    )}
                  </select>

                  {/* Danh sách sản phẩm đã có trong BST (Để xóa) */}
                  {col.productIds && col.productIds.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {col.productIds.map((pid) => {
                        const prod = products.find((p) => p.id === pid);
                        return prod ? (
                          <span
                            key={pid}
                            className="bg-white border px-2 py-1 rounded text-xs flex items-center gap-2 shadow-sm"
                          >
                            <img
                              src={prod.imageUrl}
                              className="w-4 h-4 rounded-full"
                            />
                            {prod.name}
                            <button
                              onClick={() => {
                                if (
                                  window.confirm("Gỡ sản phẩm này khỏi BST?")
                                ) {
                                  axios
                                    .post(
                                      `${API_URL}/collections/${col.id}/remove-product/${pid}`
                                    )
                                    .then(() => fetchData())
                                    .catch((err) => alert(err));
                                }
                              }}
                              className="text-red-500 font-bold hover:text-red-700"
                            >
                              ×
                            </button>
                          </span>
                        ) : null;
                      })}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
