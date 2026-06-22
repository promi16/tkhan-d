// src/components/TestRefreshToken.tsx
import React, { useState } from "react";
import { testRefreshToken } from "@/utils/testRefreshToken";
import { useRefreshTokenMutation } from "@/redux/features/auth/authApi";

export const TestRefreshToken: React.FC = () => {
  const [refreshToken, { isLoading }] = useRefreshTokenMutation();
  const [status, setStatus] = useState<string>("");

  const handleTestWithRTKQuery = async () => {
    const refreshTokenFromCookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith("refreshToken="))
      ?.split("=")[1];

    if (!refreshTokenFromCookie) {
      setStatus("No refresh token found in cookies");
      return;
    }

    try {
      const result = await refreshToken({
        refreshToken: refreshTokenFromCookie,
      }).unwrap();
      setStatus("Success: " + JSON.stringify(result));
      console.log("Refresh token result:", result);
    } catch (error) {
      setStatus("Error: " + JSON.stringify(error));
      console.error("Refresh token error:", error);
    }
  };

  const handleTestWithFetch = async () => {
    const result = await testRefreshToken();
    if (result) {
      setStatus("Success: Token refreshed!");
    } else {
      setStatus("Failed to refresh token");
    }
  };

  return (
    <div className="p-4">
      <h3>Test Refresh Token</h3>
      <div className="space-x-2">
        <button
          onClick={handleTestWithRTKQuery}
          disabled={isLoading}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          {isLoading ? "Refreshing..." : "Test with RTK Query"}
        </button>
        <button
          onClick={handleTestWithFetch}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Test with Fetch
        </button>
      </div>
      {status && (
        <pre className="mt-4 p-2 bg-gray-100 rounded overflow-auto">
          {status}
        </pre>
      )}
    </div>
  );
};
