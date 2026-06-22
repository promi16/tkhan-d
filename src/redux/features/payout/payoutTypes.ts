// src/redux/features/payout/payoutTypes.ts

// ✅ Booking inside payout
export interface PayoutBooking {
    id: string;
    bookingNumber: string;
    buyerId: string;
    groomerId: string;
    serviceLocation: string;
    addressLine: string;
    state: string;
    city: string;
    status: string;
    subtotalAmount: string;
    serviceChargeAmount: string;
    platformFeeAmount: string;
    groomerEarningAmount: string;
    totalAmount: string;
    completedAt: string | null;
    createdAt: string;
}

// ✅ Groomer user inside payout
export interface PayoutGroomerUser {
    id: string;
    fullName: string;
    phone: string;
    email: string;
    profileImage: string | null;
    locationText: string;
    state: string;
    role: string;
    status: string;
}


export type WithdrawalStatus = "REQUESTED" | "APPROVED" | "REJECTED" | "PAID";
export interface PayoutGroomer {
    id: string;
    userId: string;
    legalFullName: string;
    businessName: string;
    serviceArea: string;
    approvalStatus: string;
    user: PayoutGroomerUser;
}

// ✅ Withdrawal request (nested in payout)
export interface WithdrawalRequestNested {
    id: string;
    amountRequested: string;
    amountPaid: string | null;
    status: "REQUESTED" | "APPROVED" | "REJECTED" | "PAID";
    requestedAt: string;
    paidAt: string | null;
}

// ✅ Withdrawal item inside payout
export interface PayoutWithdrawalItem {
    id: string;
    withdrawalRequestId: string;
    payoutId: string;
    allocatedAmount: string;
    createdAt: string;
    withdrawalRequest: WithdrawalRequestNested;
}

// ✅ Single Payout (from GET /payouts)
export interface Payout {
    id: string;
    bookingId: string;
    groomerId: string;
    amount: string;
    platformFee: string;
    currency: string;
    createdAt: string;
    updatedAt: string;
    booking: PayoutBooking;
    groomer: PayoutGroomer;
    withdrawalItems: PayoutWithdrawalItem[];
}

export interface PayoutsResponse {
    success: boolean;
    data: Payout[];
}

// ✅ Bank Account inside withdrawal request
export interface BankAccount {
    id: string;
    groomerId: string;
    accountHolderName: string;
    bankName: string;
    accountNumber: string;
    branchName: string | null;
    routingNumber: string;
    mobileBankingType: string | null;
    isDefault: boolean;
    createdAt: string;
    updatedAt: string;
}

// ✅ Payout item inside withdrawal request
export interface WithdrawalPayoutItem {
    id: string;
    withdrawalRequestId: string;
    payoutId: string;
    allocatedAmount: string;
    createdAt: string;
    payout: {
        id: string;
        bookingId: string;
        amount: string;
        platformFee: string;
        currency: string;
        booking: PayoutBooking;
    };
}

// ✅ Single Withdrawal Request (from GET /withdrawal-requests)
export interface WithdrawalRequest {
    id: string;
    groomerId: string;
    bankAccountId: string;
    amountRequested: string;
    amountPaid: string | null;
    currency: string;
    status: "REQUESTED" | "APPROVED" | "REJECTED" | "PAID";
    adminNote: string | null;
    transferReference: string | null;
    requestedAt: string;
    reviewedAt: string | null;
    paidAt: string | null;
    createdAt: string;
    updatedAt: string;
    bankAccount: BankAccount;
    groomer: PayoutGroomer;
    items: WithdrawalPayoutItem[];
}

export interface WithdrawalRequestsResponse {
    success: boolean;
    data: {
        items: WithdrawalRequest[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    };
}

export interface WithdrawalRequestSingleResponse {
    success: boolean;
    data: WithdrawalRequest;
}

// ✅ Action request bodies
export interface ApproveWithdrawalRequest {
    note?: string;
}

export interface RejectWithdrawalRequest {
    reason: string;
}

export interface MarkPaidWithdrawalRequest {
    transferReference: string;
    note?: string;
}