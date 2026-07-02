import type { User } from "./user";

export interface TwoFactorSetting {

 // @auto;primaryKey
  id?: number;
 // @unique;index;not null
  userId: number;
 // @default:false
  enabled: boolean;
 // @nullable
  secret?: string;
 // @nullable;json
  backupCodes?: string[];
 // @nullable
  verifiedAt?: string;
  createdAt?: string;
  updatedAt?: string;

 // @relation onetoone:User;foreignKey:userId
  user?: User;

}
