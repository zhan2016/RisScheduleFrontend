// src/app/features/assignment-strategy/components/strategy-form/strategy-form.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AssignmentStrategy } from 'src/app/core/models/assigment-stragegy';
import { AssignmentStrategyService } from 'src/app/core/services/assignment-strategy.service';

@Component({
  selector: 'app-strategy-form',
  templateUrl: './strategy-form.component.html'
})
export class StrategyFormComponent implements OnInit {
  form!: FormGroup;
  isEdit = false;
  loading = false;
  strategyId: string | null = null;

  distributionModes = [
    { label: '平均模式', value: '1' },
    { label: '绩效模式', value: '2' }
  ];

  triggerPoints = [
    { label: '登记完成后', value: '1' },
    { label: '检查完成后', value: '2' }
  ];

  reportScopes = [
    { label: '仅初步报告', value: '1' },
    { label: '仅审核报告', value: '2' },
    { label: '全部', value: '3' }
  ];

  constructor(
    private fb: FormBuilder,
    private strategyService: AssignmentStrategyService,
    private route: ActivatedRoute,
    public router: Router,
    private message: NzMessageService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.strategyId = this.route.snapshot.paramMap.get('id');
    if (this.strategyId) {
      this.isEdit = true;
      this.loadStrategy();
    }
  }

  initForm(): void {
    this.form = this.fb.group({
      strategyName: [null, [Validators.required]],
      distributionMode: ['1', [Validators.required]],
      onlineOnly: ['0'],
      triggerPoint: ['1', [Validators.required]],
      reportScope: ['3', [Validators.required]],
      retryCount: [3, [Validators.required, Validators.min(0), Validators.max(10)]],
      retryInterval: [300, [Validators.required, Validators.min(0)]],
      isDefault: ['0'],
      isActive: ['1'],
      description: [null],
      workloadMode: ['1'],
      preliminaryWeight: [1.0],
      reviewWeight: [1.0]
    });
  }

  loadStrategy(): void {
    this.loading = true;
    this.strategyService.getStrategy(this.strategyId!).subscribe({
      next: (strategy) => {
        this.form.patchValue(strategy);
        this.loading = false;
      },
      error: (error) => {
        this.message.error('加载失败: ' + error.message);
        this.loading = false;
      }
    });
  }

  submit(): void {
    if (this.form.valid) {
      const formValue = this.form.value;
      
      // 构造提交数据，确保所有boolean值转为字符串
      const strategy: AssignmentStrategy = {
        strategyName: formValue.strategyName,
        distributionMode: formValue.distributionMode,
        onlineOnly: formValue.onlineOnly ? '1' : '0',    // 确保是字符串
        triggerPoint: formValue.triggerPoint,
        reportScope: formValue.reportScope,
        retryCount: formValue.retryCount,
        retryInterval: formValue.retryInterval,
        isDefault: formValue.isDefault ? '1' : '0',      // 确保是字符串
        isActive: formValue.isActive === true ? '1' : '0', // 确保是字符串
        description: formValue.description || '',         // null转为空字符串
        workloadMode: formValue.workloadMode || '1',
        preliminaryWeight: formValue.preliminaryWeight || 1.0,
        reviewWeight: formValue.reviewWeight || 0.8
      };
  
      // 编辑时才添加strategyId
      if (this.isEdit && this.strategyId) {
        strategy.strategyId = this.strategyId;
      }
  
      this.loading = true;
      const request = this.isEdit
        ? this.strategyService.updateStrategy(strategy)
        : this.strategyService.createStrategy(strategy);
  
      request.subscribe({
        next: () => {
          this.message.success(`${this.isEdit ? '更新' : '创建'}成功`);
          this.router.navigate(['../'], { relativeTo: this.route });
        },
        error: (error) => {
          this.message.error(`${this.isEdit ? '更新' : '创建'}失败: ${error.message}`);
          this.loading = false;
        }
      });
    } else {
      // 标记所有无效的表单控件
      Object.values(this.form.controls).forEach(control => {
        if (control.invalid) {
          control.markAsTouched();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }
  cancel(): void {
    this.router.navigate(['../'], { relativeTo: this.route });
  }
}