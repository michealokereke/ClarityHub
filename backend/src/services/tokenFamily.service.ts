import { Types } from "mongoose";
import { TokenFamilyModel } from "../Models/TokenFamily.model";

export interface refreshTokenFamilyType {
  userId: Types.ObjectId;
  tenantId: Types.ObjectId | string;
  familyId: string;
  currentTokenId: string;
}

export const createRefreshTokenFamily = async (
  tokenFamily: refreshTokenFamilyType
) => {
  const refreshTokenFamily = await new TokenFamilyModel(tokenFamily);
  await refreshTokenFamily.save();
  return refreshTokenFamily;
};

export const findRefreshTokenFamilyByUserId = async (userId: Types.ObjectId) =>
  TokenFamilyModel.findOne({ userId });

export const findRefreshFamilyToken = async (params: {
  userId: string;
  familyId: string;
}) => TokenFamilyModel.findOne(params);
