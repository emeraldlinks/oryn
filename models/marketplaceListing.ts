
export interface MarketplaceListing {

 // @auto;primaryKey
  id?: number;
 // @length:50;not null
  type: string;
 // @length:200;not null
  name: string;
 // @nullable
  description?: string;
 // @length:100;not null
  version: string;
 // @length:200;nullable
  author?: string;
 // @length:200;nullable
  publisher?: string;
 // @nullable
  iconUrl?: string;
 // @json;not null
  config: Record<string, unknown>;
 // @default:false
  verified: boolean;
 // @default:true
  published: boolean;
 // @default:0
  installCount: number;
 // @default:0
  rating: number;
 // @default:0
  reviewCount: number;
 // @default:false
  featured: boolean;
 // @json;nullable
  categories?: string[];
 // @json;nullable
  tags?: string[];
  createdAt?: string;
  updatedAt?: string;

}
