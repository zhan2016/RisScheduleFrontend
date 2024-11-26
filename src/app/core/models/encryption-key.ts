import { KeyStatus } from "./common-models";
import { User } from "./user-manage";

export interface UserBaseDto {
    id: string,
    name: string
}
export interface EncryptionKey {
    id: string;
  name: string;
  publicKey: string;
  privateKey: string;
  keySize: number;
  isDefault: boolean;
  status: KeyStatus;
  description?: string;
  createdById: string;
  createdBy?: UserBaseDto;
  updatedById?: string;
  updatedBy?: UserBaseDto;
  validFrom: Date;
  validTo: Date;
  createdAt: Date;
  updatedAt?: Date;
  }
  
