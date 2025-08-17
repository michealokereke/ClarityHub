import RefreshTokenModel from "../Models/refreshToken.model";

export const storeToken = async (
  userId: string,
  token: string,
  fingerPrint: string
) => {
  const data = {
    userId,
    token,
    fingerPrint,
    revoked: false,
  };
  const storedRefreshToken = await new RefreshTokenModel(data);
  storedRefreshToken.save();
  return storedRefreshToken;
};
