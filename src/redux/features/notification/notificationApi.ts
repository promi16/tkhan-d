// src/redux/features/notification/notificationApi.ts

import { baseApi } from "../../hooks/baseApi";
import type {
    NotificationsResponse,
    MarkReadResponse,
    MarkAllReadResponse,
    GetNotificationsParams,
} from "./notificationTypes";

const notificationApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getNotifications: builder.query<NotificationsResponse, GetNotificationsParams>({
            query: ({ page = 1, limit = 20, sortBy = "createdAt", sortOrder = "desc" }) => ({
                url: `/notifications`,
                method: "GET",
                params: { page, limit, sortBy, sortOrder },
            }),
            providesTags: ["Notifications"],
            keepUnusedDataFor: 0, // cache রাখবে না, সবসময় fresh
        }),

        markNotificationRead: builder.mutation<MarkReadResponse, string>({
            query: (id) => ({
                url: `/notifications/${id}/read`,
                method: "PATCH",
            }),
            invalidatesTags: ["Notifications"],
        }),

        markAllNotificationsRead: builder.mutation<MarkAllReadResponse, void>({
            query: () => ({
                url: `/notifications/read-all`,
                method: "PATCH",
            }),
            invalidatesTags: ["Notifications"],
        }),
    }),
    overrideExisting: false,
});

export const {
    useGetNotificationsQuery,
    useMarkNotificationReadMutation,
    useMarkAllNotificationsReadMutation,
} = notificationApi;