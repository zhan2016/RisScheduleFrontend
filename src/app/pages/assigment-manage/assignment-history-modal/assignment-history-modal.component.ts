import { Component, Input, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ExamUser, statusMap } from 'src/app/core/models/common-models';
import { AssignmentHistoryDTO } from 'src/app/core/models/report-assignment';
import { ReportAssignmentService } from 'src/app/core/services/report-assignment.service';

@Component({
  selector: 'app-assignment-history-modal',
  templateUrl: './assignment-history-modal.component.html',
  styleUrls: ['./assignment-history-modal.component.scss']
})
export class AssignmentHistoryModalComponent implements OnInit {

  @Input() risNo!: string;
  @Input() doctorList: ExamUser[] = [];
  
  historyList: AssignmentHistoryDTO[] = [];
  loading = false;

  constructor(
    private reportAssignmentService: ReportAssignmentService,
    private message: NzMessageService
  ) {}

  ngOnInit(): void {
    this.loadHistory();
  }

  loadHistory(): void {
    this.loading = true;
    this.reportAssignmentService.getAssignmentHistory(this.risNo).subscribe(
      data => {
        this.historyList = data;
        this.loading = false;
      },
      error => {
        this.message.error('加载历史记录失败');
        this.loading = false;
      }
    );
  }

  getDoctorName(doctorId: string | undefined): string {
    if (!doctorId) return '';
    if(doctorId.toLowerCase() === 'system') {
      return "系统自动";
    }
    const doctor = this.doctorList.find(d => d.userId === doctorId);
    return doctor ? doctor.userName : '未知医生';
  }

  getAssignTypeText(assignType: string | undefined): string {
    const typeMap: { [key: string]: string } = {
      'PRELIMINARY_ONLY': '仅初审',
      'REVIEW_ONLY': '仅复审',
      'BOTH': '同时分配',
      '': '-'
    };
    return typeMap[assignType || ''] || '-';
  }

  getAssignTypeColor(assignType: string | undefined): string {
    const colorMap: { [key: string]: string } = {
      'PRELIMINARY_ONLY': 'blue',
      'REVIEW_ONLY': 'orange',
      'BOTH': 'purple',
      '': 'default'
    };
    return colorMap[assignType || ''] || 'default';
  }

  getStatusText(status: string | undefined): string {
    return (statusMap as any)[status || ''] || status || '-';
  }
}
