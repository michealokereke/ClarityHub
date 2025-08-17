import User from "../Models/User.model";
import RefreshTokenModel from "../Models/refreshToken.model";

export const userExist = async (email: string) => await User.exists({ email });

export const findOne = async (email: string) => await User.findOne({ email });

export const findById = async (id: string) => await User.findById(id);

export const findDBRefreshTokenDoc = async (token: string) =>
  await RefreshTokenModel.findOne({ token });
