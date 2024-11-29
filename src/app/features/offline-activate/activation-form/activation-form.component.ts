import { Component, HostListener, Input, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { throwError } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { BatchActivationRequest, BatchActivationResult, OfflineActivation } from 'src/app/core/models/offline-activate';
import { OfflineActivateService } from 'src/app/core/services/offline-activate.service';
import { SystemService } from 'src/app/core/services/system.service';
import { ActivateSuccessComponent } from '../activate-success/activate-success.component';
import { LoadingService } from 'src/app/core/services/loading.service';

@Component({
  selector: 'app-activation-form',
  templateUrl: './activation-form.component.html',
  styleUrls: ['./activation-form.component.scss']
})
export class ActivationFormComponent implements OnInit {

  @Input() data: any;
  @Input() mode: 'edit' | 'view' = 'edit';
  submitting = false;
  form!: FormGroup;
  softwareOptions:any[] = []; // 软件列表
  moduleOptions:any[] = []; // 模块列表
  isSubmitting = false;
  moduleMap: Map<string, string> = new Map(); // 用于存储模块id和code的映射
  constructor(
    private fb: FormBuilder,
    private modalRef: NzModalRef,
    private modal: NzModalService,
    private activationService: OfflineActivateService,
    private softwareService: SystemService,
    private loadingService: LoadingService
  ) {
  }
   // 机器码验证器
  private machineCodesValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value as string;
      if (!value) {
        return { required: true };
      }
      
      const codes = this.parseMachineCodes(value);
      if (codes.length === 0) {
        return { required: true };
      }
      
      return null;
    };
  }

  private parseMachineCodes(value: string): string[] {
    // 如果已经是数组，直接返回
    if (Array.isArray(value)) {
      return value.filter(Boolean);
    }
    
    // 转换为字符串
    const str = String(value || '');
    
    // 按换行符和逗号分割
    return str
      .split(/[\n\r,，]+/)
      .map(code => code.trim())
      .filter(code => code.length > 0);
  }

  // 格式化机器码为统一格式（用换行符分隔）
  private formatMachineCodes(codes: string[]): string {
    return codes.join('\n');
  }

  // 获取机器码数量
  getMachineCodesCount(): number {
    const codes = this.parseMachineCodes(this.form.get('machineCodes')?.value || '');
    return codes.length;
  }

  // 处理粘贴事件，自动格式化
  @HostListener('paste', ['$event'])
  onPaste(event: ClipboardEvent) {
    event.preventDefault();
    const text = event.clipboardData?.getData('text') || '';
    const codes = this.parseMachineCodes(text);
    const formattedText = this.formatMachineCodes(codes);
    
    // 使用 FormControl 的 setValue 来更新值
    this.form.get('machineCodes')?.setValue(formattedText);
  }

  ngOnInit(): void {
    this.loadSoftwareList();
    this.initForm(); // 只在这里初始化表单一次

    // 监听软件变化，更新模块列表
    this.form.get('softwareId')?.valueChanges.subscribe(softwareId => {
      if (softwareId) {
        this.loadModules(softwareId);
      } else {
        this.moduleOptions = [];
        this.form.patchValue({ moduleIds: [] });
      }
    });
    this.form.get('moduleIds')?.valueChanges.subscribe(selectedIds => {
      if (selectedIds) {
        const selectedCodes = selectedIds.map((id: string) => this.moduleMap.get(id));
        this.form.patchValue({ moduleCodes: selectedCodes }, { emitEvent: false });
      }
    });

    if (this.mode === 'view') {
      this.form.disable();
    }
  }

  initForm() {
    const formData = {
      hospitalName: [this.data?.hospitalName || null, [Validators.required]],
      hospitalCode: [this.data?.hospitalCode || null],
      department: [this.data?.department || null],
      softwareId: [this.data?.modules?.softwareId || null, [Validators.required]],
      machineCodes: [
        Array.isArray(this.data?.machineCode) 
          ? this.data.machineCode 
          : this.data?.machineCode ? [this.data.machineCode] : [],
        [Validators.required, this.machineCodesValidator()]
      ],
      validRange: [
        this.data ? [this.data.validFrom, this.data.validTo] : null,
        [Validators.required]
      ],
      moduleIds: [this.data?.modules?.moduleIds || []]
    };

    this.form = this.fb.group(formData);
  }

// 加载软件列表
loadSoftwareList(): void {
  this.softwareService.getSystems({page: 1, pageSize: 1000}).subscribe(data => {
    this.softwareOptions = data.data.map(item => ({
      label: item.name,
      value: item.id
    }));
  });
}

  // 根据软件ID加载模块列表
  loadModules(softwareId: number): void {
    this.softwareService.getModules({systemId: softwareId, page: 1, pageSize: 1000}).subscribe(modules => {
      this.moduleOptions = modules.data.map(item => ({
        label: item.name,
        value: item.id,
        code: item.code
      }));
      modules.data.forEach(module => {
        this.moduleMap.set(module.id, module.code);
      });
    });
  }
  submitForm() {
    if (this.form.valid) {
      this.isSubmitting = true;
      const values = this.form.value;

      const machineCodes = values.machineCodes
      .split('\n')
      .map((code: string) => code.trim())
      .filter((code: string | any[]) => code.length > 0); // Remove empty strings

      const request: BatchActivationRequest = {
        machineCodes: machineCodes,
        licenseId: values.licenseId,
        softwareId: values.softwareId,
        moduleIds: values.moduleIds,
        moduleCodes: values.moduleIds.map((id: string) => this.moduleMap.get(id)),
        hospitalName: values.hospitalName,
        hospitalCode: values.hospitalCode || undefined,
        department: values.department || undefined,
        validTo: values.validRange[1]
      };
      
      console.log("request", request);
      const loading = this.loadingService.showLoading();
      this.activationService.batchCreateActivations(request)
        .pipe(
          finalize(() => {
            loading.close();
          })
        )
        .subscribe( (response) => {
          var response = (response as any).data as BatchActivationResult[];
          if (response.length > 0) {
            const activationList = response;
            loading.close();
            this.modal.create({
              nzTitle: '激活成功',
              nzContent: ActivateSuccessComponent,
              nzComponentParams: {
                activationList: activationList
              },
              nzWidth: 800,
              nzClassName: 'activation-success-modal',
              nzFooter: [
                {
                  label: '关闭',
                  onClick: () => this.modal.closeAll()
                }
              ]
            });
          }
          //this.modalRef.close(result);
        },
        (error) => {
          console.error('保存系统失败', error);
          this.submitting = false;
        });
      }

  }
  cancel() {
    this.modalRef.close();
  }

}
