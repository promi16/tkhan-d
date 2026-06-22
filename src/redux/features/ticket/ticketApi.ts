// src/redux/features/ticket/ticketApi.ts

import { baseApi } from "@/redux/hooks/baseApi";
import type {
    CreateTicketRequest,
    CreateTicketResponse,
    GetTicketsResponse,
    ReplyToTicketRequest,
    ReplyToTicketResponse,
    ResolveTicketResponse,
} from "./ticketTypes";

export const ticketApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // GET /tickets — admin sees all, buyer sees own
        getTickets: builder.query<GetTicketsResponse, void>({
            query: () => ({
                url: "/tickets",
                method: "GET",
            }),
            providesTags: ["Tickets"],
            keepUnusedDataFor: 30,
        }),

        // POST /tickets — buyer creates a ticket
        createTicket: builder.mutation<CreateTicketResponse, CreateTicketRequest>({
            query: (body) => ({
                url: "/tickets",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Tickets"],
        }),

        // POST /tickets/:id/replies — admin or buyer can reply
        replyToTicket: builder.mutation<ReplyToTicketResponse, ReplyToTicketRequest>({
            query: ({ id, message }) => ({
                url: `/tickets/${id}/replies`,
                method: "POST",
                body: { message },
            }),
            invalidatesTags: ["Tickets"],
        }),

        // PATCH /tickets/:id/resolve — admin only
        resolveTicket: builder.mutation<ResolveTicketResponse, string>({
            query: (id) => ({
                url: `/tickets/${id}/resolve`,
                method: "PATCH",
            }),
            invalidatesTags: ["Tickets"],
        }),
    }),
    overrideExisting: false,
});

export const {
    useGetTicketsQuery,
    useCreateTicketMutation,
    useReplyToTicketMutation,
    useResolveTicketMutation,
} = ticketApi;