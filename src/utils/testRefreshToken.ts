// src/utils/testRefreshToken.ts

import Cookies from "js-cookie";

export const testRefreshToken = async () => {
    const refreshToken = Cookies.get("refreshToken");

    if (!refreshToken) {
        console.log("No refresh token found");
        return;
    }

    try {
        const response = await fetch(`${import.meta.env.VITE_API_ENDPOINT}/auth/refresh`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ refreshToken }),
        });

        const data = await response.json();

        if (response.ok) {
            console.log("Refresh token successful:", data);
            // Store new tokens
            if (data.data?.accessToken) {
                Cookies.set("token", data.data.accessToken, { expires: 7 });
                if (data.data?.refreshToken) {
                    Cookies.set("refreshToken", data.data.refreshToken, { expires: 30 });
                }
            }
            return data;
        } else {
            console.error("Refresh token failed:", data);
            return null;
        }
    } catch (error) {
        console.error("Error testing refresh token:", error);
        return null;
    }
};