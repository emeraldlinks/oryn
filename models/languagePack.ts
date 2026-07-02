import type { Workspace } from "./workspace";

export interface LanguagePack {

 // @auto;primaryKey
  id?: number;
 // @index;not null
  workspaceId: number;
 // @length:10;not null
  locale: string;
 // @length:100;not null
  name: string;
 // @length:100;nullable
  nativeName?: string;
 // @default:false
  isRtl: boolean;
 // @default:false
  isDefault: boolean;
 // @default:true
  active: boolean;
  createdAt?: string;
  updatedAt?: string;

 // @relation manytoone:Workspace;foreignKey:workspaceId
  workspace?: Workspace;

}
