// report-assignment.model.ts

// 报告分配查询DTO
export interface ReportAssignmentQueryDTO {
    patientName?: string;
    patientId?: string;
    onlySystemAssigned: boolean; //仅查询系统分配的
    onlyFailedAssignments?: boolean; // 仅显示分配失败的记录
    modality?: string;    // 检查类别
    examSubClass?: string; // 检查部位
    examItemsstr?: string; //检查项目
    patientSource?: string; // 检查来源
    doctorId?: string;
    status?: string;
    assignType?: string;
    startDate?: Date;
    endDate?: Date;
    pageIndex: number;
    pageSize: number;
}

// 报告分配DTO
export interface ReportAssignmentDTO {
    assignmentId?: string;
    risNo: string;
    patientLocalId?: string;
    // 关联的检查信息
    patientName: string;
    patientId: string;
    modality: string;     // 检查类别
    examSubClass: string; // 检查部位
    patientSource: string;// 检查来源
    examDateTime?: Date; //检查时间
    createUser?:string; //创建人
    updateUser?:string; //更新人
    preliminaryDoctorId?: string; //初步报告医生
    preliminaryAssignTime?: Date; //初步报告分配时间
    reviewDoctorId: string; //审核报告医生
    reviewAssignTime?: Date; //审核报告分配时间
    status: string;      // 0-待分配、1-已分配、2-已完成
    priority: number;
    assignType: string;  // 1-初步报告、2-审核报告
    resultStatus: string;
    retryCount?: number;
    errorMsg?: string;
    isProcessed?: string;
    systemAssignmentStatus?: string;
    lastLogId?: string;
}

export interface AssignmentHistoryDTO {
    logId: string;
    risNo: string;
    patientName: string;
    patientId: string;
    modality: string;
    examSubClass: string;
    examItemsstr: string;
    oldStatus: string;
    newStatus: string;
    changeTime?: Date;
    examCompleteTime?: Date;
    emergency: string;
    isProcessed: string;
    processTime?: Date;
    retryCount?: number;
    errorMsg: string;
    
    // 分配信息
    assignmentId: string;
    preliminaryDoctorId?: string;
    preliminaryAssignTime?: Date;
    reviewDoctorId?: string;
    reviewAssignTime?: Date;
    assignmentStatus: string;
    assignmentCreateUser: string;
    assignmentCreateTime?: Date;
    
    // 报告状态
    reportCreateUser?: string;
    reportCreateTime?: Date;
    reportCheckUser?: string;
    reportCheckTime?: Date;
}


// 批量分配DTO
export interface BatchAssignDTO {
    risNos: string[];
    preliminaryDoctorId?:string
    reviewDoctorId?:string
}
export interface ReCallDTO {
    risNo: string;
    assignmentId:string
    resultStatus:string
}

// 医生排班DTO
export interface DoctorScheduleDTO {
    scheduleId: string;
    doctorId: string;
    doctorName: string;
    shiftTypeName: string;
    startTime: string;
    endTime: string;
}
export const ASSIGNMENT_STATUS = {
    PENDING: '0',
    ASSIGNED: '1',
    COMPLETED: '2'
} as const;

export const ASSIGNMENT_STATUS_TEXT = {
    [ASSIGNMENT_STATUS.PENDING]: '待分配',
    [ASSIGNMENT_STATUS.ASSIGNED]: '已分配',
    [ASSIGNMENT_STATUS.COMPLETED]: '已完成'
} as const;

export const ASSIGNMENT_TYPE = {
    PRELIMINARY: '1',
    REVIEW: '2'
} as const;

export const ASSIGNMENT_TYPE_TEXT = {
    [ASSIGNMENT_TYPE.PRELIMINARY]: '初步报告',
    [ASSIGNMENT_TYPE.REVIEW]: '审核报告'
} as const;