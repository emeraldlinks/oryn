import type { Workspace } from "./workspace";

export interface HiringMetric {

 // @auto;primaryKey
  id?: number;
 // @index;not null
  workspaceId: number;
 // @length:100;not null
  name: string;
 // @length:200;nullable
  description?: string;
 // @length:50;not null;enum:(experience,education,skills,certification,stability,communication,leadership,cultural,custom)
  category: string;
 // @default:5
  maxScore: number;
 // @default:5
  weight: number;
 // @default:true
  enabled: boolean;
 // @nullable;json
  config?: any;
 // @default:0
  sortOrder: number;
  createdAt?: string;
  updatedAt?: string;

 // @relation manytoone:Workspace;foreignKey:workspaceId
  workspace?: Workspace;

}
