export interface ModuleInfo {
    id: string;
    code: string;
    concurrentLimit: number;
  }
  
  export interface TerminalInfo {
    macAddress: string;
    name: string;
  }
  
  export interface LicenseInfo {
    id: string;
    isPatch: boolean;
    hardwareInfo: string;
    validFrom: string;
    validTo: string;
    concurrentLimit: number;
    hospitalName: string;
    modules: ModuleInfo[];
    terminals: TerminalInfo[];
  }
  
  export interface LicenseStatus {
    isValid: boolean;
    licenseInfo: LicenseInfo;
    hardwareId: string;
  }