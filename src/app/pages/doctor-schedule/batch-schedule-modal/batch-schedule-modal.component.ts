import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { addDays, eachDayOfInterval } from 'date-fns';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { ExamUser } from 'src/app/core/models/common-models';
import { ShiftType } from 'src/app/core/models/shift';
import { AuthService } from 'src/app/core/services/auth.service';
import { ScheduleService } from 'src/app/core/services/schedule.service';

@Component({
  selector: 'app-batch-schedule-modal',
  templateUrl: './batch-schedule-modal.component.html',
  styleUrls: ['./batch-schedule-modal.component.scss']
})
export class BatchScheduleModalComponent implements OnInit {

  form!: FormGroup;
  @Input() doctorOptions: any[] = [];
  isAllShiftSelected = false;
  @Input() shiftTypes: any[] = [];
  loading = false;
  constructor(
    private fb: FormBuilder,
    private modal: NzModalRef,
    private scheduleService: ScheduleService,
    private message: NzMessageService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.initForm();
  }

  private initForm() {
    // 设置默认日期范围
    const today = new Date();
    const nextWeek = addDays(today, 7);
    
    this.form = this.fb.group({
      dateRange: [[today, nextWeek], [Validators.required]],
      doctorIds: [[], [Validators.required]],
      selectedShiftId: [null, [Validators.required]],
    });
  }

  onDoctorSelected(doctorId: any) {
    // 可以在这里处理医生选择后的逻辑
    console.log('选中医生:', doctorId);
  }
  onShiftSelectionChange() {
    //this.isAllShiftSelected = Object.values(this.selectedShifts).every(value => value);
  }

  disabledDate = (current: Date): boolean => {
    // 将当前日期设置为当天的开始（0时0分0秒）
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // 将要比较的日期也设置为其当天的开始
    const currentDate = new Date(current);
    currentDate.setHours(0, 0, 0, 0);
    
    return currentDate < today;
  };
  get doctorControl(): FormControl {
    return this.form.get('doctorIds') as FormControl;
  }
  
  onSubmit() {
    if (this.form.valid) {
      const formValue = this.form.value;


      const schedules = this.generateSchedules(
        formValue.dateRange[0],
        formValue.dateRange[1],
        formValue.doctorIds,
        formValue.selectedShiftId!,
        formValue
      );
      this.scheduleService.batchSaveSchedules(schedules)
        .subscribe(res => {
          if(res.code === 200) {
            this.message.success("批量创建成功");
            this.modal.close();
          }
          //console.log(res);
        })
      //this.modal.close(schedules);
    } else {
      Object.values(this.form.controls).forEach(control => {
        if (control.invalid) {
          control.markAsTouched();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  private generateSchedules(
    startDate: Date,
    endDate: Date,
    doctorIds: string[],
    shiftTypeId: string,
    options: {
      skipWeekend: boolean;
      skipHoliday: boolean;
      autoBalance: boolean;
    }
  ) {
    const days = eachDayOfInterval({ start: startDate, end: endDate });
    const schedules: Array<{
      doctorId: string;
      scheduleDate: Date;
      shiftTypeId: string;
      createUser?:string;
    }> = [];

    let doctorIndex = 0;
    let shiftIndex = 0;

    for (const day of days) {
      if (options.skipWeekend && (day.getDay() === 0 || day.getDay() === 6)) {
        continue;
      }

      // TODO: 节假日判断逻辑

      for (const doctorId of doctorIds) {
        schedules.push({
          doctorId,
          scheduleDate: day,
          shiftTypeId,
          createUser: this.authService.getCurrentUser()?.id
        });

        // if (options.autoBalance) {
        //   shiftIndex++;
        // }
      }

      // if (!options.autoBalance) {
      //   shiftIndex++;
      // }
    }

    return schedules;
  }

  onCancel(): void {
    this.modal.close();
  }

}
