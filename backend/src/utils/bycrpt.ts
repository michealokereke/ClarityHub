import { hash, compare } from "bcryptjs";

export const hashPassword = async (password: string, saltRounds: number) =>
  await hash(password, saltRounds);

export const comparePassword = async (password: string, passwordHash: string) =>
  await compare(password, passwordHash);
