import { KeyStatus } from "./common-models";

export interface User {
    id: number;
    username: string;
    realName: string;
    email: string;
    phone: string;
    roleId: 'admin' | 'user';
    status: KeyStatus;
    validFrom: Date;
    validTo: Date;
    createdAt: Date;
    updatedAt: Date;
  }
  
  export interface UserQuota {
    id: string;
    userId: number;
    systemId: number;
    moduleId: number;
    terminalLimit: number;  // 终端数量限制
    concurrentLimit: number;  // 并发数限制
    hospitalLimit: number;  // 医院数量限制
    validTo: Date;  // 最长授权时间
    allocated: number;  // 已分配数量
    remaining: number;  // 剩余可用数量
    systemName: string;   // 添加这个
    moduleName: string;   // 添加这个
  }
  
  export interface QuotaRequest {
    id: number;
    userId: number;
    systemId: number;
    moduleId: number;
    requestedTerminalCount: number;
    requestedConcurrentCount: number;
    requestedHospitalCount: number;
    requestedValidUntil: Date;
    status: 'pending' | 'approved' | 'rejected';
    reason?: string;
    createdAt: Date;
    // 其他申请相关字段
  }
