import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

// 1. HÀM XỬ LÝ TIẾNG VIỆT
const removeVietnameseTones = (str: string) => {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase();
};

interface Message {
  text: string | React.ReactNode;
  sender: "bot" | "user";
}

interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl?: string;
}

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      text: "👋 Xin chào! Bạn cần tìm món đồ nào cứ nhắn tên cho mình nhé (VD: 'sơ mi', 'quần tây'...)",
      sender: "bot",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Lấy danh sách sản phẩm với error handling
  useEffect(() => {
    setIsLoadingProducts(true);
    axios
      .get("https://webvtile.onrender.com/api/products")
      .then((res) => {
        if (res.data && res.data.length > 0) {
          setProducts(res.data);
        } else {
          console.warn("Không có sản phẩm nào");
          setMessages((prev) => [
            ...prev,
            {
              text: "⚠️ Hiện tại shop chưa có sản phẩm nào. Vui lòng quay lại sau nhé!",
              sender: "bot",
            },
          ]);
        }
      })
      .catch((err) => {
        console.error("Bot lỗi lấy hàng:", err);
        setMessages((prev) => [
          ...prev,
          {
            text: "⚠️ Shop đang bảo trì hệ thống. Vui lòng quay lại sau nhé!",
            sender: "bot",
          },
        ]);
      })
      .finally(() => {
        setIsLoadingProducts(false);
      });
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen, isTyping]);

  // --- LOGIC TRẢ LỜI MỚI: TÌM KIẾM MỌI THỨ ---
  const generateResponse = (text: string) => {
    const cleanText = removeVietnameseTones(text).trim();

    // 1. Kịch bản chào hỏi xã giao
    if (["hi", "hello", "xin chao", "chao", "alo", "hey"].includes(cleanText)) {
      return "Dạ chào bạn! Shop đang có rất nhiều mẫu mới. Bạn muốn tìm gì ạ?";
    }

    // 2. Kịch bản hỏi thông tin (Giá, Ship, Đổi trả)
    if (cleanText.includes("gia") || cleanText.includes("bao nhieu")) {
      return "💰 Giá sản phẩm bên mình được niêm yết công khai ngay trên ảnh sản phẩm ạ. Bạn bấm vào xem chi tiết nhé!";
    }
    if (
      cleanText.includes("ship") ||
      cleanText.includes("van chuyen") ||
      cleanText.includes("giao hang")
    ) {
      return "🚚 Bên mình miễn phí vận chuyển cho đơn hàng từ 500k trở lên. Đơn nhỏ hơn phí ship đồng giá 30k ạ.";
    }
    if (cleanText.includes("doi tra") || cleanText.includes("bao hanh")) {
      return "🛡️ Shop hỗ trợ đổi trả trong vòng 7 ngày nếu lỗi do nhà sản xuất hoặc không vừa size bạn nhé.";
    }
    if (
      cleanText.includes("lien he") ||
      cleanText.includes("lien lac") ||
      cleanText.includes("hotline") ||
      cleanText.includes("sdt") ||
      cleanText.includes("so dien thoai")
    ) {
      return "📞 Liên hệ shop qua:\n• Hotline: 1900-xxxx\n• Email: support@teamishop.com\n• Facebook: fb.com/teamishop";
    }

    // 3. Kiểm tra nếu đang load products
    if (isLoadingProducts) {
      return "⏳ Mình đang tải danh sách sản phẩm, vui lòng đợi chút nhé...";
    }

    // 4. Kiểm tra nếu không có sản phẩm
    if (products.length === 0) {
      return "⚠️ Hiện tại shop chưa có sản phẩm nào. Vui lòng quay lại sau!";
    }

    // 5. KỊCH BẢN TÌM SẢN PHẨM (Áp dụng cho mọi tin nhắn còn lại)
    // Lọc bớt các từ thừa để từ khóa chính xác hơn
    const stopWords = [
      "mua",
      "tim",
      "cho",
      "xem",
      "co",
      "shop",
      "ban",
      "mau",
      "minh",
      "toi",
      "cua",
      "voi",
      "duoc",
      "khong",
    ];

    // Cải thiện cách lọc stopWords
    let searchKeyword = cleanText
      .split(" ")
      .filter((word) => !stopWords.includes(word) && word.length > 0)
      .join(" ")
      .trim();

    // Validation: Từ khóa phải có ít nhất 2 ký tự
    if (searchKeyword.length < 2) {
      return "Bạn vui lòng nhập ít nhất 2 ký tự để mình tìm sản phẩm nhé! 😊";
    }

    // Tìm kiếm sản phẩm
    const foundProducts = products.filter((p) =>
      removeVietnameseTones(p.name).includes(searchKeyword)
    );

    if (foundProducts.length > 0) {
      const showList = foundProducts.slice(0, 3);
      return (
        <div className="flex flex-col gap-2">
          <span>
            Dạ mình tìm thấy {foundProducts.length} sản phẩm khớp với "
            {searchKeyword}":
          </span>
          {showList.map((p) => (
            <Link
              key={p.id}
              to={`/product/${p.id}`}
              className="flex items-center gap-3 bg-gray-50 p-2 rounded-lg border hover:bg-gray-100 transition"
              onClick={() => setIsOpen(false)}
            >
              <div className="w-10 h-10 bg-gray-200 rounded-md flex items-center justify-center text-xl overflow-hidden">
                {p.imageUrl ? (
                  <img
                    src={p.imageUrl}
                    alt={p.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  "🛍️"
                )}
              </div>
              <div>
                <div className="text-sm font-bold text-gray-800 line-clamp-1">
                  {p.name}
                </div>
                <div className="text-xs text-red-600 font-bold">
                  {p.price.toLocaleString()}đ
                </div>
              </div>
            </Link>
          ))}
          {foundProducts.length > 3 && (
            <Link
              to="/shop"
              className="text-xs text-blue-500 italic text-center hover:underline"
              onClick={() => setIsOpen(false)}
            >
              Xem thêm {foundProducts.length - 3} kết quả khác...
            </Link>
          )}
        </div>
      );
    }

    // 6. Nếu tìm khắp nơi vẫn không thấy
    return `Hmm... Shop chưa tìm thấy sản phẩm nào tên là "${text}" ạ. Bạn thử tìm từ khóa ngắn hơn xem sao nhé (VD: 'kaki', 'thun', 'áo'...)`;
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg: Message = { text: input, sender: "user" };
    setMessages((prev) => [...prev, userMsg]);
    const userInput = input;
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const botReply = generateResponse(userInput);
      setMessages((prev) => [...prev, { text: botReply, sender: "bot" }]);
      setIsTyping(false);
    }, 800);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end font-sans">
      {isOpen && (
        <div className="bg-white w-80 sm:w-96 h-[500px] shadow-2xl rounded-2xl flex flex-col overflow-hidden border border-gray-200 animate-fade-in-up">
          <div className="bg-gradient-to-r from-blue-900 to-black text-white p-4 font-bold flex justify-between items-center shadow-md">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-xl text-black border-2 border-blue-200">
                  🤖
                </div>
                <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-500 ring-2 ring-black"></span>
              </div>
              <div>
                <div className="text-sm">Trợ lý ảo Team I</div>
                <div className="text-[10px] text-green-300 font-normal flex items-center gap-1">
                  <span className="animate-pulse">●</span> Luôn sẵn sàng
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-white transition text-2xl"
            >
              &times;
            </button>
          </div>

          <div className="flex-1 p-4 overflow-y-auto bg-gray-50 space-y-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] p-3 rounded-2xl text-sm shadow-sm leading-relaxed ${
                    msg.sender === "user"
                      ? "bg-blue-600 text-white rounded-br-none"
                      : "bg-white text-gray-800 border border-gray-200 rounded-bl-none"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-200 p-3 rounded-2xl rounded-bl-none flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce"></span>
                  <span
                    className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></span>
                  <span
                    className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-3 bg-white border-t flex gap-2 items-center">
            <input
              className="flex-1 bg-gray-100 border-none rounded-full px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 transition outline-none"
              placeholder="Nhập tên sản phẩm..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim()}
              className="bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed shadow-lg"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative bg-blue-600 text-white p-4 rounded-full shadow-2xl hover:bg-blue-700 transition-all hover:-translate-y-1 active:scale-95 flex items-center justify-center"
        >
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 text-[10px] items-center justify-center font-bold">
              1
            </span>
          </span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-7 w-7"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            />
          </svg>
        </button>
      )}
    </div>
  );
}