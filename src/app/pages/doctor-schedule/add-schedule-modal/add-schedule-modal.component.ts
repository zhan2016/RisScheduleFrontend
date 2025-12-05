import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { format, set } from 'date-fns';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { ExamUser } from 'src/app/core/models/common-models';
import { ShiftType } from 'src/app/core/models/shift';
import { ScheduleService } from 'src/app/core/services/schedule.service';

@Component({
  selector: 'app-add-schedule-modal',
  templateUrl: './add-schedule-modal.component.html',
  styleUrls: ['./add-schedule-modal.component.scss']
})
export class AddScheduleModalComponent implements OnInit {

  @Input() scheduleDate!: Date;
  @Input() shiftTypes: ShiftType[] = [];
  @Input() selectedShiftType?: ShiftType;

  scheduleForm: FormGroup;
  doctors: ExamUser[] = []; // 根据实际的医生数据类型调整

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
    this.loadDoctors();
  }

  loadDoctors(search: string = '') {
    // 根据实际的 API 调整
    this.userService.getDoctors().subscribe({
      next: (res) => {
        this.doctors = res;
      },
      error: (err) => {
        console.error('Failed to load doctors:', err);
      }
    });
  }

  onDoctorSearch(value: string): void {
    this.loadDoctors(value);
  }

  formatDate(date: Date): string {
    //console.log(this.scheduleDate);
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
