import { KeyStatus } from "./common-models";

  
 export interface Terminal {
    id: string;
    macAddress: string;
    description?: string;
    createdAt: Date
  }
  
  export interface License {
    id: string;
    hospitalName: string;
    systemId: number;
    moduleIds: number[];
    patchLicenseCount?: number;
    concurrentLimit: number;
    terminals: Terminal[];
    validFrom: Date;
    validTo: Date;
    createdBy: string;
    createdAt: Date;
    licenseType: 'MAIN' | 'PATCH';
    parentLicenseId?: string;  // 如果是patch授权，关联主授权ID
    status: KeyStatus;
    downloadUrl?: string;
  }
  