import User from "../Models/User.model";
import { IUser } from "../Models/User.model";

export const createUser = async (user: Object): Promise<IUser> => {
  const newUSer = await new User(user);
  await newUSer.save();
  return newUSer;
};
