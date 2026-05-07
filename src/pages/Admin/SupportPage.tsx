import React, { useState } from "react";
import SupportHeader from "../../components/AdminDashboard/Support/SupportHeader";
import TicketTable from "../../components/AdminDashboard/Support/TicketTable";
import ConversationDetails from "../../components/AdminDashboard/Support/ConversationDetail";

export type TicketStatus = "Replied" | "Open";

export interface Ticket {
  id: string;
  user: string;
  booking: string;
  issue: string;
  status: TicketStatus;
  date: string;
}

const SupportPage: React.FC = () => {
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  return (
    <div className="w-full min-h-screen bg-[#F9FAFB] font-inter pt-4">
      {!selectedTicket ? (
        // Fixed Padding: Mobile e p-4, large screen e standard padding
        <div className="w-full px-4 md:px-6 lg:pr-10">
          <SupportHeader />
          <div className="w-full mt-6">
            <div className="w-full bg-white rounded-xl shadow-sm border border-[#E3E3E4]">
              <TicketTable onSelectTicket={setSelectedTicket} />
            </div>
          </div>
        </div>
      ) : (
        // Removed hardcoded width and negative margins for responsiveness
        <div className="w-full max-w-5xl mx-auto px-4">
          <ConversationDetails
            ticket={selectedTicket}
            onBack={() => setSelectedTicket(null)}
          />
        </div>
      )}
    </div>
  );
};

export default SupportPage;
