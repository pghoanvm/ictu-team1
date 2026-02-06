import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  orderDate: string;
  totalPrice: number;
  status: string;
  address: string;
  items: OrderItem[];
}

export default function MyOrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setLoading(true);
      axios
        .get(`https://webvtile.onrender.com/api/orders/mine`)
        .then((res) => {
          // Sắp xếp đơn mới nhất lên đầu
          const sortedOrders = res.data.sort(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (a: any, b: any) =>
              new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime(),
          );
          setOrders(sortedOrders);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [user]);

  if (!user) {
    return (
      <div className="text-center py-20 font-sans">
        <h2 className="text-xl font-bold mb-4">
          Vui lòng đăng nhập để xem đơn hàng
        </h2>
        <Link to="/login" className="text-blue-600 underline">
          Đăng nhập ngay
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 font-sans min-h-[60vh]">
      <h1 className="text-3xl font-black uppercase tracking-widest mb-8">
        Lịch sử đơn hàng
      </h1>

      {loading ? (
        <p className="text-center text-gray-500">Đang tải đơn hàng...</p>
      ) : orders.length === 0 ? (
        <div className="text-center bg-gray-50 p-10 rounded-lg">
          <p className="text-gray-500 mb-4">Bạn chưa có đơn hàng nào.</p>
          <Link
            to="/shop"
            className="bg-black text-white px-6 py-3 font-bold uppercase text-sm hover:bg-gray-800"
          >
            Mua sắm ngay
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          {orders.map((order) => (
            <div
              key={order.id}
              className="border border-gray-200 rounded-lg overflow-hidden shadow-sm"
            >
              {/* Header đơn hàng */}
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <p className="text-xs text-gray-500 uppercase font-bold">
                    Mã đơn hàng
                  </p>
                  <p className="font-mono text-sm font-bold text-gray-800">
                    #{order.id.slice(-6)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-bold">
                    Ngày đặt
                  </p>
                  <p className="text-sm">
                    {new Date(order.orderDate).toLocaleDateString("vi-VN")}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-bold">
                    Tổng tiền
                  </p>
                  <p className="text-red-600 font-bold">
                    {order.totalPrice.toLocaleString("vi-VN")} đ
                  </p>
                </div>
                <div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                      order.status === "PENDING"
                        ? "bg-yellow-100 text-yellow-700"
                        : order.status === "COMPLETED"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {order.status === "PENDING" ? "Đang xử lý" : order.status}
                  </span>
                </div>
              </div>

              {/* Danh sách sản phẩm trong đơn */}
              <div className="p-6">
                {order.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center py-2 border-b last:border-0 border-gray-100"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 bg-gray-200 flex items-center justify-center text-xs text-gray-500 rounded">
                        IMG
                      </div>
                      <div>
                        <p className="font-bold text-sm text-gray-800">
                          {item.productName}
                        </p>
                        <p className="text-xs text-gray-500">
                          x{item.quantity}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm font-medium">
                      {(item.price * item.quantity).toLocaleString("vi-VN")} đ
                    </p>
                  </div>
                ))}
                <div className="mt-4 pt-4 border-t border-gray-100 text-sm text-gray-600">
                  <span className="font-bold">Địa chỉ giao:</span>{" "}
                  {order.address}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
