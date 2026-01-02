import { useEffect, useState } from "react";
import axios from "axios";

// Kiểu dữ liệu Đơn hàng
interface Order {
  id: string;
  customerName: string;
  phone: string;
  address: string;
  totalPrice: number;
  status: string;
  items: any[];
}

export default function AdminPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  // State cho Form thêm sản phẩm
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: 0,
    imageUrl: "",
    description: "",
  });

  // Load danh sách đơn hàng
  const fetchOrders = () => {
    axios
      .get("http://localhost:8080/api/orders")
      .then((res) => setOrders(res.data.reverse()))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Xử lý đổi trạng thái đơn
  const handleUpdateStatus = (id: string, newStatus: string) => {
    if (!window.confirm(`Xác nhận chuyển thành "${newStatus}"?`)) return;
    axios
      .put(`http://localhost:8080/api/orders/${id}?status=${newStatus}`)
      .then(() => {
        alert("Đã cập nhật!");
        fetchOrders();
      })
      .catch((err) => alert("Lỗi: " + err));
  };

  // Xử lý thêm sản phẩm mới
  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.price || !newProduct.imageUrl) {
      alert("Vui lòng điền Tên, Giá và Link ảnh!");
      return;
    }

    axios
      .post("http://localhost:8080/api/products", newProduct)
      .then(() => {
        alert("🎉 Đã thêm sản phẩm mới thành công!");
        // Reset form
        setNewProduct({ name: "", price: 0, imageUrl: "", description: "" });
      })
      .catch((err) => alert("Lỗi thêm sản phẩm: " + err));
  };

  return (
    <div className="max-w-6xl mx-auto py-10 px-4 space-y-12">
      {/* PHẦN 1: QUẢN LÝ ĐƠN HÀNG (GIỮ NGUYÊN) */}
      <div>
        <h1 className="text-3xl font-bold mb-6 text-gray-800 border-l-4 border-black pl-4">
          📦 Quản Lý Đơn Hàng
        </h1>
        <div className="overflow-x-auto bg-white shadow-lg rounded-lg border">
          <table className="min-w-full leading-normal">
            <thead>
              <tr className="bg-gray-800 text-white uppercase text-sm">
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
                    {order.totalPrice.toLocaleString("vi-VN")} ₫
                  </td>
                  <td className="py-4 px-6 text-center">
                    {order.status || "PENDING"}
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

      {/* PHẦN 2: THÊM SẢN PHẨM MỚI (MỚI THÊM) */}
      <div className="bg-gray-50 p-8 rounded-xl border-2 border-dashed border-gray-300">
        <h1 className="text-3xl font-bold mb-6 text-gray-800 border-l-4 border-blue-600 pl-4">
          ➕ Đăng Sản Phẩm Mới
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input
            className="border p-3 rounded focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Tên sản phẩm (Ví dụ: Áo khoác dù)"
            value={newProduct.name}
            onChange={(e) =>
              setNewProduct({ ...newProduct, name: e.target.value })
            }
          />
          <input
            type="number"
            className="border p-3 rounded focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Giá tiền (VNĐ)"
            value={newProduct.price || ""}
            onChange={(e) =>
              setNewProduct({ ...newProduct, price: Number(e.target.value) })
            }
          />
          <input
            className="border p-3 rounded focus:ring-2 focus:ring-blue-500 outline-none md:col-span-2"
            placeholder="Link ảnh (URL)"
            value={newProduct.imageUrl}
            onChange={(e) =>
              setNewProduct({ ...newProduct, imageUrl: e.target.value })
            }
          />
          <textarea
            className="border p-3 rounded focus:ring-2 focus:ring-blue-500 outline-none md:col-span-2 h-24"
            placeholder="Mô tả sản phẩm..."
            value={newProduct.description}
            onChange={(e) =>
              setNewProduct({ ...newProduct, description: e.target.value })
            }
          />
        </div>

        <button
          onClick={handleAddProduct}
          className="mt-6 bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 transition w-full md:w-auto"
        >
          Lưu Sản Phẩm
        </button>
      </div>
    </div>
  );
}
