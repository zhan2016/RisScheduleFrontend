import { KeyStatus } from "./common-models";
import { SystemAuthorizationType } from "./license-systems";

// 授权类型枚举

  export interface SoftwareBase {
    id: string,
    name:string
  }

  export interface Module {
    // 基础信息
    id: string;
    systemId: string;
    name: string;
    description?: string;
    
    // 授权相关
    independentAuth: boolean;         // 是否单独授权
    authType: SystemAuthorizationType;      // 授权类型
    status: KeyStatus;            // 模块状态
    
    // 审计字段
    createdAt: string;               // 创建时间
    updatedAt: string;               // 修改时间
    createdBy: string;               // 创建人账号
    updatedBy: string;               // 修改人账号
    software?: SoftwareBase
  }
  

// 创建模块的请求参数接口
export interface CreateModuleDto {
    systemId: string;
    name: string;
    description?: string;
    independentAuth: boolean;
    authType: SystemAuthorizationType;
    status?: KeyStatus;           // 可选，默认为激活状态
  }
  
  // 更新模块的请求参数接口
  export interface UpdateModuleDto {
    name?: string;
    description?: string;
    independentAuth?: boolean;
    authType?: SystemAuthorizationType;
    status?: KeyStatus;
  }
  
  // 模块查询参数接口
  export interface ModuleQuery {
    systemId?: string;
    name?: string;
    status?: KeyStatus | null;  // 修改这里，允许 null 值
    authType?: SystemAuthorizationType | null;  // 修改这里，允许 null 值
    independentAuth?: boolean;
    startTime?: string;
    endTime?: string;
    createdBy?: string;
  }