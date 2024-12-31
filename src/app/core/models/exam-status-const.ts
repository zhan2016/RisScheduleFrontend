export class ExamStatusConst {
    // 登记状态
    static readonly Register = "10";         // 取消检查
    static readonly Apply = "20";            // 申请预约
    static readonly ExamConfirm = "30";      // 检查确认
    static readonly ExamComplete = "35";     // 检查完成
    static readonly PreliminaryReport = "40"; // 初步报告
    static readonly ReviewReport = "45";      // 审核报告
    static readonly ImportReport = "50";      // 输入报告
    static readonly UnsignedReport = "38";    // 未写报告
    static readonly ReviewRejectReport = "44"; // 审核未通过报告
    static readonly Recall = "25";            // 已叫号
  
    // 状态名称字典
    static readonly StatusNames: { [key: string]: string } = {
      [ExamStatusConst.Register]: "取消检查",
      [ExamStatusConst.Apply]: "申请预约",
      [ExamStatusConst.ExamConfirm]: "检查确认",
      [ExamStatusConst.ExamComplete]: "检查完成",
      [ExamStatusConst.PreliminaryReport]: "初步报告",
      [ExamStatusConst.ReviewReport]: "审核报告",
      [ExamStatusConst.ImportReport]: "输入报告",
      [ExamStatusConst.UnsignedReport]: "未写报告",
      [ExamStatusConst.ReviewRejectReport]: "审核未通过报告",
      [ExamStatusConst.Recall]: "已叫号",
    };
  
    // 判断是否需要分配初步报告医生
    static NeedPreliminaryAssignment(status: string): boolean {
      return status === ExamStatusConst.ExamComplete || status === ExamStatusConst.UnsignedReport;
    }
  
    // 判断是否需要分配审核医生
    static NeedReviewAssignment(status: string): boolean {
      return status === ExamStatusConst.PreliminaryReport;
    }
  
    // 获取状态名称
    static GetStatusName(statusCode: string): string {
      return ExamStatusConst.StatusNames[statusCode] || "未知状态";
    }
  
    // 检查状态是否有效
    static IsValidStatus(status: string): boolean {
      return status in ExamStatusConst.StatusNames;
    }
  }
  