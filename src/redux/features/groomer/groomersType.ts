// src/redux/features/groomers/groomersType.ts

export interface GroomerUser {
    id: string;
    fullName: string;
    phone: string;
    email: string;
    profileImage: string | null;
    locationText: string;
    state: string;
    role: string;
    emailVerified: boolean;
    status: string;
    isBlocked: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface Certification {
    certificateTitle: string;
    issuingOrganization: string;
}

export interface GroomerProfile {
    id: string;
    userId: string;
    experienceYears: number;
    legalFullName: string;
    idNumber: string;
    idType: string;
    businessName: string;
    serviceArea: string;
    businessAddress: string;
    idFrontImage: string | null;
    idBackImage: string | null;
    selfieWithId: string | null;
    shortBio: string | null;
    about: string | null;
    certifications: Certification[];
    serviceModes: string[];
    availableForBookings: boolean;
    approvalStatus: "PENDING" | "APPROVED" | "REJECTED";
    rejectionReason: string | null;
    approvedAt: string | null;
    approvedById: string | null;
    createdAt: string;
    updatedAt: string;
    user: GroomerUser;
}

export interface PendingGroomersResponse {
    success: boolean;
    data: GroomerProfile[];
}

export interface GroomerActionResponse {
    success: boolean;
    data: GroomerProfile;
}

export interface RejectGroomerRequest {
    id: string;
    reason: string;
}