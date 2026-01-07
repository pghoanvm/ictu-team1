// 1. THÊM "React" VÀO DÒNG IMPORT NÀY
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

interface Message {
  // 2. SỬA "JSX.Element" THÀNH "React.ReactNode"
  text: string | React.ReactNode;
  sender: "bot" | "user";
}

interface Product {
  id: string;
  name: string;
  price: number;
}

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { text: "Xin chào! Shop có thể giúp gì cho bạn?", sender: "bot" },
  ]);
  const [input, setInput] = useState("");

  const [products, setProducts] = useState<Product[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    axios
      .get("https://webvtile.onrender.com/api/products")
      .then((res) => setProducts(res.data))
      .catch((err) => console.error("Bot lỗi lấy hàng:", err));
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  const generateResponse = (text: string) => {
    const lowerText = text.toLowerCase();

    // -- KỊCH BẢN TÌM SẢN PHẨM --
    if (
      lowerText.includes("áo") ||
      lowerText.includes("quần") ||
      lowerText.includes("mua") ||
      lowerText.includes("có mẫu")
    ) {
      const foundProducts = products.filter(
        (p) =>
          p.name.toLowerCase().includes(lowerText) ||
          (lowerText.includes("áo") && p.name.toLowerCase().includes("áo")) ||
          (lowerText.includes("quần") && p.name.toLowerCase().includes("quần"))
      );

      if (foundProducts.length > 0) {
        const showList = foundProducts.slice(0, 3);
        return (
          <div className="flex flex-col gap-1">
            <span>Dạ shop đang có các mẫu này ạ:</span>
            {showList.map((p) => (
              <Link
                key={p.id}
                to={`/product/${p.id}`}
                className="text-blue-600 underline text-sm font-bold block bg-gray-100 p-1 rounded"
              >
                👉 {p.name} - {p.price.toLocaleString()}đ
              </Link>
            ))}
            {foundProducts.length > 3 && (
              <span className="text-xs text-gray-400">
                ...và còn nhiều mẫu khác nữa ạ!
              </span>
            )}
          </div>
        );
      } else {
        return "Dạ hiện tại shop chưa tìm thấy mẫu bạn hỏi. Bạn thử tìm từ khóa khác xem sao ạ (ví dụ: Áo khoác, Quần dài...)";
      }
    }

    // -- KỊCH BẢN KHÁC --
    if (lowerText.includes("giá") || lowerText.includes("bao nhiêu")) {
      return "Giá sản phẩm được niêm yết công khai trên web ạ. Bạn bấm vào sản phẩm để xem chi tiết nhé!";
    }
    if (lowerText.includes("ship") || lowerText.includes("vận chuyển")) {
      return "Shop miễn phí vận chuyển cho đơn từ 500k. Phí ship thường là 30k ạ.";
    }
    if (lowerText.includes("đổi trả") || lowerText.includes("bảo hành")) {
      return "Shop hỗ trợ đổi trả trong vòng 7 ngày nếu lỗi do nhà sản xuất hoặc không vừa size ạ.";
    }

    return "Dạ, bạn cần tư vấn về Áo hay Quần ạ? Bạn cứ gõ tên món đồ cần tìm, mình sẽ kiểm tra kho giúp bạn ngay!";
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const newMessages = [
      ...messages,
      { text: input, sender: "user" } as Message,
    ];
    setMessages(newMessages);
    setInput("");

    setTimeout(() => {
      const botReply = generateResponse(input);
      setMessages((prev) => [...prev, { text: botReply, sender: "bot" }]);
    }, 500);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end font-sans">
      {isOpen && (
        <div className="bg-white w-80 h-96 shadow-2xl rounded-lg flex flex-col overflow-hidden border border-gray-200 animate-fade-in-up">
          <div className="bg-black text-white p-3 font-bold flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
              Team 1 Support
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-300 hover:text-white text-xl"
            >
              &times;
            </button>
          </div>

          <div className="flex-1 p-3 overflow-y-auto bg-gray-50 space-y-3">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg text-sm shadow-sm ${
                    msg.sender === "user"
                      ? "bg-blue-600 text-white rounded-br-none"
                      : "bg-white text-gray-800 border border-gray-200 rounded-bl-none"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-3 bg-white border-t flex gap-2">
            <input
              className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm outline-none focus:border-black focus:ring-1 focus:ring-black transition"
              placeholder="Bạn muốn tìm gì..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button
              onClick={handleSend}
              className="bg-black text-white p-2 rounded-full hover:bg-gray-800 transition active:scale-95"
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
          className="bg-black text-white p-4 rounded-full shadow-xl hover:bg-gray-800 transition-transform hover:scale-110 active:scale-95 flex items-center justify-center gap-2 group"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8"
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
