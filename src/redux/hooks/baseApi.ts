// src/redux/hooks/baseApi.ts

import {
  createApi,
  fetchBaseQuery,
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  QueryReturnValue,
} from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";

interface RefreshResponse {
  data: {
    accessToken: string;
    refreshToken?: string;
  };
}

interface FailedRequest {
  resolve: (token: string | null) => void;
  reject: (error: FetchBaseQueryError | Error) => void;
}

const baseURL = import.meta.env.VITE_API_ENDPOINT;

if (!baseURL) {
  throw new Error("VITE_API_ENDPOINT is not defined in environment variables");
}

const isDev = import.meta.env.DEV;

let isRefreshing = false;
let failedQueue: FailedRequest[] = [];

const processQueue = (
  error: FetchBaseQueryError | Error | null = null,
  token: string | null = null
) => {
  failedQueue.forEach((p) => (error ? p.reject(error) : p.resolve(token)));
  failedQueue = [];
};

const FORM_DATA_ENDPOINTS = ["createCategory", "updateCategory"];

const rawBaseQuery = fetchBaseQuery({
  baseUrl: baseURL,
  credentials: "include",
  prepareHeaders: (headers, { endpoint }) => {
    const token = Cookies.get("token");
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    if (!FORM_DATA_ENDPOINTS.includes(endpoint)) {
      headers.set("Content-Type", "application/json");
      headers.set("Accept", "application/json");
    }

    return headers;
  },
});

type RawBaseQueryResult = QueryReturnValue<unknown, FetchBaseQueryError, object>;

const baseQueryWithRefreshToken: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions): Promise<RawBaseQueryResult> => {
  if (isDev) {
    console.log("[API Request]", {
      url: typeof args === "string" ? args : args.url,
      method: typeof args === "string" ? "GET" : (args.method ?? "GET"),
    });
  }

  const firstResult = await rawBaseQuery(args, api, extraOptions);

  if (isDev && firstResult.error) {
    console.error("[API Error]", firstResult.error.status, firstResult.error.data);
  }

  if (firstResult.error?.status !== 401) return firstResult;

  const refreshToken = Cookies.get("refreshToken");

  if (!refreshToken) {
    Cookies.remove("token");
    Cookies.remove("refreshToken");
    return firstResult;
  }

  if (isRefreshing) {
    try {
      const token = await new Promise<string | null>((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      });

      const retryArgs: FetchArgs =
        typeof args === "string"
          ? { url: args, headers: { Authorization: `Bearer ${token}` } }
          : {
            ...args,
            headers: {
              ...(args.headers ?? {}),
              Authorization: `Bearer ${token}`,
            },
          };

      return await rawBaseQuery(retryArgs, api, extraOptions);
    } catch (err) {
      return { error: err as FetchBaseQueryError };
    }
  }

  isRefreshing = true;

  try {
    const refreshResult = await rawBaseQuery(
      {
        url: "/auth/refresh",
        method: "POST",
        body: { refreshToken },
        headers: { "Content-Type": "application/json" },
      },
      api,
      extraOptions
    );

    if (!refreshResult.data) {
      const error = refreshResult.error as FetchBaseQueryError;
      processQueue(error, null);
      Cookies.remove("token");
      Cookies.remove("refreshToken");
      return firstResult;
    }

    const responseData = refreshResult.data as RefreshResponse;
    const newAccessToken = responseData.data?.accessToken;
    const newRefreshToken = responseData.data?.refreshToken;

    if (!newAccessToken) {
      throw new Error("No access token in refresh response");
    }

    Cookies.set("token", newAccessToken, {
      expires: 7,
      secure: true,
      sameSite: "lax",
    });

    if (newRefreshToken) {
      Cookies.set("refreshToken", newRefreshToken, {
        expires: 30,
        secure: true,
        sameSite: "lax",
      });
    }

    processQueue(null, newAccessToken);

    const retryArgs: FetchArgs =
      typeof args === "string"
        ? {
          url: args,
          headers: {
            Authorization: `Bearer ${newAccessToken}`,
            "Content-Type": "application/json",
          },
        }
        : {
          ...args,
          headers: {
            ...(args.headers ?? {}),
            Authorization: `Bearer ${newAccessToken}`,
            "Content-Type": "application/json",
          },
        };

    return await rawBaseQuery(retryArgs, api, extraOptions);
  } catch (error) {
    processQueue(error as Error, null);
    Cookies.remove("token");
    Cookies.remove("refreshToken");
    return firstResult;
  } finally {
    isRefreshing = false;
  }
};

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: baseQueryWithRefreshToken,
  keepUnusedDataFor: 60,
  tagTypes: [
    "User",
    "Groomers",
    "PendingGroomers",
    "Dashboard",
    "Payments",
    "Notifications",
    "Tickets",
    "PayoutRequests",
    "Reviews",
    "Bookings",
    "Categories",
    "PlatformPricing",
  ],
  endpoints: () => ({}),
});