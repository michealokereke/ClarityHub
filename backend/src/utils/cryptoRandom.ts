import crypto from "crypto";

export const generateRandomCryptoToken = () =>
  crypto.randomBytes(32).toString("hex");
