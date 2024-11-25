// 授权类型枚举
export enum AuthorizationType {
    CONCURRENT = 'concurrent', // 按并发数授权
    TERMINAL = 'terminal',    // 按终端数授权
    BOTH = 'both'            // 两种方式都支持
  }
  // 模块状态
export enum ModuleStatus {
    ACTIVE = 'active',       // 激活可用
    INACTIVE = 'inactive'    // 未激活/禁用
  }

  export interface Module {
    // 基础信息
    id: string;
    systemId: string;
    name: string;
    description?: string;
    
    // 授权相关
    independentAuth: boolean;         // 是否单独授权
    authType: AuthorizationType;      // 授权类型
    status: ModuleStatus;            // 模块状态
    
    // 审计字段
    createdAt: string;               // 创建时间
    updatedAt: string;               // 修改时间
    createdBy: string;               // 创建人账号
    updatedBy: string;               // 修改人账号
  }
  

// 创建模块的请求参数接口
export interface CreateModuleDto {
    systemId: string;
    name: string;
    description?: string;
    independentAuth: boolean;
    authType: AuthorizationType;
    status?: ModuleStatus;           // 可选，默认为激活状态
  }
  
  // 更新模块的请求参数接口
  export interface UpdateModuleDto {
    name?: string;
    description?: string;
    independentAuth?: boolean;
    authType?: AuthorizationType;
    status?: ModuleStatus;
  }
  
  // 模块查询参数接口
  export interface ModuleQuery {
    systemId?: string;
    name?: string;
    status?: ModuleStatus | null;  // 修改这里，允许 null 值
    authType?: AuthorizationType | null;  // 修改这里，允许 null 值
    independentAuth?: boolean;
    startTime?: string;
    endTime?: string;
    createdBy?: string;
  }