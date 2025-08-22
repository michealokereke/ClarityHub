import { Types } from "mongoose";
import User from "../Models/User.model";

export const userExist = async (email: string) => User.exists({ email });

export const findOne = async (email: string) => User.findOne({ email });

export const findById = async (id: Types.ObjectId) => User.findById(id);

export enum userStatus {
  ACTIVE = "active",
  INVITED = "invited",
  DISABLED = "disabled",
}

export interface userDocTypes {
  email: string;
  password: string;
  status: userStatus;
  tenantId: Types.ObjectId;
  profile: {
    name: string;
  };
}

export const createUser = async (user: userDocTypes) => {
  const newUSer = await new User(user);
  await newUSer.save();
  return newUSer;
};
