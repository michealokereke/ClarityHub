import crypto, { createHash } from "crypto";

export const sha256 = (token: string) => {
  return createHash("sha256").update(token).digest("hex");
};

export const compareSha256 = (token: string, tokenHash: string) => {
  const newTokenHAsh = sha256(token);
  if (newTokenHAsh === tokenHash) return true;
  else return false;
};
