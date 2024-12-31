export interface ShiftType {
    shiftTypeId: string;
    shiftTypeCode: string;
    shiftTypeName: string;
    startTime: string;    // 格式: "HH:mm"
    endTime: string;      // 格式: "HH:mm"
    workHours: number;
    weight: number;
    description: string;
    isActive: string;
    createTime?: Date;
    createUser?: string;
    updateTime?: Date;
    updateUser?: string;
    color?: string,
  }
  
  export interface ShiftTypeQuery {
    shiftTypeCode?: string;
    shiftTypeName?: string;
    isActive?: string;
  }