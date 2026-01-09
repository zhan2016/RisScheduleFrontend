
// models/assignment-strategy.model.ts
export interface AssignmentStrategy {
    strategyId?: string;         // 新增时可选
    strategyName: string;
    distributionMode: string;    // '1' | '2'
    onlineOnly: string;         // '0' | '1'
    triggerPoint: string;       // '1' | '2'
    reportScope: string;        // '1' | '2' | '3'
    retryCount: number;
    retryInterval: number;
    isDefault: string;          // '0' | '1'
    isActive: string;           // '0' | '1'
    description?: string;        // 空字符串代替null
    workloadMode: string;
    calWorkloadByExamItem: string;
    preliminaryWeight?: number;
    reviewWeight?: number;
  }
  
  