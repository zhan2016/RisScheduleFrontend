export interface ShiftType {
    shiftTypeId: string;
    shiftTypeCode: string;
    shiftTypeName: string;
    startTime: string;    // 格式: "HH:mm"
    endTime: string;      // 格式: "HH:mm"
    excludeBreakTime?: boolean;   // 是否扣除休息时间
    breakStartTime?: string;      // 休息开始时间 HH:mm
    breakEndTime?: string;        // 休息结束时间 HH:mm
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