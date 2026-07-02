import type { Workspace } from "./workspace";

export interface BrandingConfig {

 // @auto;primaryKey
  id: number;
 // @index;not null
  workspaceId: number;
 // @nullable
  logoUrl?: string;
 // @length:7;nullable
  primaryColor?: string;
 // @length:7;nullable
  secondaryColor?: string;
 // @nullable
  faviconUrl?: string;
 // @nullable
  customCss?: string;
 // @nullable
  customJs?: string;
 // @length:200;nullable
  companyName?: string;
  createdAt: string;
  updatedAt: string;

 // @relation manytoone:Workspace;foreignKey:workspaceId
  workspace?: Workspace;

}
