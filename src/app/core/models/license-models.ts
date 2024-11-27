import { KeyStatus, LicenseEdition } from "./common-models";

  
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
    licenseEdition: string;
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

  export interface LicenseModuleInfo {
    name:string;
    id: string;
    code: string;
  }

  export interface LicenseTerminal {
    id: string;
    name: string;
    macAddress: string;
  }
  export interface LicenseModuleRequest {
    moduleId: string;  // 假设是UUID，如果是其他类型可以调整
    code: string;
  }

  export interface PatchLicenseInfo {
    id: string;
    validFrom: Date;
    validTo: Date;
    concurrentLimit: number;
    downloadUrl: string;
    createdAt?: Date;
    terminals: LicenseTerminal[];
  }

  export interface LicenseQueryResponse {
    id: string;
    hospitalName: string;
    softwareId: string;
    downloadUrl: string
    software: { name: string, authType:string };
    concurrentLimit: number;
    validFrom: Date;
    validTo: Date;
    licenseType: string;
    licenseEdition: string;
    status: string;
    createdAt: Date;
    terminals: LicenseTerminal[];
    modules: LicenseModuleInfo[],
    patchLicenses?: PatchLicenseInfo[];
    expanded: boolean;
  }

  export interface LicenseRequest {
    hospitalName: string;
    softwareId: string;  // 假设是UUID，如果是其他类型可以调整
    softwareCode: string;  // 假设是UUID，如果是其他类型可以调整
    licenseEdition: LicenseEdition;  // 新增授权版本字段
    authType: string;  // 可以考虑使用枚举
    concurrentLimit: number;
    validFrom: Date;
    validTo: Date;
    systemTerminals?: LicenseTerminal[];  // 可选，因为只有在终端授权时才需要
    modules: LicenseModuleRequest[];
  }
  
 


  export interface LicensePatchRequest {
    validFrom: Date;
    validTo: Date;
    concurrentLimit?: number;
    systemTerminals?: LicenseTerminal[];  // 可选，因为只有在终端授权时才需要
    modules: LicenseModuleRequest[];
  }