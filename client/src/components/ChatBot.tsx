import { useState } from "react";
import axios from "axios";

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<
    { sender: "user" | "ai"; text: string }[]
  >([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    // 1. Hiện tin nhắn của mình lên trước
    const newMessages = [...messages, { sender: "user", text: input } as const];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      // 2. Gọi API Backend
      const res = await axios.post("http://localhost:8080/api/chat", {
        message: input,
      });

      // 3. Hiện câu trả lời của AI
      setMessages([...newMessages, { sender: "ai", text: res.data.reply }]);
    } catch (error: unknown) {
      console.error("Chat error:", error);
      setMessages([...newMessages, { sender: "ai", text: "Lỗi kết nối!" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {/* Nút bật tắt chat */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition"
        >
          💬 Chat AI
        </button>
      )}

      {/* Cửa sổ chat */}
      {isOpen && (
        <div className="bg-white w-80 h-96 rounded-lg shadow-2xl flex flex-col border border-gray-200">
          <div className="bg-blue-600 text-white p-3 rounded-t-lg flex justify-between">
            <h3 className="font-bold">Tư vấn viên AI</h3>
            <button onClick={() => setIsOpen(false)}>✖</button>
          </div>

          <div className="flex-1 p-3 overflow-y-auto space-y-2 bg-gray-50">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`p-2 rounded-lg max-w-[80%] ${
                    msg.sender === "user"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-800"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="text-gray-400 text-sm">AI đang gõ...</div>
            )}
          </div>

          <div className="p-2 border-t flex gap-2">
            <input
              className="flex-1 border rounded px-2 py-1 outline-none focus:border-blue-500"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Hỏi gì đi..."
            />
            <button
              onClick={sendMessage}
              className="bg-blue-600 text-white px-3 py-1 rounded"
            >
              Gửi
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
