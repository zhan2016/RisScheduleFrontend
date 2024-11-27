export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    pageSize: number;
  }
  export enum KeyStatus {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
    EXPIRED = 'EXPIRED',
    REVOKED = 'REVOKED',
  }
  export enum LicenseType {
    MAIN = 'MAIN',
    PATCH = 'PATCH'
  }
  export enum LicenseEdition {
    TRIAL = 'TRIAL',
    STANDARD = 'STANDARD',
    ENTERPRISE = 'ENTERPRISE',
    DEMO = 'DEMO' 
  }
  