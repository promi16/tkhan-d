export type GroomerProfile = {
    id: string;
    userId: string;
    businessName: string;
    bio: string | null;
    yearsOfExperience: number | null;
    services: GroomerService[];
    availability: GroomerAvailability[];
    averageRating: number;
    totalReviews: number;
    isApproved: boolean;
    stripeAccountId: string | null;
    createdAt: string;
    updatedAt: string;
};

export type GroomerService = {
    id: string;
    groomerProfileId: string;
    name: string;
    description: string | null;
    price: number;
    durationMinutes: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
};

export type GroomerAvailability = {
    id: string;
    groomerProfileId: string;
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    isAvailable: boolean;
    createdAt: string;
    updatedAt: string;
};


export type User = {
    id: string;
    fullName: string;
    phone: string;
    email: string;
    profileImage: string | null;
    locationText: string;
    state: string;
    role: "ADMIN";
    emailVerified: boolean;
    emailVerificationToken: string | null;
    emailVerificationExpiresAt: string | null;
    status: "ACTIVE" | "INACTIVE" | "SUSPENDED";
    isBlocked: boolean;
    passwordResetExpiresAt: string | null;
    createdAt: string;
    updatedAt: string;
    groomerProfile: GroomerProfile | null;
};


export type LoginResponse = {
    success: boolean;
    data: {
        user: User;
        accessToken: string;
        refreshToken: string;
    };
};

export type TAuth = {
    user: User | null;
    token: string | null;
    refreshToken: string | null;
};

export type LoginRequest = {
    email: string;
    password: string;
};

export type RegisterRequest = {
    fullName: string;
    email: string;
    password: string;
    phone: string;
};

export type RegisterResponse = {
    success: boolean;
    message: string;
    data: {
        user: User;
        accessToken: string;
        refreshToken: string;
    };
};