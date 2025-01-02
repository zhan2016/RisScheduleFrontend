export interface ServiceControlRecord {
    id: number;
    serviceName: string;
    action: string;
    operator: string;
    timestamp: Date;
    result: string;
  }
  
  export interface ControlledServiceInfo {
    serviceName: string;
    displayName: string;
    description: string;
    isRunning: boolean;
    isLicenseValid: boolean;
    isManuallyEnabled: boolean;
    state: ServiceState;
    loading?: boolean;
    lastStateChange?: Date;
    recentRecords: ServiceControlRecord[];
  }
  
  export interface ServiceOverallStatus {
    totalCount: number;
    runningCount: number;
    stoppedCount: number;
    licenseValidCount: number;
    enabledCount: number;
    allServicesRunning: boolean;
    allServicesStopped: boolean;
    services: ControlledServiceInfo[];
  }
  
  export interface ControlAllServicesResult {
    overallSuccess: boolean;
    details: ServiceControlResult[];
  }
  
  export interface ServiceControlResult {
    serviceName: string;
    displayName: string;
    success: boolean;
    errorMessage?: string;
  }
  export enum ServiceState {
    Stopped = 0,
    Starting = 1,
    Running = 2,
    Stopping = 3,
    Failed = 4
  }