import React, { useState } from "react";
import { ArrowLeft, CheckCircle, Send } from "lucide-react";
import { Ticket } from "../../../pages/Admin/SupportPage";

interface Message {
  sender: "User" | "Admin";
  timestamp: string;
  text: string;
}

const ConversationDetails: React.FC<{ ticket: Ticket; onBack: () => void }> = ({
  ticket,
  onBack,
}) => {
  const [inputText, setInputText] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "User",
      timestamp: "2026-04-15 10:30 AM",
      text: "The service was not completed as expected.",
    },
    {
      sender: "Admin",
      timestamp: "2026-04-15 02:15 PM",
      text: "We apologize for the inconvenience. We have contacted the service provider and issued a partial refund.",
    },
    {
      sender: "User",
      timestamp: "2026-04-15 03:45 PM",
      text: "Thank you for the quick resolution!",
    },
  ]);

  const handleSend = () => {
    if (!inputText.trim()) {
      alert("Please write something first!");
      return;
    }

    const newMessage: Message = {
      sender: "Admin",
      timestamp: new Date().toLocaleString(),
      text: inputText,
    };

    setMessages([...messages, newMessage]);
    setInputText("");
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div className="w-full h-full p-4 md:p-6 lg:p-8 lg:-ml-12 animate-in fade-in duration-300">
      <button
        onClick={onBack}
        className="flex items-center text-gray-400 hover:text-gray-600 mb-4 transition-colors"
      >
        <ArrowLeft size={20} className="mr-2 cursor-pointer" />
      </button>

      <h2 className="text-xl font-light mb-4">Conversation Details</h2>

      <div className="border border-[#E3E3E4] bg-white rounded-xl p-6 md:p-10 h-full shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6 border-b border-gray-100 pb-6">
          <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="col-span-2 md:col-span-4">
              <p className="text-[12px] uppercase text-gray-500 font-light mb-1">
                Ticket ID
              </p>
              <p className="font-medium text-sm">{ticket.id}</p>

              <hr className="text-gray-100 mt-5 w-full" />
            </div>

            <div>
              <p className="text-[12px] uppercase text-gray-500 font-light mb-1">
                User
              </p>
              <p className="font-medium text-sm">{ticket.user}</p>
            </div>
            <div>
              <p className="text-[12px] uppercase text-gray-500 font-light mb-1">
                Related Booking
              </p>
              <p className="font-medium text-sm">{ticket.booking}</p>
            </div>
            <div>
              <p className="text-[12px] uppercase text-gray-500 font-light mb-1">
                Date Reported
              </p>
              <p className="font-medium text-sm">{ticket.date}</p>
            </div>
            <div>
              <p className="text-[12px] uppercase text-gray-500 font-light mb-1">
                Status
              </p>
              <span className="inline-block bg-[#FFF7ED] text-[#C2410C] text-[12px] px-3 py-1 rounded-lg font-medium">
                Open
              </span>
            </div>
          </div>
          <div className="flex lg:justify-end items-start">
            <button className="flex items-center cursor-pointer gap-2 bg-[#10B981] text-white px-4 py-2 whitespace-nowrap rounded-lg text-sm font-medium hover:bg-[#0E9F6E] transition-colors shadow-sm">
              <CheckCircle size={16} /> Mark as solved
            </button>
          </div>
        </div>

        <div className="mb-6">
          <p className="text-[13px] uppercase text-gray-500 font-light mb-1">
            Issue Summary
          </p>
          <p className="font-medium text-sm leading-relaxed">{ticket.issue}</p>
        </div>

        <hr className="text-gray-100 mb-7" />

        <p className="text-[14px] text-gray-800 font-bold mb-4">Conversation</p>

        <div className="bg-[#F9FAFB] rounded-xl p-4 mb-6 border border-gray-50">
          <div className="space-y-4 max-h-[450px] overflow-y-auto pr-2 custom-scrollbar">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex flex-col ${msg.sender === "Admin" ? "items-end" : "items-start"}`}
              >
                <div
                  className={`max-w-[90%] md:max-w-[75%] rounded-2xl p-4 text-sm ${
                    msg.sender === "Admin"
                      ? "bg-[#FFF5F2] border border-[#FFD8CA]"
                      : "bg-white border border-[#E3E3E4] shadow-sm"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="font-bold text-[11px] uppercase">
                      {msg.sender}
                    </span>
                    <span className="text-[10px] text-gray-400">
                      {msg.timestamp}
                    </span>
                  </div>
                  <p className="text-gray-700 leading-relaxed">{msg.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-auto">
          <p className="text-[14px] text-gray-800 font-medium mb-2">
            Send Reply
          </p>
          <div className="relative">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type your reply here..."
              className="w-full h-32 p-4 bg-white border border-[#E3E3E4] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F26522]/10 resize-none text-sm"
            />
            <button
              onClick={handleSend}
              className="absolute bottom-3 right-3 flex items-center gap-2 bg-[#F26522] hover:bg-[#d4541a] text-white px-6 py-2 rounded-lg text-sm font-bold transition-all shadow-md"
            >
              <Send size={16} /> Send
            </button>
          </div>
        </div>
      </div>

      {showSuccess && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm z-50">
          <div className="bg-white p-8 rounded-2xl shadow-2xl flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
              <CheckCircle size={40} />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Message sent!</h3>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConversationDetails;
