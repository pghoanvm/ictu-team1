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
  <div className="container mx-auto p-4">
    <div className="p-8 max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-4">✏️ Sửa sản phẩm</h2>
      <form onSubmit={handleUpdate} className="space-y-4">
        {/* Tên sản phẩm */}
        <div>
          <label className="block mb-1 font-medium">Tên sản phẩm</label>
          <input
            className="border w-full p-2 rounded"
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
          />
        </div>

        {/* Giá tiền */}
        <div>
          <label className="block mb-1 font-medium">Giá tiền</label>
          <input
            type="number"
            className="border w-full p-2 rounded"
            value={formData.price}
            onChange={(e) =>
              setFormData({ ...formData, price: Number(e.target.value) })
            }
          />
        </div>

        {/* Ảnh */}
        <div>
          <label className="block mb-1 font-medium">Ảnh (URL)</label>
          <input
            className="border w-full p-2 rounded"
            value={formData.imageUrl}
            onChange={(e) =>
              setFormData({ ...formData, imageUrl: e.target.value })
            }
          />
        </div>

        {/* Mô tả */}
        <div>
          <label className="block mb-1 font-medium">Mô tả sản phẩm</label>
          <textarea
            className="border w-full p-2 rounded"
            rows={4}
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />
        </div>

        {/* Danh mục */}
        <div>
          <label className="block mb-1 font-medium">Danh mục</label>
          <select
            className="border w-full p-2 rounded"
            value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
          >
            <option value="">-- Chọn danh mục --</option>
            <option value="Áo Khoác">Áo Khoác</option>
            <option value="Quần dài">Quần dài</option>
            <option value="Áo Len">Áo Len</option>
            <option value="Phụ Kiện">Phụ Kiện</option>
          </select>
        </div>

        {/* Nút lưu */}
        <button
          type="submit"
          className="bg-blue-600 text-white w-full py-2 rounded font-bold hover:bg-blue-700 transition"
        >
          Lưu thay đổi
        </button>
          <button type="button" onClick={() => navigate(-1)} 
            className="bg-gray-500 text-white w-full py-2 rounded font-bold hover:bg-gray-600 transition mt-2"
          >
            ⬅️ Quay lại
          </button>
      </form>
    </div>
  </div>
);
}
