export interface OfflineActivation {
    id: string;
    licenseId: string;
    encryptionKeyId: string | null;
    machineCode: string;
    activationCode: string | null;
    hospitalName: string;
    hospitalCode: string | null;
    department: string | null;
    validFrom: Date;
    validTo: Date;
    isActivated: boolean;
    activatedAt: Date | null;
    hardwareHash: string | null;
    ipAddress: string | null;
    createdAt: Date;
    updatedAt: Date;
    
    // 关联的模块信息
    modules?: {
      softwareId: string;
      moduleIds: string[];
    };
  }
  
  export interface ActivationQuery {
    hospitalName?: string;
    moduleId?: string;
    softwareId?: string;
    keyword?: string;
    isActivated?: boolean;
    dateRange?: [Date, Date];
    pageIndex: number;
    pageSize: number;
  }

  export interface BatchActivationRequest {
    machineCodes: string[];
    licenseId: string;  // Guid 在前端用 string 表示
    softwareId: string;
    moduleIds: string[];
    moduleCodes: string[];
    hospitalName: string;
    hospitalCode?: string; // 可选字段
    department?: string;   // 可选字段
    validTo: Date;
  }
  // 批量激活结果接口
export interface BatchActivationResult {
    machineCode: string;
    activationCode: string;
    success: boolean;
    message?: string;
  }

  export interface OfflineActivationResponse {
    id: string;  // Guid in C# maps to string in TypeScript
    licenseId: string;
    encryptionKeyId: string | null;
    machineCode: string;
    activationCode: string | null;
    hospitalName: string;
    hospitalCode: string | null;
    department: string | null;
    validFrom: string;  // DateTime maps to string in TypeScript
    validTo: string;
    isActivated: boolean | null;
    activatedAt: string | null;
    hardwareHash: string | null;
    ipAddress: string | null;
    createdAt: string | null;
    updatedAt: string | null;
    softwareName: string;
    modulesName: string[];  // List<string> maps to string[] in TypeScript
}