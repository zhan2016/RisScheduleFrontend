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
  export interface ExamUser {
    userId: string,
    userName: string,
    userRole?: string,
    
  }
  export const statusMap = {
  '0': '取消检查',
  '3': '报告退费',
  '10': '申请预约',
  '20': '预约确认',
  '25': '已叫号',
  '30': '检查确认',
  '35': '检查完成',
  '38': '未写报告',
  '40': '初步报告',
  '44': '审核未通过报告',
  '45': '审核报告',
  '50': '确认报告'
};