import React, { useEffect, useState } from "react";
import axios from "axios";
import type { AboutUs } from "../types/Extra";

const AboutPage: React.FC = () => {
  const [info, setInfo] = useState<AboutUs | null>(null);

  useEffect(() => {
    axios
      .get("https://webvtile.onrender.com/api/about")
      .then((res) => setInfo(res.data))
      .catch((err) => console.error("Lỗi lấy thông tin giới thiệu:", err));
  }, []);

  if (!info) return <div className="text-center mt-20">Đang tải...</div>;

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white shadow-md mt-10 rounded-lg">
      <h1 className="text-4xl font-bold text-blue-600 mb-6 text-center">
        {info.title || "Về Shop QA"}
      </h1>

      <section className="mb-8">
        <p className="text-lg text-gray-700 leading-relaxed">{info.content}</p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-blue-50 p-6 rounded-lg">
          <h2 className="text-2xl font-semibold mb-3">Sứ mệnh</h2>
          <p>{info.mission}</p>
        </div>
        <div className="bg-green-50 p-6 rounded-lg">
          <h2 className="text-2xl font-semibold mb-3">Tầm nhìn</h2>
          <p>{info.vision}</p>
        </div>
      </div>

      <div className="mt-10 text-center border-t pt-6">
        <p className="font-medium">
          Liên hệ chúng tôi:{" "}
          <span className="text-blue-500">{info.contactEmail}</span>
        </p>
      </div>
    </div>
  );
};

export default AboutPage;
