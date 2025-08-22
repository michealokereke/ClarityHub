import { TenantModel } from "../Models/Tenant.model";

export const createWorkSpace = async (workspace: string) => {
  const name = workspace;
  const TenantWorkspace = await new TenantModel({ name });
  await TenantWorkspace.save();
  return TenantWorkspace;
};
