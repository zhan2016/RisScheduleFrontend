export interface DoctorSchedule {
    scheduleId?: string;
    doctorId: string;
    scheduleDate: Date;
    shiftTypeId: string;
    weight?: number;
    status?: string;      // '0'-未生效、'1'-已生效、'2'-已结束
    lockTime?: Date;
    createTime?: Date;
    createUser?: string;
    updateTime?: Date;
    updateUser?: string;
  }
  
  // schedule-view.model.ts (视图对象，包含显示所需的额外信息)
  export interface ScheduleView extends DoctorSchedule {
    doctorName: string;
    shiftTypeName: string;
    startTime: string;
    endTime: string;
  }
  
  // schedule-query.dto.ts (查询参数)
  export interface ScheduleQueryDTO {
    doctorId?: string;
    startDate?: string;
    endDate?: string;
    shiftTypeId?: string;
    status?: string;
    createUser?: string,
  }
  
  // schedule-save.dto.ts (保存参数)
  export interface ScheduleSaveDTO {
    scheduleId?: string;        // 新增时为空
    doctorId: string;
    scheduleDate: Date;
    shiftTypeId: string;
    weight?: number;
    status?: string;
  }

  export interface ShiftSummary {
    shiftTypeId: string;
    shiftTypeName: string;
    startTime: string;
    endTime: string;
    workHours: number;
    doctorCount: number;
    doctors: Array<{
      doctorId: string;
      doctorName: string;
      status?: string;
      scheduleId: string;
      weight?: number,
      shiftTypeId: string,
      scheduleDate: Date;
    }>;
  }