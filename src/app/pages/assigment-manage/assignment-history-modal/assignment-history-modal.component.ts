import { Component, Input, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ExamUser } from 'src/app/core/models/common-models';
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
    const doctor = this.doctorList.find(d => d.id === doctorId);
    return doctor ? doctor.name : '未知医生';
  }
}
