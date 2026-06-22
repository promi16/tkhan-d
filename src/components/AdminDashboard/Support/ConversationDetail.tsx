import React, { useState, useRef, useEffect } from "react";
import {
  ArrowLeft,
  CheckCircle,
  Send,
  Loader2,
  AlertCircle,
} from "lucide-react";
import type { Ticket } from "../../../redux/features/ticket/ticketTypes";
import {
  useReplyToTicketMutation,
  useResolveTicketMutation,
  useGetTicketsQuery,
} from "../../../redux/features/ticket/ticketApi";

interface ConversationDetailsProps {
  ticket: Ticket;
  onBack: () => void;
}

const formatDateTime = (dateStr: string) =>
  new Date(dateStr).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

const ConversationDetails: React.FC<ConversationDetailsProps> = ({
  ticket,
  onBack,
}) => {
  const [inputText, setInputText] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { data } = useGetTicketsQuery();

  const freshTicket = data?.data?.find((t) => t.id === ticket.id) ?? ticket;

  const [replyToTicket, { isLoading: isSending }] = useReplyToTicketMutation();
  const [resolveTicket, { isLoading: isResolving }] =
    useResolveTicketMutation();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [freshTicket.messages]);

  const handleSend = async () => {
    if (!inputText.trim()) return;
    try {
      await replyToTicket({ id: freshTicket.id, message: inputText }).unwrap();
      setInputText("");
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2500);
    } catch (err) {
      console.error("Failed to send reply:", err);
    }
  };

  const handleResolve = async () => {
    if (freshTicket.status === "RESOLVED") return;
    try {
      await resolveTicket(freshTicket.id).unwrap();
    } catch (err) {
      console.error("Failed to resolve ticket:", err);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      handleSend();
    }
  };

  return (
    <div className="w-full h-full p-3 sm:p-4 md:p-6 lg:p-8 animate-in fade-in duration-300">
      <button
        onClick={onBack}
        className="flex items-center text-gray-400 hover:text-gray-600 mb-3 sm:mb-4 transition-colors gap-1"
      >
        <ArrowLeft size={16} className="cursor-pointer sm:w-5 sm:h-5" />
      </button>

      <h2 className="text-base sm:text-lg md:text-xl font-light mb-3 sm:mb-4">
        Conversation Details
      </h2>

      <div className="border border-[#E3E3E4] bg-white rounded-xl p-4 sm:p-6 md:p-10 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6 mb-4 sm:mb-6 border-b border-gray-100 pb-4 sm:pb-6">
          <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            <div className="col-span-2 md:col-span-4">
              <p className="text-[9px] sm:text-[10px] md:text-[12px] uppercase text-gray-500 font-light mb-1">
                Ticket ID
              </p>
              <p className="font-medium text-[11px] sm:text-xs md:text-sm font-mono">
                {freshTicket.id}
              </p>
              <hr className="text-gray-100 mt-3 sm:mt-5 w-full" />
            </div>

            <div className="col-span-2">
              <p className="text-[9px] sm:text-[10px] md:text-[12px] uppercase text-gray-500 font-light mb-1">
                Subject
              </p>
              <p className="font-medium text-[11px] sm:text-xs md:text-sm">
                {freshTicket.subject}
              </p>
            </div>

            <div>
              <p className="text-[9px] sm:text-[10px] md:text-[12px] uppercase text-gray-500 font-light mb-1">
                Related Booking
              </p>
              <p className="font-medium text-[11px] sm:text-xs md:text-sm font-mono">
                {freshTicket.relatedBookingId
                  ? freshTicket.relatedBookingId.slice(0, 8) + "..."
                  : "—"}
              </p>
            </div>

            <div>
              <p className="text-[9px] sm:text-[10px] md:text-[12px] uppercase text-gray-500 font-light mb-1">
                Date Reported
              </p>
              <p className="font-medium text-[11px] sm:text-xs md:text-sm">
                {formatDateTime(freshTicket.createdAt)}
              </p>
            </div>

            <div>
              <p className="text-[9px] sm:text-[10px] md:text-[12px] uppercase text-gray-500 font-light mb-1">
                Status
              </p>
              <span
                className={`inline-block text-[9px] sm:text-[10px] md:text-[12px] px-2 sm:px-3 py-1 rounded-lg font-medium ${
                  freshTicket.status === "RESOLVED"
                    ? "bg-[#E6F9F1] text-[#00A360]"
                    : "bg-[#FFF7ED] text-[#C2410C]"
                }`}
              >
                {freshTicket.status === "RESOLVED" ? "Resolved" : "Open"}
              </span>
            </div>

            {freshTicket.resolvedAt && (
              <div>
                <p className="text-[9px] sm:text-[10px] md:text-[12px] uppercase text-gray-500 font-light mb-1">
                  Resolved At
                </p>
                <p className="font-medium text-[11px] sm:text-xs md:text-sm">
                  {formatDateTime(freshTicket.resolvedAt)}
                </p>
              </div>
            )}
          </div>

          <div className="flex lg:justify-end items-start mt-3 sm:mt-0">
            {freshTicket.status === "RESOLVED" ? (
              <div className="flex items-center gap-1 sm:gap-2 bg-[#E6F9F1] text-[#00A360] px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg text-[10px] sm:text-xs md:text-sm font-medium">
                <CheckCircle size={14} className="sm:w-4 sm:h-4" /> Resolved
              </div>
            ) : (
              <button
                onClick={handleResolve}
                disabled={isResolving}
                className="flex items-center cursor-pointer gap-1 sm:gap-2 bg-[#10B981] text-white px-3 sm:px-4 py-1.5 sm:py-2 whitespace-nowrap rounded-lg text-[10px] sm:text-xs md:text-sm font-medium hover:bg-[#0E9F6E] transition-colors shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isResolving ? (
                  <Loader2 size={12} className="animate-spin sm:w-4 sm:h-4" />
                ) : (
                  <CheckCircle size={12} className="sm:w-4 sm:h-4" />
                )}
                {isResolving ? "Resolving..." : "Mark as solved"}
              </button>
            )}
          </div>
        </div>

        <p className="text-[12px] sm:text-[13px] md:text-[14px] text-gray-800 font-bold mb-3 sm:mb-4">
          Conversation
        </p>

        <div className="bg-[#F9FAFB] rounded-xl p-3 sm:p-4 mb-4 sm:mb-6 border border-gray-50">
          <div
            ref={scrollRef}
            className="space-y-3 sm:space-y-4 max-h-[350px] sm:max-h-[450px] overflow-y-auto pr-2"
          >
            {freshTicket.messages.length === 0 ? (
              <p className="text-center text-gray-400 text-[11px] sm:text-xs md:text-sm py-6 sm:py-8">
                No messages yet.
              </p>
            ) : (
              freshTicket.messages.map((msg) => {
                const isAdmin = msg.senderType === "ADMIN";
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isAdmin ? "items-end" : "items-start"}`}
                  >
                    <div
                      className={`max-w-[95%] sm:max-w-[90%] md:max-w-[75%] rounded-2xl p-3 sm:p-4 text-[11px] sm:text-xs md:text-sm ${
                        isAdmin
                          ? "bg-[#FFF5F2] border border-[#FFD8CA]"
                          : "bg-white border border-[#E3E3E4] shadow-sm"
                      }`}
                    >
                      <div className="flex items-center gap-1.5 sm:gap-2 mb-1">
                        <span className="font-bold text-[9px] sm:text-[10px] md:text-[11px] uppercase">
                          {isAdmin ? "Admin" : "User"}
                        </span>
                        <span className="text-[8px] sm:text-[9px] md:text-[10px] text-gray-400">
                          {formatDateTime(msg.createdAt)}
                        </span>
                      </div>
                      <p className="text-gray-700 leading-relaxed">
                        {msg.message}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {freshTicket.status === "RESOLVED" ? (
          <div className="flex items-center gap-1.5 sm:gap-2 text-gray-400 bg-gray-50 rounded-xl p-3 sm:p-4 border border-gray-100">
            <AlertCircle size={14} className="sm:w-4 sm:h-4" />
            <p className="text-[11px] sm:text-xs md:text-sm">
              This ticket has been resolved. No further replies allowed.
            </p>
          </div>
        ) : (
          <div className="mt-auto">
            <p className="text-[12px] sm:text-[13px] md:text-[14px] text-gray-800 font-medium mb-2">
              Send Reply{" "}
              <span className="text-[9px] sm:text-[10px] md:text-[11px] text-gray-400 font-normal">
                (Ctrl+Enter to send)
              </span>
            </p>
            <div className="relative">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your reply here..."
                disabled={isSending}
                className="w-full h-28 sm:h-32 p-3 sm:p-4 bg-white border border-[#E3E3E4] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F26522]/10 resize-none text-[11px] sm:text-xs md:text-sm disabled:opacity-60"
              />
              <button
                onClick={handleSend}
                disabled={isSending || !inputText.trim()}
                className="absolute bottom-2 sm:bottom-3 right-2 sm:right-3 flex items-center gap-1.5 sm:gap-2 bg-[#F26522] hover:bg-[#d4541a] text-white px-4 sm:px-6 py-1.5 sm:py-2 rounded-lg text-[10px] sm:text-xs md:text-sm font-bold transition-all shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSending ? (
                  <Loader2 size={12} className="animate-spin sm:w-4 sm:h-4" />
                ) : (
                  <Send size={12} className="sm:w-4 sm:h-4" />
                )}
                {isSending ? "Sending..." : "Send"}
              </button>
            </div>
          </div>
        )}
      </div>

      {showSuccess && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm z-50">
          <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-2xl flex flex-col items-center text-center">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-3 sm:mb-4">
              <CheckCircle size={28} className="sm:w-10 sm:h-10" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-gray-900">
              Reply sent!
            </h3>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConversationDetails;
