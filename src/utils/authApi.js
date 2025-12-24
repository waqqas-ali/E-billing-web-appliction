import axiosInstance from "./axiosInstance";
import { getRefreshToken } from "./tokenService";

export const refreshAccessToken = async () => {
  const refreshToken = getRefreshToken();

  if (!refreshToken) {
    throw new Error("Refresh token missing");
  }

  const response = await axiosInstance.post(
    "/get/access-token/by/refresh-token",
    { refreshToken }
  );

  return response.data.accessToken;
};
