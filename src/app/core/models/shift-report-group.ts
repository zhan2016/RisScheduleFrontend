export interface ShiftReportGroup {
    shiftGroupId: string;
    shiftTypeId: string;
    groupId: string;
    priority: number;
    isActive: string;
    shiftTypeName?: string;
    groupName?: string;
  }
  
  export interface ShiftReportGroupQuery {
    shiftTypeId?: string;
    groupId?: string;
    isActive?: string;
  }