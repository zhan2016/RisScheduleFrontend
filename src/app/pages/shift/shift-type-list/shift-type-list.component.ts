import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ShiftType, ShiftTypeQuery } from 'src/app/core/models/shift';
import { ShiftTypeService } from 'src/app/core/services/shift-type.service';

@Component({
  selector: 'app-shift-type-list',
  templateUrl: './shift-type-list.component.html',
  styleUrls: ['./shift-type-list.component.scss']
})
export class ShiftTypeListComponent implements OnInit {
  shiftTypes: ShiftType[] = [];
  loading = false;
  visible = false;
  editingShiftType: Partial<ShiftType> = {};
  editForm!: FormGroup;
  searchValue: ShiftTypeQuery = {};

  constructor(
    private fb: FormBuilder,
    private shiftTypeService: ShiftTypeService,
    private message: NzMessageService,
    private modal: NzModalService
  ) {
    this.createForm();
  }
  createForm(): void {
    this.editForm = this.fb.group({
      shiftTypeCode: ['', [Validators.required]],
      shiftTypeName: ['', [Validators.required]],
      startTime: [null, [Validators.required]],
      endTime: [null, [Validators.required]],
      workHours: [{ value: 0, disabled: true }, [Validators.required, Validators.min(0)]], // 设置为自动计算
      weight: [1.0, [Validators.required, Validators.min(0)]],
      description: [''],
      isActive: ['1']
    });
    this.editForm.get('startTime')?.valueChanges.subscribe(() => {
      this.calculateWorkHours();
    });
    this.editForm.get('endTime')?.valueChanges.subscribe(() => {
      this.calculateWorkHours();
    });
  }
  // 计算两个时间之间的工作时长
  calculateWorkHours(): void {
    const startTime = this.editForm.get('startTime')?.value;
    const endTime = this.editForm.get('endTime')?.value;
    
    if (startTime && endTime) {
      const start = new Date(startTime);
      const end = new Date(endTime);
      
      // 计算时间差（毫秒）
      let diffMs = end.getTime() - start.getTime();
      
      // 如果结束时间小于开始时间，说明是跨天的情况，需要加上24小时
      if (diffMs < 0) {
        diffMs += 24 * 60 * 60 * 1000;
      }
      
      // 转换为小时，保留一位小数
      const hours = Number((diffMs / (1000 * 60 * 60)).toFixed(1));
      this.editForm.patchValue({ workHours: hours }, { emitEvent: false });
    }
  }
  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading = true;
    this.shiftTypeService.getShiftTypes(this.searchValue).subscribe(
      data => {
        this.shiftTypes = data;
        this.loading = false;
      },
      error => {
        this.message.error('加载数据失败');
        this.loading = false;
      }
    );
  }

  search(): void {
    this.loadData();
  }

  reset(): void {
    this.searchValue = {};
    this.loadData();
  }

  showModal(shiftType?: ShiftType): void {
    if (shiftType) {
      const today = new Date();
      let startTime: Date | null = null;
      let endTime: Date | null = null;
      
      if (shiftType.startTime) {
        const [startHours, startMinutes] = shiftType.startTime.split(':');
        startTime = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 
          parseInt(startHours), parseInt(startMinutes));
      }
      
      if (shiftType.endTime) {
        const [endHours, endMinutes] = shiftType.endTime.split(':');
        let endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 
          parseInt(endHours), parseInt(endMinutes));
        
        // 如果结束时间小于开始时间，说明是跨天的情况
        if (startTime && endDate < startTime) {
          endDate.setDate(endDate.getDate() + 1);
        }
        endTime = endDate;
      }

      this.editingShiftType = { ...shiftType };
      this.editForm.patchValue({
        shiftTypeCode: shiftType.shiftTypeCode,
        shiftTypeName: shiftType.shiftTypeName,
        startTime: startTime,
        endTime: endTime,
        workHours: shiftType.workHours,
        weight: shiftType.weight,
        description: shiftType.description,
        isActive: shiftType.isActive
      });
    } else {
      this.editingShiftType = {};
      this.editForm.reset({
        isActive: '1',
        weight: 1.0,
        workHours: 0
      });
    }
    this.visible = true;
  }


  handleCancel(): void {
    this.visible = false;
    this.editForm.reset();
  }
  private checkCrossingDay(startTime: string, endTime: string): boolean {
    const [startHours, startMinutes] = startTime.split(':').map(Number);
    const [endHours, endMinutes] = endTime.split(':').map(Number);
    
    return (endHours < startHours) || 
           (endHours === startHours && endMinutes < startMinutes);
  }

  handleOk(): void {
    if (this.editForm.valid) {
      const formValue = this.editForm.value;
      // 格式化时间
      if (formValue.startTime) {
        formValue.startTime = formatDate(formValue.startTime, 'HH:mm', 'en');
      }
      if (formValue.endTime) {
        formValue.endTime = formatDate(formValue.endTime, 'HH:mm', 'en');
      }
      formValue.workHours = this.editForm.get('workHours')?.value;
      if (this.checkCrossingDay(formValue.startTime, formValue.endTime)) {
        this.modal.confirm({
          nzTitle: '确认保存',
          nzContent: `当前设置为跨天班次：${formValue.startTime} 至次日 ${formValue.endTime}，是否确认保存？`,
          nzOnOk: () => this.saveShiftType(formValue)
        });
      } else {
        this.saveShiftType(formValue);
      }
    } else {
      Object.values(this.editForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsTouched();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }
  private saveShiftType(formValue: any): void {
    if (this.editingShiftType.shiftTypeId) {
      this.shiftTypeService.updateShiftType(
        this.editingShiftType.shiftTypeId,
        { ...this.editingShiftType, ...formValue }
      ).subscribe(
        () => {
          this.message.success('更新成功');
          this.loadData();
          this.visible = false;
        },
        error => this.message.error('更新失败')
      );
    } else {
      this.shiftTypeService.createShiftType(formValue).subscribe(
        () => {
          this.message.success('创建成功');
          this.loadData();
          this.visible = false;
        },
        error => this.message.error('创建失败')
      );
    }
  }

  handleDelete(id: string): void {
    this.shiftTypeService.deleteShiftType(id).subscribe(
      () => {
        this.message.success('删除成功');
        this.loadData();
      },
      error => this.message.error('删除失败')
    );
  }
  onTimeChange(time: Date, field: string): void {
    if (time) {
      const formattedTime = formatDate(time, 'HH:mm', 'en');
      this.editForm.get(field)?.setValue(formattedTime, { emitEvent: false });
    }
  }
}