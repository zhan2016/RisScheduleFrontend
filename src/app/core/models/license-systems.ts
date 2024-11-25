import { EncryptionKey } from "./encryption-key";
import { Module } from "./license-module";

export enum SystemStatus {
    ACTIVE = 'active',
    INACTIVE = 'inactive'
  }
  
  export enum SystemAuthorizationType {
    CONCURRENT = 'concurrent',    // 按并发
    TERMINAL = 'terminal',       // 按终端
    BOTH = 'both'               // 均可
  }
  
  export interface System {
    id: number;
    name: string;
    description?: string;
    status: SystemStatus;
    modules: Module[];
    maxConcurrent: number;
    independentAuth: boolean;     // 单独授权
    authType: SystemAuthorizationType;  // 授权类型
    createdAt: Date;
    createdBy: string;
    updatedAt?: Date;
    updatedBy?: string;
    encryptionKeyId?: string;
    encryptionKey?: EncryptionKey;
  }
  
  export interface CreateSystemDto {
    name: string;
    description?: string;
    status: SystemStatus;
    maxConcurrent: number;
    independentAuth: boolean;
    authType: SystemAuthorizationType;
  }
  
  export interface UpdateSystemDto {
    name?: string;
    description?: string;
    status?: SystemStatus;
    maxConcurrent?: number;
    independentAuth?: boolean;
    authType?: SystemAuthorizationType;
  }
  