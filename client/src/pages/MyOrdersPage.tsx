import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext"; // Nhớ import đúng đường dẫn

export default function MyOrdersPage() {
  const [orders, setOrders] = useState([]);
  const { user } = useAuth(); // Lấy thông tin user đang đăng nhập

  useEffect(() => {
    if (user?.username) {
      // Gọi API lấy đơn hàng của user này
      fetch(
        `https://webvtile.onrender.com/api/orders/my-orders/${user.username}`
      )
        .then((res) => res.json())
        .then((data) => setOrders(data))
        .catch((err) => console.error(err));
    }
  }, [user]);

  if (!user)
    return <div className="p-10">Bạn cần đăng nhập để xem đơn hàng!</div>;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">📦 Đơn hàng của tôi</h2>

      {orders.length === 0 ? (
        <p>Bạn chưa mua đơn hàng nào.</p>
      ) : (
        <div className="space-y-4">
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {orders.map((order: any) => (
            <div key={order.id} className="border p-4 rounded shadow bg-white">
              <div className="flex justify-between font-bold mb-2">
                <span>Mã đơn: {order.id.substring(0, 8)}...</span>
                <span className="text-green-600">
                  {order.status || "Đang xử lý"}
                </span>
              </div>
              <p>Tổng tiền: {Number(order.totalPrice).toLocaleString()} đ</p>
              <p className="text-sm text-gray-500">
                Ngày đặt: {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
