import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ExamUser } from 'src/app/core/models/common-models';
import { ASSIGNMENT_STATUS, ASSIGNMENT_STATUS_TEXT, BatchAssignDTO, ReportAssignmentDTO, ReportAssignmentQueryDTO } from 'src/app/core/models/report-assignment';
import { ReportAssignmentService } from 'src/app/core/services/report-assignment.service';
import { TransferModalComponent } from '../transfer-modal/transfer-modal.component';
import { PageResult } from 'src/app/core/models/page-result';
import { subDays } from 'date-fns';

@Component({
  selector: 'app-report-assignment',
  templateUrl: './report-assignment.component.html',
  styleUrls: ['./report-assignment.component.scss']
})
export class ReportAssignmentComponent implements OnInit {
  searchForm: FormGroup;
  assignments: ReportAssignmentDTO[] = [];
  loading = false;
  selectedRows: ReportAssignmentDTO[] = [];
  doctorList: ExamUser[] = [];
  isTransferModalVisible = false;
  totalPage = 0; // 数据总数
  pageIndex = 1; // 当前页码
  pageSize = 10; // 每页条数
  today: Date = new Date();
  yesterday: Date = subDays(this.today, 1); // 获取昨天的日期
  initDateRangeValue = [this.yesterday, this.today];
  constructor(
    private fb: FormBuilder,
    private reportAssignmentService: ReportAssignmentService,
    private message: NzMessageService,
    private modal: NzModalService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef 
  ) {
    this.searchForm = this.fb.group({
      patientName: [''],
      patientId: [''],
      modality: [''],
      examSubClass: [''],
      examItemsstr:[''],
      patientSource: [''],
      doctorId: [''],
      status: [''],
      assignType: [''],
      dateRange: [[]],
      startDate: [this.yesterday],  // 默认开始日期为昨天
      endDate: [this.today],        // 默认结束日期为今天
      examDateRange: [[this.yesterday, this.today]] // 默认日期范围为昨天到今天
    });
  }
  // 添加获取状态颜色的方法
  getStatusColor(preliminaryDoctorId: string | undefined, reviewDoctorId: string | undefined): string {
    if (!preliminaryDoctorId && !reviewDoctorId) {
      return 'warning';  // 如果两者都没有值，表示待分配，使用警告颜色
    } else if (preliminaryDoctorId && !reviewDoctorId) {
      return 'processing'; // 如果只有 preliminaryDoctorId 有值，表示初步已分配，使用处理中颜色
    } else if (!preliminaryDoctorId && reviewDoctorId) {
      return 'processing'; // 如果只有 reviewDoctorId 有值，表示审核已分配，使用处理中颜色
    } else {
      return 'success'; // 如果两者都有值，表示已完成，使用成功颜色
    }
  }

  // 添加获取状态文本的方法
  getStatusText(status: string, preliminaryDoctorId: string | undefined, reviewDoctorId: string | undefined): string {
    //console.log(preliminaryDoctorId, reviewDoctorId);
    if (!preliminaryDoctorId && !reviewDoctorId) {
      return '待分配';  // 如果两者都没有值，表示待分配
    } else if (preliminaryDoctorId && !reviewDoctorId) {
      return '初步医生已分配'; // 如果只有 preliminaryDoctorId 有值，表示初步已分配
    } else if (preliminaryDoctorId && reviewDoctorId) {
      return '审核医生已分配';  // 如果只有 reviewDoctorId 有值，表示审核已分配
    } else {
      return (ASSIGNMENT_STATUS_TEXT as any)[status] || '未知状态';  // 如果都有值，返回已有的状态文本
    }
  }
  
  ngOnInit(): void {
    const resolverData = this.route.snapshot.data['resolverData'];
    this.doctorList = resolverData.doctorList.data;
    this.loadData();
  }

