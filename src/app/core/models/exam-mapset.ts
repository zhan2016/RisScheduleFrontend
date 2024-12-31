export interface ReportGroup {
    groupId: string;
    groupName: string;
    groupType: string;
    reportType: string;
    description?: string;
    customSql?: string;
    isActive: string;
    createTime?: Date;
    createUser?: string;
    updateTime?: Date;
    updateUser?: string;
    categories?: string[];  // 用于存储关联的分类ID
  }
  export interface ReportGroupQuery {
    groupName?: string;
    groupType?: string;
    reportType?: string;
    isActive?: string;
  }