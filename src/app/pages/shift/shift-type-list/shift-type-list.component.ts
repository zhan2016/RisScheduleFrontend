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
      excludeBreakTime: [false], 
      breakStartTime: [null], // 休息开始时间
      breakEndTime: [null],   // 休息结束时间
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
    this.editForm.get('excludeBreakTime')?.valueChanges.subscribe((value) => {
      this.onExcludeBreakTimeChange(value);
    });
    this.editForm.get('breakStartTime')?.valueChanges.subscribe(() => {
      this.calculateWorkHours();
    });
    this.editForm.get('breakEndTime')?.valueChanges.subscribe(() => {
      this.calculateWorkHours();
    });
  }
  onExcludeBreakTimeChange(value: boolean): void {
    if (value) {
      // 启用时设置为必填
      this.editForm.get('breakStartTime')?.setValidators([Validators.required]);
      this.editForm.get('breakEndTime')?.setValidators([Validators.required]);
    } else {
      // 禁用时清除必填和值
      this.editForm.get('breakStartTime')?.clearValidators();
      this.editForm.get('breakEndTime')?.clearValidators();
      this.editForm.patchValue({
        breakStartTime: null,
        breakEndTime: null
      });
    }
    this.editForm.get('breakStartTime')?.updateValueAndValidity();
    this.editForm.get('breakEndTime')?.updateValueAndValidity();
    this.calculateWorkHours();
  }
  calculateWorkHours(): void {
    const startTime = this.editForm.get('startTime')?.value;
    const endTime = this.editForm.get('endTime')?.value;
    const excludeBreakTime = this.editForm.get('excludeBreakTime')?.value;
    const breakStartTime = this.editForm.get('breakStartTime')?.value;
    const breakEndTime = this.editForm.get('breakEndTime')?.value;
    
    if (startTime && endTime) {
      const start = new Date(startTime);
      const end = new Date(endTime);
      
      let diffMs = end.getTime() - start.getTime();
      
      // 处理跨天情况
      if (diffMs < 0) {
        diffMs += 24 * 60 * 60 * 1000;
      }
      
      let hours = diffMs / (1000 * 60 * 60);
      
      // 扣除休息时间
      if (excludeBreakTime && breakStartTime && breakEndTime) {
        const breakStart = new Date(breakStartTime);
        const breakEnd = new Date(breakEndTime);
        
        let breakDiffMs = breakEnd.getTime() - breakStart.getTime();
        
        // 处理休息时间跨天情况
        if (breakDiffMs < 0) {
          breakDiffMs += 24 * 60 * 60 * 1000;
        }
        
        const breakHours = breakDiffMs / (1000 * 60 * 60);
        hours = Math.max(0, hours - breakHours);
      }
      
      this.editForm.patchValue({ 
        workHours: Number(hours.toFixed(1)) 
      }, { emitEvent: false });
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
      let breakStartTime: Date | null = null;
      let breakEndTime: Date | null = null;

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
      if (shiftType.breakStartTime) {
        const [breakStartHours, breakStartMinutes] = shiftType.breakStartTime.split(':');
        breakStartTime = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 
          parseInt(breakStartHours), parseInt(breakStartMinutes));
      }
      
      // 解析休息结束时间
      if (shiftType.breakEndTime) {
        const [breakEndHours, breakEndMinutes] = shiftType.breakEndTime.split(':');
        breakEndTime = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 
          parseInt(breakEndHours), parseInt(breakEndMinutes));
      }
      this.editingShiftType = { ...shiftType };
      this.editForm.patchValue({
        shiftTypeCode: shiftType.shiftTypeCode,
        shiftTypeName: shiftType.shiftTypeName,
        startTime: startTime,
        endTime: endTime,
         excludeBreakTime: shiftType.excludeBreakTime || false,
        breakStartTime: breakStartTime,
        breakEndTime: breakEndTime,
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
        workHours: 0,
        excludeBreakTime: false
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
      if (formValue.breakStartTime) {
        formValue.breakStartTime = formatDate(formValue.breakStartTime, 'HH:mm', 'en');
      }
      if (formValue.breakEndTime) {
        formValue.breakEndTime = formatDate(formValue.breakEndTime, 'HH:mm', 'en');
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