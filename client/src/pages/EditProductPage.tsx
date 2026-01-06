/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function EditProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    price: 0,
    description: "",
    imageUrl: "",
    category: "",
  });

  // Lấy thông tin cũ để điền vào form
  useEffect(() => {
    fetch(`https://webvtile.onrender.com/api/products/${id}`)
      .then((res) => res.json())
      .then((data) => setFormData(data));
  }, [id]);

  const handleUpdate = (e: any) => {
    e.preventDefault();
    fetch(`https://webvtile.onrender.com/api/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    }).then(() => {
      alert("Cập nhật thành công!");
      navigate("/admin"); // Quay về trang admin
    });
  };

  return (
    <div className="p-8 max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-4">✏️ Sửa sản phẩm</h2>
      <form onSubmit={handleUpdate} className="space-y-4">
        <div>
          <label>Tên sản phẩm</label>
          <input
            className="border w-full p-2 rounded"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>
        <div>
          <label>Giá tiền</label>
          <input
            type="number"
            className="border w-full p-2 rounded"
            value={formData.price}
            onChange={(e) =>
              setFormData({ ...formData, price: Number(e.target.value) })
            }
          />
        </div>
        <div>
          <label>Ảnh (URL)</label>
          <input
            className="border w-full p-2 rounded"
            value={formData.imageUrl}
            onChange={(e) =>
              setFormData({ ...formData, imageUrl: e.target.value })
            }
          />
        </div>
        <button className="bg-blue-600 text-white w-full py-2 rounded font-bold">
          Lưu thay đổi
        </button>
      </form>
    </div>
  );
}
