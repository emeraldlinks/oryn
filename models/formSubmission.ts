import type { Contact } from "./contact";
import type { Form } from "./form";

export interface FormSubmission {

 // @auto;primaryKey
  id: number;
 // @index;not null
  formId: number;
 // @json;not null
  data: Record<string, unknown>;
 // @nullable;index
  contactId?: number;
  createdAt: string;
  updatedAt: string;

 // @relation manytoone:Form;foreignKey:formId;onDelete:CASCADE
  form?: Form;
 // @relation manytoone:Contact;foreignKey:contactId
  contact?: Contact;

}
