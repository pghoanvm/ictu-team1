/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

// --- TYPE DEFINITIONS ---
interface OrderItem {
  productName: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  customerName: string;
  phone: string;
  totalPrice: number;
  status: string;
  items: OrderItem[];
}

interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  category: string;
}

interface Collection {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  productIds?: string[];
}

const API_URL = "https://webvtile.onrender.com/api";

export default function AdminPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // --- STATE ---
  const [activeTab, setActiveTab] = useState<
    "orders" | "products" | "collections"
  >("orders");
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(false);

  // Form State
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

  // --- 1. CHECK QUYỀN & LOAD DATA ---
  useEffect(() => {
    if (!user || user.role !== "ADMIN") {
      navigate("/");
      return;
    }
    fetchData();
  }, [user, navigate]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [resOrders, resProducts, resCollections] = await Promise.all([
        axios.get(`${API_URL}/orders`),
        axios.get(`${API_URL}/products?limit=100`), // Lấy nhiều SP
        axios.get(`${API_URL}/collections`),
      ]);

      setOrders(resOrders.data.reverse()); // Mới nhất lên đầu
      setProducts(resProducts.data.products || resProducts.data.reverse());
      setCollections(resCollections.data.reverse());
    } catch (err) {
      console.error("Lỗi tải dữ liệu Admin:", err);
    } finally {
      setLoading(false);
    }
  };

  // --- 2. LOGIC ĐƠN HÀNG ---
  const handleUpdateStatus = async (id: string, newStatus: string) => {
    // Optimistic Update: Cập nhật giao diện trước khi gọi API
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o)),
    );

    try {
      await axios.put(`${API_URL}/orders/${id}?status=${newStatus}`);
      // Không cần alert để đỡ phiền, chỉ hiện khi lỗi
    } catch (err) {
      alert("Lỗi cập nhật: " + err);
      fetchData(); // Rollback nếu lỗi
    }
  };

  // --- 3. LOGIC SẢN PHẨM ---
  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.price) return alert("Thiếu thông tin!");
    try {
      await axios.post(`${API_URL}/products`, newProduct);
      alert("✅ Đã thêm sản phẩm!");
      setNewProduct({
        name: "",
        price: 0,
        imageUrl: "",
        description: "",
        category: "",
      });
      fetchData();
    } catch (err) {
      alert("Lỗi: " + err);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!window.confirm("Xóa sản phẩm này?")) return;
    try {
      await axios.delete(`${API_URL}/products/${id}`);
      setProducts((prev) => prev.filter((p) => p.id !== id)); // Xóa ngay trên UI
    } catch (err) {
      alert("Lỗi xóa: " + err);
    }
  };

  // --- 4. LOGIC BỘ SƯU TẬP ---
  const handleAddCollection = async () => {
    try {
      await axios.post(`${API_URL}/collections/add`, newCollection);
      alert("✨ Đã thêm BST!");
      setNewCollection({ name: "", description: "", imageUrl: "" });
      fetchData();
    } catch (err) {
      alert("Lỗi: " + err);
    }
  };

  if (!user || user.role !== "ADMIN") return null;

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-20">
      {/* HEADER */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <h1 className="text-xl font-black uppercase tracking-widest flex items-center gap-2">
            <span className="text-red-600 text-2xl">⚙️</span> Quản Trị Viên
          </h1>
          <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
            {(["orders", "products", "collections"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-sm font-bold uppercase rounded-md transition-all ${
                  activeTab === tab
                    ? "bg-white shadow text-black"
                    : "text-gray-500 hover:text-black"
                }`}
              >
                {tab === "orders"
                  ? "Đơn Hàng"
                  : tab === "products"
                    ? "Sản Phẩm"
                    : "Bộ Sưu Tập"}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {loading && (
          <div className="text-center py-10">Đang tải dữ liệu...</div>
        )}

        {/* TAB 1: QUẢN LÝ ĐƠN HÀNG */}
        {activeTab === "orders" && (
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-100 text-gray-600 uppercase text-xs font-bold">
                <tr>
                  <th className="px-6 py-4">Mã Đơn</th>
                  <th className="px-6 py-4">Khách Hàng</th>
                  <th className="px-6 py-4">Sản Phẩm</th>
                  <th className="px-6 py-4 text-right">Tổng Tiền</th>
                  <th className="px-6 py-4 text-center">Trạng Thái</th>
                  <th className="px-6 py-4 text-center">Xử Lý</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-mono text-gray-500">
                      #{order.id.slice(-6)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold">{order.customerName}</div>
                      <div className="text-xs text-gray-500">{order.phone}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-xs text-gray-600 max-w-[200px]">
                        {order.items
                          ?.map((i) => `${i.productName} (x${i.quantity})`)
                          .join(", ")}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right font-bold">
                      {order.totalPrice?.toLocaleString()}₫
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`px-2 py-1 rounded text-xs font-bold ${
                          order.status === "SHIPPED"
                            ? "bg-green-100 text-green-700"
                            : order.status === "CANCELLED"
                              ? "bg-red-100 text-red-700"
                              : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <select
                        className="border rounded px-2 py-1 text-xs outline-none focus:ring-2 focus:ring-black"
                        value={order.status}
                        onChange={(e) =>
                          handleUpdateStatus(order.id, e.target.value)
                        }
                      >
                        <option value="PENDING">Đang xử lý</option>
                        <option value="SHIPPED">Đã giao</option>
                        <option value="CANCELLED">Đã hủy</option>
                        <option value="COMPLETED">Hoàn thành</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 2: QUẢN LÝ SẢN PHẨM */}
        {activeTab === "products" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border h-fit sticky top-24">
              <h3 className="font-bold uppercase mb-4">➕ Thêm Sản Phẩm Mới</h3>
              <div className="space-y-3">
                <input
                  className="w-full border p-2 rounded text-sm"
                  placeholder="Tên sản phẩm"
                  value={newProduct.name}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, name: e.target.value })
                  }
                />
                <input
                  className="w-full border p-2 rounded text-sm"
                  type="number"
                  placeholder="Giá bán"
                  value={newProduct.price || ""}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      price: Number(e.target.value),
                    })
                  }
                />
                <input
                  className="w-full border p-2 rounded text-sm"
                  placeholder="URL Hình ảnh"
                  value={newProduct.imageUrl}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, imageUrl: e.target.value })
                  }
                />
                <input
                  className="w-full border p-2 rounded text-sm"
                  placeholder="Danh mục (Ví dụ: Áo Khoác)"
                  value={newProduct.category}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, category: e.target.value })
                  }
                />
                <textarea
                  className="w-full border p-2 rounded text-sm h-24"
                  placeholder="Mô tả chi tiết..."
                  value={newProduct.description}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      description: e.target.value,
                    })
                  }
                />
                <button
                  onClick={handleAddProduct}
                  className="w-full bg-black text-white py-3 font-bold uppercase hover:bg-gray-800 rounded"
                >
                  Lưu Sản Phẩm
                </button>
              </div>
            </div>

            <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-4">
              {products.map((p) => (
                <div
                  key={p.id}
                  className="bg-white border rounded-lg overflow-hidden group hover:shadow-md transition"
                >
                  <div className="aspect-square bg-gray-100 relative">
                    <img
                      src={p.imageUrl}
                      className="w-full h-full object-cover"
                      alt=""
                    />
                    <button
                      onClick={() => handleDeleteProduct(p.id)}
                      className="absolute top-2 right-2 bg-red-600 text-white w-8 h-8 rounded-full opacity-0 group-hover:opacity-100 transition flex items-center justify-center font-bold"
                    >
                      ×
                    </button>
                  </div>
                  <div className="p-3">
                    <h4 className="font-bold text-sm truncate">{p.name}</h4>
                    <p className="text-xs text-gray-500">{p.category}</p>
                    <p className="text-red-600 font-bold text-sm mt-1">
                      {p.price.toLocaleString()}₫
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: QUẢN LÝ BỘ SƯU TẬP (Giữ nguyên logic của bạn nhưng làm đẹp lại) */}
        {activeTab === "collections" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border h-fit">
              <h3 className="font-bold uppercase mb-4 text-purple-700">
                📸 Thêm Bộ Sưu Tập
              </h3>
              <div className="space-y-3">
                <input
                  className="w-full border p-2 rounded text-sm"
                  placeholder="Tên BST"
                  value={newCollection.name}
                  onChange={(e) =>
                    setNewCollection({ ...newCollection, name: e.target.value })
                  }
                />
                <input
                  className="w-full border p-2 rounded text-sm"
                  placeholder="Ảnh bìa"
                  value={newCollection.imageUrl}
                  onChange={(e) =>
                    setNewCollection({
                      ...newCollection,
                      imageUrl: e.target.value,
                    })
                  }
                />
                <textarea
                  className="w-full border p-2 rounded text-sm"
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
                  className="w-full bg-purple-600 text-white py-2 rounded font-bold hover:bg-purple-700"
                >
                  Tạo Mới
                </button>
              </div>
            </div>

            <div className="lg:col-span-2 space-y-4">
              {collections.map((col) => (
                <div
                  key={col.id}
                  className="bg-white border p-4 rounded-lg flex gap-4"
                >
                  <img
                    src={col.imageUrl}
                    className="w-24 h-24 object-cover rounded-lg bg-gray-200"
                    alt=""
                  />
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold text-lg">{col.name}</h3>
                      <button className="text-red-500 text-xs font-bold border px-2 py-1 rounded hover:bg-red-50">
                        Xóa
                      </button>
                    </div>
                    <p className="text-sm text-gray-500 mb-2">
                      {col.description}
                    </p>
                    <div className="bg-gray-50 p-2 rounded text-xs border">
                      <strong>Sản phẩm trong BST: </strong>
                      {/* Logic thêm sản phẩm giữ nguyên như cũ của bạn */}
                      <select
                        className="ml-2 border rounded p-1"
                        onChange={(e) => {
                          if (e.target.value && confirm("Thêm vào BST?")) {
                            axios
                              .post(
                                `${API_URL}/collections/${col.id}/add-product/${e.target.value}`,
                              )
                              .then(fetchData);
                          }
                        }}
                      >
                        <option value="">+ Thêm sản phẩm</option>
                        {products.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name}
                          </option>
                        ))}
                      </select>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {col.productIds?.map((pid) => (
                          <span
                            key={pid}
                            className="bg-white border px-2 py-1 rounded flex items-center gap-1"
                          >
                            {products.find((p) => p.id === pid)?.name ||
                              "Unknown"}
                            <button
                              className="text-red-500 font-bold ml-1"
                              onClick={() =>
                                axios
                                  .post(
                                    `${API_URL}/collections/${col.id}/remove-product/${pid}`,
                                  )
                                  .then(fetchData)
                              }
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
