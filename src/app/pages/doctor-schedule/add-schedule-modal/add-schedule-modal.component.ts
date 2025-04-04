import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { format, set } from 'date-fns';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, finalize, takeUntil } from 'rxjs/operators';
import { ExamUser } from 'src/app/core/models/common-models';
import { ShiftType } from 'src/app/core/models/shift';
import { ScheduleService } from 'src/app/core/services/schedule.service';

@Component({
  selector: 'app-add-schedule-modal',
  templateUrl: './add-schedule-modal.component.html',
  styleUrls: ['./add-schedule-modal.component.scss']
})
export class AddScheduleModalComponent implements OnInit, OnDestroy {

  @Input() scheduleDate!: Date;
  @Input() shiftTypes: ShiftType[] = [];
  @Input() selectedShiftType?: ShiftType;

  scheduleForm: FormGroup;
  doctors: ExamUser[] = []; // 根据实际的医生数据类型调整
  isLoading = false;
  
  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();
  constructor(
    private fb: FormBuilder,
    private modalRef: NzModalRef,
    private userService: ScheduleService // 假设有用户服务来获取医生列表
  ) {
    this.scheduleForm = this.fb.group({
      shiftTypeId: [null, [Validators.required]],
      doctorId: [null, [Validators.required]]
    });
  }

  ngOnInit() {
    if (this.selectedShiftType) {
      this.scheduleForm.patchValue({
        shiftTypeId: this.selectedShiftType.shiftTypeId
      });
    }
    
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  onShiftTypeChange(shiftTypeId: string) {
    this.scheduleForm.patchValue({
      doctorId: null
    });
  }
  onDoctorSelected(doctorId: any) {
    // 可以在这里处理医生选择后的逻辑
    console.log('选中医生:', doctorId);
  }
  get doctorControl(): FormControl {
    return this.scheduleForm.get('doctorId') as FormControl;
  }
  

  formatDate(date: Date): string {
    console.log(this.scheduleDate);
    return format(date, 'yyyy-MM-dd');
  }

  getFormValue() {
    /*处理时区，针对oracle date字段 oracle默认不存储时区信息！*/
    const localDate = new Date(this.scheduleDate);
    
    // 设置为当天的开始时间 00:00:00
    const startOfDay = set(localDate, { 
      hours: 0, 
      minutes: 0, 
      seconds: 0, 
      milliseconds: 0 
    });
  
    // 转换为数据库时区
    const dbDate = format(startOfDay, "yyyy-MM-dd'T'00:00:00.000'Z'");
  
    return {
      ...this.scheduleForm.value,
      scheduleDate: dbDate
    };
  }
  
}
