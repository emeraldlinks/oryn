import type { User } from "./user";

export interface UserDevice {

 // @auto;primaryKey
  id: number;
 // @index;not null
  userId: number;
 // @length:200;not null
  deviceName: string;
 // @length:100;not null
  deviceType: string;
 // @length:200;not null
  userAgent: string;
 // @length:50;not null
  ipAddress: string;
 // @nullable
  lastUsedAt?: string;
 // @default:true
  trusted: boolean;
  createdAt: string;
  updatedAt: string;

 // @relation manytoone:User;foreignKey:userId
  user?: User;

}