  loadData(reset: boolean = false): void {
    if (reset) {
      this.searchForm.reset();
      this.searchForm.reset({
        examDateRange: [this.yesterday, this.today],  // 重置时默认选择昨天到今天
      });
      this.pageIndex = 1; // 重置页码
    }
    
    this.loading = true;
    const query = this.getSearchParams();
    
    this.reportAssignmentService.getAssignments(query).subscribe(
      data => {
        const pageResult = data as any as PageResult<ReportAssignmentDTO[]>;
        this.assignments = [...pageResult.data];
        // this.pageIndex = pageResult.page;
        // this.pageSize = pageResult.pageSize;
        this.totalPage = pageResult.total;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error => {
        this.message.error('加载数据失败');
        this.loading = false;
      }
    );
  }
  trackById(index: number, item: any): any {
    return item.risNo; // 假设 risNo 是唯一标识符
  }
  getDoctorName(doctorId: string | undefined): string {

    if (!doctorId) return '';
    if(doctorId.toLowerCase() === 'system') {
      return "系统自动";
    }
    const doctor = this.doctorList.find(d => d.userId === doctorId);
    return doctor ? doctor.userName : '未知医生';
  }
  onTransfer(): void {
    const modal = this.modal.create({
      nzTitle: '选择转发医生',
      nzContent: TransferModalComponent,
      nzWidth: 600,
      nzFooter: null,
      nzComponentParams: {
        doctorList: this.doctorList,
        selectedRows: this.selectedRows,
      },
      nzOnOk: (componentInstance: TransferModalComponent) => {

      }
    });
    modal.afterClose.subscribe(result => {
      //console.log("???");
      this.loading = true;
      this.loadData();
    });
  }



  onPageChange(pageIndex: number): void {
    this.pageIndex = pageIndex;
    this.loadData();
  }

  onPageSizeChange(pageSize: number): void {
    this.pageSize = pageSize;
    this.pageIndex = 1; // 页码重置为第一页
    this.loadData();
  }
  /*
  根据选中表格里的患者信息，生成召回sumarry，并允许去掉一些记录:没有分配记录，不允许召回
  如果ResultStatus大于等于审核报告，不允许召回，
  如果resultStatus大于等于40，且reviewDoctorId有值，允许召回审核医生，
  如果resultStatus小于40，且preliminaryDoctorId有值，允许召回初步报告医生。
  */
  onRecall(): void {
    if (this.selectedRows.length === 0) {
      this.message.warning('请选择需要召回的报告');
      return;
    }
    const recallSummary = this.selectedRows.map(row => {
      let canRecall = false;
      let reason = '';
      
      if (!row.assignmentId) {
        // If there's no assignmentId, it can't be recalled
        reason = '没有分配记录，不允许召回';
      } else if (row.resultStatus >= '45') {
        // ResultStatus is greater than or equal to 审核报告 (Review Report), cannot recall
        reason = '审核报告或更高状态，不允许召回';
      } else if (row.resultStatus >= '40' && row.reviewDoctorId) {
        // ResultStatus is greater than or equal to 40 (initial report), and reviewDoctorId exists, allow recall
        canRecall = true;
        reason = '可以召回审核医生';
      } else if (row.resultStatus < '40' && row.preliminaryDoctorId) {
        // ResultStatus is less than 40 (preliminary report), and preliminaryDoctorId exists, allow recall
        canRecall = true;
        reason = '可以召回初步报告医生';
      } else {
        // Otherwise, cannot recall
        reason = '没有对应医生，不允许召回';
      }
  
      return {
        ...row,
        canRecall,
        reason
      };
    });
    console.log(recallSummary);
    const validRowsToRecall = recallSummary.filter(row => row.canRecall);
    if (validRowsToRecall.length === 0) {
      this.message.warning('没有可以召回的报告');
      return;
    }
    const recallText = validRowsToRecall.map(row => `${row.patientName}（${row.risNo}）：${row.reason}`).join('<br>');
    this.modal.confirm({
      nzTitle: '确认召回',
      nzContent: '确定要召回选中的报告吗？',
      nzOnOk: () => {
        const recallInfos = validRowsToRecall.map(row => ({
          risNo: row.risNo,            // Assuming risNo exists in the row
          assignmentId: row.assignmentId!,  // Assuming assignmentId exists in the row
          resultStatus: row.resultStatus // Assuming resultStatus exists in the row
        }));
        return this.reportAssignmentService.recallAssignments(recallInfos).toPromise()
          .then(() => {
            this.message.success('召回成功');
            this.loadData();
          });
      }
    });
  }

  onExport(): void {
    const query = this.getSearchParams();
    this.reportAssignmentService.exportAssignments(query);
  }

  private getSearchParams(): ReportAssignmentQueryDTO {
    const formValue = this.searchForm.value;
    
    return {
      patientName: formValue.patientName,
      patientId: formValue.patientId,
      modality: formValue.modality,
      examSubClass: formValue.examSubClass,
      examItemsstr: formValue.examItemsstr,
      patientSource: formValue.patientSource,
      doctorId: formValue.doctorId,
      status: formValue.status,
      assignType: formValue.assignType,
      startDate: formValue.examDateRange ? formValue.examDateRange[0] : this.yesterday,
      endDate: formValue.examDateRange ? formValue.examDateRange[1] : this.today,
      pageIndex: this.pageIndex,
      pageSize: this.pageSize
    };
  }
  setOfCheckedId = new Set<string>();

  onItemChecked(id: string, checked: boolean): void {
    if (checked) {
      this.setOfCheckedId.add(id);
    } else {
      this.setOfCheckedId.delete(id);
    }
    this.selectedRows = this.assignments.filter(item => 
      this.setOfCheckedId.has(item.risNo!)
    );
  }

  onAllChecked(checked: boolean): void {
    this.assignments.forEach(item => 
      this.onItemChecked(item.risNo, checked)
    );
  }
}
