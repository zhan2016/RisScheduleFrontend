// 检查项目字典
export interface ExamItemDict {
  serialNo: string;
  descriptionCode: string;
  description: string;
  reportWorkload: number;
  isActive?: string;
  createTime?: Date;
  updateTime?: Date;
}

// 查询参数
export interface ExamItemDictQueryDTO {
  descriptionCode?: string;
  description?: string;
  minWorkload?: number;
  maxWorkload?: number;
  isActive?: string;
  pageIndex?: number;
  pageSize?: number;
}

// 批量更新工作量DTO
export interface BatchUpdateWorkloadDTO {
  serialNos: string[];
  reportWorkload: number;
}

// 分页结果
export interface PageResult<T> {
  data: T[];
  total: number;
  pageIndex: number;
  pageSize: number;
}