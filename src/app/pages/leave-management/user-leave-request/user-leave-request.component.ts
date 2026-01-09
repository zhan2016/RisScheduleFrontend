import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CreateLeaveRequest, UserLeaveRequest, UserLeaveRequestQuery } from 'src/app/core/models/user-leave-request';
import { UserLeaveRequestService } from 'src/app/core/services/user-leave-request.service';

@Component({
  selector: 'app-user-leave-request',
  templateUrl: './user-leave-request.component.html',
  styleUrls: ['./user-leave-request.component.scss']
})
export class UserLeaveRequestComponent implements OnInit {

 leaveRequests: UserLeaveRequest[] = [];
  loading = false;
  
  pageIndex = 1;
  pageSize = 10;
  total = 0;

  searchParams: UserLeaveRequestQuery = {
    pageIndex: 1,
    pageSize: 10
  };

  dateRange: Date[] | null = [];

  modalVisible = false;
  isEditMode = false;
  formData: any = {};
  formDateRange: Date[] = [];
  startTime: Date | null = null;
  endTime: Date | null = null;

  detailVisible = false;
  detailData: UserLeaveRequest | null = null;
  leaveForm!: FormGroup;

  constructor(
    private leaveRequestService: UserLeaveRequestService,
    private message: NzMessageService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
     this.initForm(); 
    this.loadData();
  }
 initForm(): void {
    this.leaveForm = this.fb.group({
      applicantId: ['', Validators.required],
      applicantName: ['', Validators.required],
      leaveType: ['年假', Validators.required],
      isFullDay: [true],
      dateRange: [[], Validators.required],
      startTime: [null],
      endTime: [null],
      reason: ['']
    });
  }
  loadData(): void {
    this.loading = true;
    this.searchParams.pageIndex = this.pageIndex;
    this.searchParams.pageSize = this.pageSize;

    if (this.dateRange && this.dateRange.length === 2) {
      this.searchParams.startDate = this.formatDate(this.dateRange[0]);
      this.searchParams.endDate = this.formatDate(this.dateRange[1]);
    }

    this.leaveRequestService.getLeaveRequests(this.searchParams).subscribe(
      result => {
        this.leaveRequests = result.data;
        this.total = result.total;
        this.loading = false;
      },
      error => {
        this.message.error('加载数据失败！');
        this.loading = false;
      }
    );
  }

  search(): void {
    this.pageIndex = 1;
    this.loadData();
  }

  resetSearch(): void {
    this.searchParams = {
      pageIndex: 1,
      pageSize: 10
    };
    this.dateRange = [];
    this.pageIndex = 1;
    this.loadData();
  }

  onPageIndexChange(pageIndex: number): void {
    this.pageIndex = pageIndex;
    this.loadData();
  }

  onPageSizeChange(pageSize: number): void {
    this.pageSize = pageSize;
    this.pageIndex = 1;
    this.loadData();
  }

  showCreateModal(): void {
    this.isEditMode = false;
    this.leaveForm.reset({
      applicantId: '',
      applicantName: '',
      leaveType: '年假',
      isFullDay: true,
      dateRange: [],
      startTime: null,
      endTime: null,
      reason: ''
    });
   this.modalVisible = true;
  }

  showEditModal(item: UserLeaveRequest): void {
    this.isEditMode = true;
    const startTime = !item.isFullDay && item.startTime 
      ? this.parseTimeString(item.startTime) 
      : null;
    const endTime = !item.isFullDay && item.endTime 
      ? this.parseTimeString(item.endTime) 
      : null;

    this.leaveForm.patchValue({
      applicantId: item.applicantId,
      applicantName: item.applicantName,
      leaveType: item.leaveType,
      isFullDay: item.isFullDay,
      dateRange: [new Date(item.startDate), new Date(item.endDate)],
      startTime: startTime,
      endTime: endTime,
      reason: item.reason
    });
    
    this.formData = { ...item };
    this.modalVisible = true;
  }

  onLeaveTypeChange(type: string): void {
    // 如果选择哺乳假，默认设置为时间段假期
    if (type === '哺乳假') {
       this.leaveForm.patchValue({
        isFullDay: false,
        startTime: this.parseTimeString('08:00'),
        endTime: this.parseTimeString('09:00')
      });
    }
  }

  handleSubmit(): void {
    if (this.leaveForm.invalid) {
      Object.values(this.leaveForm.controls).forEach(control => {
        control.markAsDirty();
        control.updateValueAndValidity();
      });
      this.message.error('请填写完整信息！');
      return;
    }

    const formValue = this.leaveForm.value;
    
    if (!formValue.dateRange || formValue.dateRange.length !== 2) {
      this.message.error('请选择日期范围！');
      return;
    }

    if (!formValue.isFullDay && (!formValue.startTime || !formValue.endTime)) {
      this.message.error('请选择时间段！');
      return;
    }

    const dto: CreateLeaveRequest = {
      applicantId: formValue.applicantId,
      applicantName: formValue.applicantName,
      startDate: this.formatDate(formValue.dateRange[0]),
      endDate: this.formatDate(formValue.dateRange[1]),
      isFullDay: formValue.isFullDay,
      startTime: formValue.isFullDay ? undefined : this.formatTime(formValue.startTime),
      endTime: formValue.isFullDay ? undefined : this.formatTime(formValue.endTime),
      leaveType: formValue.leaveType,
      reason: formValue.reason || ''
    };

    const request = this.isEditMode 
      ? this.leaveRequestService.updateLeaveRequest(this.formData.serialNo, dto)
      : this.leaveRequestService.createLeaveRequest(dto);

    request.subscribe(
      () => {
        this.message.success('保存成功！');
        this.modalVisible = false;
        this.loadData();
      },
      error => {
        this.message.error(error.error?.message || '保存失败！');
      }
    );
  }

  viewDetail(item: UserLeaveRequest): void {
    this.detailData = item;
    this.detailVisible = true;
  }

  deleteLeaveRequest(serialNo: string): void {
    this.leaveRequestService.deleteLeaveRequest(serialNo).subscribe(
      () => {
        this.message.success('删除成功！');
        this.loadData();
      },
      error => {
        this.message.error('删除失败！');
      }
    );
  }

  getLeaveTypeColor(type: string): string {
    const colorMap: any = {
      '年假': 'green',
      '病假': 'orange',
      '事假': 'blue',
      '调休': 'purple',
      '哺乳假': 'magenta'
    };
    return colorMap[type] || 'default';
  }

  getStatusColor(status: string): string {
    const colorMap: any = {
      'PENDING': 'orange',
      'APPROVED': 'green',
      'REJECTED': 'red'
    };
    return colorMap[status] || 'default';
  }

  getStatusText(status: string): string {
    const textMap: any = {
      'PENDING': '待审批',
      'APPROVED': '已通过',
      'REJECTED': '已拒绝'
    };
    return textMap[status] || status;
  }

  formatDate(date: Date): string {
    if (!date) return '';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  formatTime(date: Date): string {
    if (!date) return '';
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  parseTimeString(timeStr: string): Date {
    const [hours, minutes] = timeStr.split(':');
    const date = new Date();
    date.setHours(parseInt(hours, 10));
    date.setMinutes(parseInt(minutes, 10));
    date.setSeconds(0);
    return date;
  }
  onDateRangeChange(value: Date[] | null): void {
    this.dateRange = value;
    console.log('日期范围变化:', this.dateRange);
  }

}
