// client/src/components/Footer.tsx
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-black text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-12">
        {/* Cột 1: Brand */}
        <div>
          <h3 className="text-2xl font-black uppercase mb-6 tracking-tighter">
            TEAM.
          </h3>
          <p className="text-gray-400 text-sm leading-relaxed">
            Chúng tôi tạo ra những trang phục nam giới chất lượng cao, bền vững
            và phong cách.
          </p>
        </div>

        {/* Cột 2: Links */}
        <div>
          <h4 className="font-bold uppercase mb-6 tracking-wider">Cửa hàng</h4>
          <ul className="space-y-4 text-sm text-gray-400">
            <li>
              <Link to="/shop" className="hover:text-white transition">
                Tất cả sản phẩm
              </Link>
            </li>
            <li>
              <Link to="/collection" className="hover:text-white transition">
                Bộ sưu tập mới
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-white transition">
                Về chúng tôi
              </Link>
            </li>
          </ul>
        </div>

        {/* Cột 3: Hỗ trợ */}
        <div>
          <h4 className="font-bold uppercase mb-6 tracking-wider">Hỗ trợ</h4>
          <ul className="space-y-4 text-sm text-gray-400">
            <li>
              <a href="#" className="hover:text-white transition">
                Chính sách đổi trả
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition">
                Hướng dẫn chọn size
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition">
                Liên hệ
              </a>
            </li>
          </ul>
        </div>

        {/* Cột 4: Newsletter */}
        <div>
          <h4 className="font-bold uppercase mb-6 tracking-wider">
            Đăng ký nhận tin
          </h4>
          <p className="text-gray-400 text-sm mb-4">
            Nhận thông báo về sale và sản phẩm mới.
          </p>
          <div className="flex">
            <input
              type="email"
              placeholder="Email của bạn"
              className="bg-gray-900 border-none text-white px-4 py-2 w-full focus:ring-1 focus:ring-white"
            />
            <button className="bg-white text-black px-4 font-bold uppercase hover:bg-gray-200">
              Gửi
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 pt-8 border-t border-gray-800 text-center text-gray-500 text-xs">
        &copy; 2026 TEAM Fashion. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
