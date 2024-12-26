import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { finalize } from 'rxjs/operators';
import { LicenseEdition } from 'src/app/core/models/common-models';
import { License, LicenseModuleInfo, LicensePatchRequest, LicenseQueryResponse, LicenseRequest, LicenseTerminal, PatchLicenseInfo } from 'src/app/core/models/license-models';
import { Module } from 'src/app/core/models/license-module';
import { System, SystemAuthorizationType } from 'src/app/core/models/license-systems';
import { LicenseService } from 'src/app/core/services/license.service';
import { LoadingService } from 'src/app/core/services/loading.service';
import { SystemService } from 'src/app/core/services/system.service';

@Component({
  selector: 'app-patch-page',
  templateUrl: './patch-page.component.html',
  styleUrls: ['./patch-page.component.scss']
})
export class PatchPageComponent implements OnInit {
  @Input()
  existingLicense!: LicenseQueryResponse; // 接收现有license数据
  form!: FormGroup;
  softwares: System[] = [];
  authTypes = SystemAuthorizationType;
  LicenseEdition = LicenseEdition; // 使模板可以访问枚举

  constructor(
    private fb: FormBuilder,
    private softwareService: SystemService,
    private licenseService: LicenseService,
    private message: NzMessageService,
    private modal: NzModalRef,
    private loadingService: LoadingService
  ) {
    //this.createForm();
  }

  ngOnInit() {
    this.loadSoftwares();
    this.initForm();
  }
  private loadSoftwares() {
    this.softwareService.getSystems({page: 1, pageSize: 1000}).subscribe(data => {
      this.softwares = data.data;
    });
  }
  private initForm() {
    // 创建表单时使用现有license数据
    this.form = this.fb.group({
      // 只读字段 - 显示但不可修改
      hospitalName: [{value: this.existingLicense.hospitalName, disabled: true}],
      softwareId: [{value: this.existingLicense.softwareId, disabled: true}],
      licenseEdition: [{value: this.existingLicense.licenseEdition, disabled: true}],
      authType:[{value: this.existingLicense.software.authType, disabled: true}],
      // 可修改字段
      validRange: [[new Date(this.existingLicense.validFrom), new Date(this.existingLicense.validTo)], Validators.required],
      concurrentLimit: [this.existingLicense.concurrentLimit],
      systemTerminals: this.fb.array([]),
      modules: this.fb.array([])
    });

    // 初始化终端列表
    this.existingLicense?.terminals?.forEach(terminal => {
      this.systemTerminalsArray.push(this.createTerminalForm(terminal));
    });
  
    this.softwareService.getModules({systemId: this.existingLicense.softwareId as any, page: 1, pageSize: 1000}).subscribe(modules => {
      modules.data.forEach(module => {
        this.modulesArray.push(this.createModuleForm(module));
      });
    });
  }

  
  get modulesArray() {
    return this.form.get('modules') as FormArray;
  }

  get systemTerminalsArray() {
    return this.form.get('systemTerminals') as FormArray;
  }



  private createModuleForm(module: Module) {
    const existModuleIds = this.existingLicense.modules.map(item => item.id);
    return this.fb.group({
      moduleId: [module.id],
      name: [module.name],
      code: [module.code],
      enabled: [existModuleIds.includes(module.id)],
      concurrentLimit: [{ value: 1, disabled: false }, [Validators.required, Validators.min(1)]]  // 修改这里
    });
  }

  private createTerminalForm(terminal: LicenseTerminal) {
    return this.fb.group({
      name: [terminal.name, Validators.required],
      macAddress: [terminal.macAddress, [
        Validators.required, 
        Validators.pattern(/^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/)
      ]],
      id: [terminal.id]
    });
  }

  getSelectedSoftware(): System | undefined {
    const softwareId = this.form.get('softwareId')?.value;
    return this.softwares.find(s => s.id === softwareId);
  }

  getAuthTypeDisplay(authType: SystemAuthorizationType): string {
    const authTypes: Record<SystemAuthorizationType, string> = {
      [SystemAuthorizationType.TERMINAL]: '终端授权',
      [SystemAuthorizationType.CONCURRENT]: '并发授权',
      [SystemAuthorizationType.BOTH]: '终端和并发授权'
    };
    return authTypes[authType] || authType;
  }

  isSoftwareConcurrentAuth(): boolean {
    const authType = this.form.get('authType')?.value;
    return authType === SystemAuthorizationType.CONCURRENT || 
           authType === SystemAuthorizationType.BOTH;
  }

  isSoftwareTerminalAuth(): boolean {
    const authType = this.form.get('authType')?.value;
    return authType === SystemAuthorizationType.TERMINAL || 
           authType === SystemAuthorizationType.BOTH;
  }

  getMaxConcurrent(): number {
    const software = this.getSelectedSoftware();
    return software?.maxConcurrent || 999999;
  }

  addSystemTerminal() {
    //this.systemTerminalsArray.push(this.createTerminalForm());
  }

  removeSystemTerminal(index: number) {
    this.systemTerminalsArray.removeAt(index);
  }

  submit() {
    for (const i in this.form.controls) {
      const control = this.form.controls[i];
      if (control.errors) {
        console.log(`${i} errors:`, control.errors);
      }
    }
    if (!this.form.valid) {
      this.markAllAsTouched(this.form);
      this.message.warning('请填写所有必填项');
      return;
    }
  
    const formValue = this.form.value;
    const request = this.prepareLicenseData(formValue);
    const loading = this.loadingService.showLoading();
    
    this.licenseService.generatePatch(this.existingLicense.id, request)
      .pipe(
        finalize(() => {
          loading.close();
        })
      )
      .subscribe({
        next: (response) => {
          this.message.success('补丁授权创建成功');
          console.log('License created:', response);
          
          // 可选：重置表单
          //this.form.reset();
          
          // 可选：触发回调或路由跳转
          // this.router.navigate(['/licenses']);
          // this.onSuccess.emit(response);
        },
        error: (error) => {
          console.error('Create license failed:', error);
          
          // 错误信息处理
          let errorMessage = '创建授权失败';
          if (error.error?.message) {
            errorMessage = error.error.message;
          } else if (error.status === 400) {
            errorMessage = '请求参数有误';
          } else if (error.status === 401) {
            errorMessage = '未授权，请重新登录';
          } else if (error.status === 500) {
            errorMessage = '服务器错误，请稍后重试';
          }
          
          this.message.error(errorMessage);
        }
      });
  }
  
  private markAllAsTouched(control: AbstractControl) {
    if (control instanceof FormControl) {
      control.markAsTouched();
    } else if (control instanceof FormGroup) {
      Object.keys(control.controls).forEach(key => {
        this.markAllAsTouched(control.get(key)!);
      });
    } else if (control instanceof FormArray) {
      control.controls.forEach(c => {
        this.markAllAsTouched(c);
      });
    }
  }

  private prepareLicenseData(formValue: any): LicensePatchRequest {
    return {
      concurrentLimit: formValue.concurrentLimit,
      validFrom: formValue.validRange[0],
      validTo: formValue.validRange[1],
      systemTerminals: formValue.systemTerminals,
      modules: formValue.modules
        .filter((m: any) => m.enabled)
        .map((m: any) => ({
          moduleId: m.moduleId,
          code: m.code
        }))
    };
  }

}
