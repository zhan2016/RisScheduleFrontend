export interface EncryptionKey {
    id: string;
    name: string;
    key: string;
    isDefault: boolean;
    status: KeyStatus;
    createdAt: Date;
    updatedAt: Date;
    description?: string;
  }
  
  export enum KeyStatus {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE'
  }