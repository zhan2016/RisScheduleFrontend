
export interface UserLeaveRequest {
  serialNo: string;
  applicantId: string;
  applicantName: string;
  startDate: string;
  endDate: string;
  isFullDay: boolean;
  startTime?: string;
  endTime?: string;
  leaveType: string;
  reason: string;
  status: string;
  applyTime: string;
  approverId?: string;
  approverName?: string;
  approveTime?: string;
  remark?: string;
  totalHours?: number;
  totalDays?: number;
}

export interface UserLeaveRequestQuery {
  applicantId?: string;
  applicantName?: string;
  startDate?: string;
  endDate?: string;
  leaveType?: string;
  status?: string;
  isFullDay?: boolean;
  pageIndex: number;
  pageSize: number;
}

export interface CreateLeaveRequest {
  applicantId: string;
  applicantName: string;
  startDate: string;
  endDate: string;
  isFullDay: boolean;
  startTime?: string;
  endTime?: string;
  leaveType: string;
  reason: string;
}