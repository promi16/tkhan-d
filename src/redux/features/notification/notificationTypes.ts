// src/redux/features/notification/notificationTypes.ts

export interface NotificationData {
    bookingId?: string;
    bookingNumber?: string;
    conversationId?: string;
    [key: string]: unknown;
}

export interface Notification {
    id: string;
    userId: string;
    type:
    | "BOOKING_ACCEPTED"
    | "BOOKING_COMPLETED"
    | "PAYMENT_SUCCESS"
    | "GROOMER_APPROVED"
    | "NEW_MESSAGE"
    | string;
    title: string;
    body: string;
    data: NotificationData;
    readAt: string | null;
    createdAt: string;
}

export interface NotificationMeta {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface NotificationsResponse {
    success: boolean;
    data: {
        items: Notification[];
        meta: NotificationMeta;
    };
}

export interface MarkReadResponse {
    success: boolean;
    data: Notification;
}

export interface MarkAllReadResponse {
    success: boolean;
    data: {
        count: number;
    };
}

export interface GetNotificationsParams {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
}