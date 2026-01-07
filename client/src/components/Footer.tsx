export default function Footer() {
  return (
    <footer className="bg-white border-t mt-20 pt-10 pb-6 text-gray-600 text-sm">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* CỘT 1: THÔNG TIN CÔNG TY */}
        <div>
          <h3 className="font-bold text-black uppercase mb-4 text-base tracking-wider">
            Về chúng tôi
          </h3>
          <p className="mb-2">Team 1 - Web demo</p>
          <p className="mb-2">📍 Địa chỉ: xxx xxx xxx</p>
          <p>📞 Hotline: 09xx.xxx.xxx</p>
        </div>

        {/* CỘT 2: CHÍNH SÁCH */}
        <div>
          <h3 className="font-bold text-black uppercase mb-4 text-base tracking-wider">
            Chính sách khách hàng
          </h3>
          <ul className="space-y-2">
            <li>
              <a href="#" className="hover:text-black">
                Chính sách đổi trả
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-black">
                Chính sách bảo hành
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-black">
                Khách hàng thân thiết
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-black">
                Hướng dẫn chọn size
              </a>
            </li>
          </ul>
        </div>

        {/* CỘT 3: HỖ TRỢ */}
        <div>
          <h3 className="font-bold text-black uppercase mb-4 text-base tracking-wider">
            Hỗ trợ
          </h3>
          <ul className="space-y-2">
            <li>
              <a href="#" className="hover:text-black">
                Phương thức thanh toán
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-black">
                Vận chuyển & Giao nhận
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-black">
                Câu hỏi thường gặp
              </a>
            </li>
          </ul>
        </div>

        {/* CỘT 4: ĐĂNG KÝ NHẬN TIN */}
        <div>
          <h3 className="font-bold text-black uppercase mb-4 text-base tracking-wider">
            Đăng ký nhận tin
          </h3>
          <p className="mb-4 text-xs">
            Nhận thông tin sản phẩm mới và khuyến mãi sớm nhất.
          </p>
          <div className="flex">
            <input
              type="email"
              placeholder="Email của bạn..."
              className="border p-2 w-full outline-none focus:border-black text-xs"
            />
            <button className="bg-black text-white px-4 text-xs font-bold uppercase hover:bg-gray-800">
              Gửi
            </button>
          </div>
        </div>
      </div>

      <div className="text-center mt-10 border-t pt-6 text-xs text-gray-400">
        © 2026 Team 1. All rights reserved. Design by WebVTile.
      </div>
    </footer>
  );
}
