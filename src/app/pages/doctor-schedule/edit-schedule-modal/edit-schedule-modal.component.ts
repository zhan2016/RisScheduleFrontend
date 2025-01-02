import { Component, Input, NgZone, OnInit } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ScheduleService } from 'src/app/core/services/schedule.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ShiftType } from 'src/app/core/models/shift';
import { ScheduleView } from 'src/app/core/models/doctor-shedule';

@Component({
  selector: 'app-edit-schedule-modal',
  templateUrl: './edit-schedule-modal.component.html',
  styleUrls: ['./edit-schedule-modal.component.scss']
})
// edit-schedule-modal.component.ts
export class EditScheduleModalComponent implements OnInit {
  @Input() doctor: any;
  @Input() doctors: any[] = [];
  @Input() shiftTypes: any[] = [];

  scheduleForm: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private modalRef: NzModalRef,
    private scheduleService: ScheduleService,
    private message: NzMessageService,
    private ngZone: NgZone
  ) {
    // 初始化表单时设置默认值
    this.scheduleForm = this.fb.group({
      scheduleId: [null],
      scheduleDate: [null, [Validators.required]],
      doctorId: [null, [Validators.required]],
      shiftTypeId: [null, [Validators.required]],
      weight: [1.0, [Validators.required, Validators.min(0), Validators.max(9.99)]],
      status: ['1']
    });
  }

  ngOnInit() {
    if (this.doctor) {
      // 确保日期正确转换
      const scheduleDate = this.doctor.scheduleDate ? 
        new Date(this.doctor.scheduleDate) : 
        null;

      this.scheduleForm.patchValue({
        scheduleId: this.doctor.scheduleId,
        scheduleDate: scheduleDate,
        doctorId: this.doctor.doctorId,
        shiftTypeId: this.doctor.shiftTypeId,
        weight: this.doctor.weight || 1.0,
        status: this.doctor.status === "1"
      });
    }
  }

  onSubmit(): void {
    if (this.scheduleForm.invalid) {
      Object.values(this.scheduleForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsTouched();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
      return;
    }

    this.loading = true;
    const formData = this.scheduleForm.value;
    
    // 确保日期格式正确
    const updatedSchedule = {
      ...formData,
      scheduleDate: formData.scheduleDate ? 
        this.formatDate(formData.scheduleDate) : 
        null
    };
    updatedSchedule.status =  formData.status ? '1' : '0';
    this.scheduleService.updateSchedule(updatedSchedule).subscribe({
      next: (res) => {
        this.loading = false;
        //console.log(res);
        if (res.data) {
          this.ngZone.run(() => {
            this.modalRef.close({ 
              action: 'updateSchedule', 
              data: updatedSchedule 
            });
            //this.message.success('排班信息修改成功');  //BUG: 不管在模态对话框前后加上这一句，都会导致无法二次打开对话框！
          });
          
        } else {
          this.message.error(res.message || '修改失败');
        }
      },
      error: (err) => {
        this.loading = false;
        this.message.error('修改排班失败');
        //console.error('Update error:', err);
      }
    });
  }

  // 格式化日期
  private formatDate(date: Date): string {
    if (!date) return '';
    return new Date(date).toISOString().split('T')[0];
  }

  // 日期禁用逻辑
  disabledDate = (current: Date): boolean => {
    return current && current < new Date(new Date().setHours(0, 0, 0, 0));
  };

  onCancel(): void {
    this.modalRef.close();
  }
}
