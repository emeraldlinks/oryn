import type { Contact } from "./contact";
import type { QuoteLineItem } from "./quoteLineItem";
import type { Workspace } from "./workspace";

export interface Quote {

 // @auto;primaryKey
  id: number;
 // @index;not null
  workspaceId: number;
 // @index;not null
  contactId: number;
 // @unique;length:50;not null
  quoteNumber: string;
 // @default:draft;enum:(draft,sent,accepted,rejected,expired,cancelled)
  status: string;
  subtotal: number;
 // @default:0
  taxRate: number;
 // @default:0
  taxAmount: number;
 // @default:0
  discountAmount: number;
  total: number;
 // @nullable
  validUntil?: string;
 // @nullable
  sentAt?: string;
 // @nullable
  acceptedAt?: string;
 // @nullable
  notes?: string;
 // @nullable;json
  terms?: string;
  createdAt: string;
  updatedAt: string;

 // @relation manytoone:Workspace;foreignKey:workspaceId
  workspace?: Workspace;
 // @relation manytoone:Contact;foreignKey:contactId
  contact?: Contact;
 // @relation onetomany:QuoteLineItem;foreignKey:quoteId
  lineItems?: QuoteLineItem[];

}
