import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { ExamUser } from 'src/app/core/models/common-models';
import { BatchAssignDTO } from 'src/app/core/models/report-assignment';
import { ReportAssignmentService } from 'src/app/core/services/report-assignment.service';

@Component({
  selector: 'app-transfer-modal',
  templateUrl: './transfer-modal.component.html',
  styleUrls: ['./transfer-modal.component.scss']
})
export class TransferModalComponent implements OnInit  {
  @Input() doctorList: ExamUser[] = []; // 医生列表
  @Input() selectedRows: any[] = []; // 被选择的行
  @Output() transferConfirmed = new EventEmitter<any>(); // 转发确认事件
  @Output() modalClosed = new EventEmitter<void>(); // 关闭模态框

  transferForm!: FormGroup;
  isPreliminaryDoctorVisible = false;
  isReviewDoctorVisible = false;

  constructor(
    private fb: FormBuilder,
    private reportAssignmentService: ReportAssignmentService,
    private message: NzMessageService,
    private modal: NzModalRef,
  ) {

  }
  ngOnInit(): void {
    this.transferForm = this.fb.group({
      doctorType: ['preliminary'],
      preliminaryDoctorId: [null],
      reviewDoctorId: [null]
    });
  
    // 初始化可见性
    this.isPreliminaryDoctorVisible = true;
    this.isReviewDoctorVisible = true;
    this.setDoctorValidation();
  }
  setDoctorValidation(): void {
    const doctorType = this.transferForm.get('doctorType')?.value;
    const preliminaryDoctorControl = this.transferForm.get('preliminaryDoctorId');
    const reviewDoctorControl = this.transferForm.get('reviewDoctorId');

    // Reset previous validations
    preliminaryDoctorControl?.clearValidators();
    reviewDoctorControl?.clearValidators();

    if (doctorType === 'preliminary') {
      preliminaryDoctorControl?.setValidators([Validators.required]);
      this.isPreliminaryDoctorVisible = true;
      this.isReviewDoctorVisible = false;
    } else if (doctorType === 'review') {
      reviewDoctorControl?.setValidators([Validators.required]);
      this.isPreliminaryDoctorVisible = false;
      this.isReviewDoctorVisible = true;
    } else {
      preliminaryDoctorControl?.setValidators([Validators.required]);
      reviewDoctorControl?.setValidators([Validators.required]);
      this.isPreliminaryDoctorVisible = true;
      this.isReviewDoctorVisible = true;
    }

    // Mark the controls as dirty so they will be checked during validation
    preliminaryDoctorControl?.updateValueAndValidity();
    reviewDoctorControl?.updateValueAndValidity();
  }
  // 根据选择的转发医生类型显示对应的选择字段
  onDoctorTypeChange(doctorType: string): void {
    this.setDoctorValidation();
  }

  // 确认转发
  onConfirm(): void {
    if (!this.transferForm.valid) { 

    }
    const { doctorType, preliminaryDoctorId, reviewDoctorId } = this.transferForm.value;
    
    const transferData = {
      doctorType,
      preliminaryDoctorId,
      reviewDoctorId,
      selectedRows: this.selectedRows
    };
    const batchTransferData: BatchAssignDTO = {
      preliminaryDoctorId,
      reviewDoctorId,
      risNos: this.selectedRows.map(item => item.risNo)
    }
    //console.log(transferData);
    this.reportAssignmentService.transferAssignments(batchTransferData)
        .subscribe(res => {
          //console.log(res);
          this.message.success("批量转发成功");
          this.modal.close();
        });

     // 关闭模态框
  }

  // 取消转发
  onCancel(): void {
    this.modal.close();
  }
}
