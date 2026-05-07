
export interface AddParcelPayload {
  type: "REGULAR" | "EXPRESS";
  name: string;
  weight: number;
  length: number;
  height: number;
  width: number;
  description: string;
  customerId: string;
  addressId: string;
  invoice?: string | null;
  notes?: string | null;
}

export interface Parcel {
  id: string;
  marchentId: string;
  type: "REGULAR" | "EXPRESS";
  name: string;
  weight: string;
  length: string;
  width: string;
  height: string;
  description: string;
  customerId: string;
  addressId: string;
  invoice: string | null;
  notes: string | null;
  trackingId: string;
  shipdayOrderId: number | null;
  trackingLink: string | null;
  status: "PENDING" | "PROCESSING" | "DELIVERED" | "CANCELLED";
  deliveryStatus: "PENDING" | "IN_TRANSIT" | "DELIVERED" | "FAILED";
  amount: number;
  paymentStatus: "PENDING" | "PAID" | "FAILED";
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
  customar: {
    id: string;
    marchentId: string;
    Name: string;
    Email: string;
    Phone: string;
    ShippingAddress: string;
    BillingAddress: string;
    postalCode: string;
    createdAt: string;
    updatedAt: string;
    isDeleted: boolean;
  };
  address: {
    id: string;
    marchentId: string;
    addressName: string;
    streetName: string;
    cityOrSuburb: string;
    postalCode: string;
    country: string;
    phoneNumber: string;
    additionalNotes: string;
    createdAt: string;
    updatedAt: string;
    isDeleted: boolean;
  };
}

export interface MetaData {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface CardData {
  totalPending: number;
  todayPending: number;
  totalDelivered: number;
  todayDelivered: number;
}

export interface ParcelListResponse {
  success: boolean;
  message: string;
  data: {
    data: Parcel[];
    meta: MetaData;
    cardData: CardData;
  };
}

export interface SingleParcelResponse {
  success: boolean;
  message: string;
  data: Parcel;
}

export interface AddParcelResponse {
  success: boolean;
  message: string;
  data: {
    paymentUrl: string;
  };
}

export interface DeleteParcelResponse {
  success: boolean;
  message: string;
}