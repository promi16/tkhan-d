import React, { useState } from "react";
import SupportHeader from "../../components/AdminDashboard/Support/SupportHeader";
import TicketTable from "../../components/AdminDashboard/Support/TicketTable";
import ConversationDetails from "../../components/AdminDashboard/Support/ConversationDetail";
import { useGetTicketsQuery } from "../../redux/features/ticket/ticketApi";
import type { Ticket } from "../../redux/features/ticket/ticketTypes";

const SupportPage: React.FC = () => {
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  const { data, isLoading, isError } = useGetTicketsQuery();
  const tickets: Ticket[] = data?.data ?? [];

  return (
    <div className="w-full min-h-screen bg-[#F9FAFB] font-inter pt-4">
      {!selectedTicket ? (
        <div className="w-full px-4 md:px-6 lg:px-8">
          <SupportHeader />

          <div className="w-full mt-6">
            <TicketTable
              tickets={tickets}
              isLoading={isLoading}
              isError={isError}
              onSelectTicket={setSelectedTicket}
            />
          </div>
        </div>
      ) : (
        <div className="w-full lg:w-[min(1090px,100%)] px-4 md:px-6 lg:px-8">
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
