// src/redux/features/platformPricing/platformPricingTypes.ts

export interface PlatformPricing {
    id: string;
    serviceChargeAmount: string;
    createdAt: string;
    updatedAt: string;
}

export interface PlatformPricingResponse {
    success: boolean;
    data: PlatformPricing;
}

export interface UpdatePlatformPricingRequest {
    serviceChargeAmount: number;
}