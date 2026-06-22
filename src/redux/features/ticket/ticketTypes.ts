// src/redux/features/tickets/ticketTypes.ts

export type TicketStatus = "OPEN" | "RESOLVED";
export type SenderType = "USER" | "ADMIN";

export interface TicketMessage {
    id: string;
    ticketId: string;
    senderId: string;
    senderType: SenderType;
    message: string;
    createdAt: string;
}

export interface Ticket {
    id: string;
    requesterId: string;
    relatedBookingId: string | null;
    subject: string;
    status: TicketStatus;
    createdAt: string;
    updatedAt: string;
    resolvedAt: string | null;
    messages: TicketMessage[];
}

// API Response types
export interface CreateTicketRequest {
    subject: string;
    message: string;
    relatedBookingId?: string;
}

export interface CreateTicketResponse {
    success: boolean;
    data: Ticket;
}

export interface GetTicketsResponse {
    success: boolean;
    data: Ticket[];
}

export interface ReplyToTicketRequest {
    id: string;
    message: string;
}

export interface ReplyToTicketResponse {
    success: boolean;
    data: TicketMessage;
}

export interface ResolveTicketResponse {
    success: boolean;
    data: Ticket;
}