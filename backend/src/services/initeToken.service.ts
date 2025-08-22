import { InviteTokenModel } from "../Models/InviteToken.model";

export const createInviteToken = async (tokenDocs: {
  token: string;
  email: string;
  role: string;
  tenantId: string;
  expiresAt: Date;
  createdBy: string;
}) => {
  const inviteToken = await new InviteTokenModel(tokenDocs);
  await inviteToken.save();

  return inviteToken;
};
