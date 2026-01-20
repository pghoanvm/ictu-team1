import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom"; // Import Link để bấm vào sản phẩm
import type { Collection } from "../types/Extra";
import type { Product } from "../types/Product"; // Đảm bảo bạn đã có type Product

const CollectionPage: React.FC = () => {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    // 1. Lấy danh sách Bộ sưu tập
    axios
      .get("https://webvtile.onrender.com/api/collections")
      .then((res) => setCollections(res.data))
      .catch((err) => console.error("Lỗi lấy BST:", err));

    // 2. Lấy toàn bộ Sản phẩm để lọc
    axios
      .get("https://webvtile.onrender.com/api/products")
      .then((res) => setProducts(res.data))
      .catch((err) => console.error("Lỗi lấy SP:", err));
  }, []);

  return (
    <div className="container mx-auto p-6 min-h-screen">
      <h1 className="text-4xl font-black mb-12 text-center text-gray-800 uppercase tracking-wide">
        Bộ Sưu Tập Mới Nhất
      </h1>

      <div className="space-y-16">
        {collections.map((col) => {
          // LỌC SẢN PHẨM: Chỉ lấy những SP có ID nằm trong danh sách productIds của BST
          const colProducts = products.filter((p) =>
            col.productIds?.includes(p.id)
          );

          return (
            <div
              key={col.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100"
            >
              {/* Ảnh bìa to đẹp */}
              <div className="relative h-64 md:h-80">
                <img
                  src={col.imageUrl}
                  alt={col.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-center items-center text-white p-4 text-center">
                  <h2 className="text-3xl md:text-5xl font-bold mb-2 shadow-sm">
                    {col.name}
                  </h2>
                  <p className="text-lg md:text-xl font-light opacity-90">
                    {col.description}
                  </p>
                </div>
              </div>

              {/* Danh sách sản phẩm bên dưới */}
              <div className="p-6 md:p-8">
                {colProducts.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {colProducts.map((product) => (
                      <Link
                        to={`/product/${product.id}`}
                        key={product.id}
                        className="group block border rounded-lg p-2 hover:shadow-md transition"
                      >
                        <div className="overflow-hidden rounded-lg mb-3">
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="w-full h-48 object-cover transform group-hover:scale-110 transition duration-500"
                          />
                        </div>
                        <h3 className="font-bold text-gray-800 group-hover:text-blue-600 transition truncate">
                          {product.name}
                        </h3>
                        <p className="text-red-500 font-bold">
                          {product.price.toLocaleString()} đ
                        </p>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-500 italic py-4">
                    Chưa có sản phẩm nào trong bộ sưu tập này.
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CollectionPage;
