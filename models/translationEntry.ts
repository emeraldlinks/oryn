import type { LanguagePack } from "./languagePack";
import type { User } from "./user";
import type { Workspace } from "./workspace";

export interface TranslationEntry {

 // @auto;primaryKey
  id?: number;
 // @index;not null
  workspaceId: number;
 // @index;not null
  languagePackId: number;
 // @length:200;not null
  key: string;
 // @not null
  value: string;
 // @length:100;nullable
  namespace?: string;
 // @nullable
  approvedById?: number;
  createdAt?: string;
  updatedAt?: string;

 // @relation manytoone:Workspace;foreignKey:workspaceId
  workspace?: Workspace;
 // @relation manytoone:LanguagePack;foreignKey:languagePackId;onDelete:CASCADE
  languagePack?: LanguagePack;
 // @relation manytoone:User;foreignKey:approvedById
  approvedBy?: User;

}
