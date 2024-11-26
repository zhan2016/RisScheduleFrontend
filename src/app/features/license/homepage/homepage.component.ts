import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';
import { License } from 'src/app/core/models/license-models';
import { Module } from 'src/app/core/models/license-module';
import { System, SystemAuthorizationType } from 'src/app/core/models/license-systems';
import { AuthService } from 'src/app/core/services/auth.service';
import { LicenseService } from 'src/app/core/services/license.service';
import { SystemService } from 'src/app/core/services/system.service';
import { LicenseFormComponent } from '../license-form/license-form.component';
import { PatchLicenseListComponent } from '../patch-license-list/patch-license-list.component';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit {
  form!: FormGroup;
  softwares: System[] = [];
  authTypes = SystemAuthorizationType;

  constructor(
    private fb: FormBuilder,
    private softwareService: SystemService,
    private licenseService: LicenseService,
    private message: NzMessageService
  ) {
    this.createForm();
  }

  ngOnInit() {
    this.loadSoftwares();
  }

  private createForm() {
    this.form = this.fb.group({
      hospitalName: ['', Validators.required],
      softwareId: ['', Validators.required],
      authType: ['', Validators.required], // 选择授权类型
      concurrentLimit: [{ value: null, disabled: true }], // 初始状态为禁用
      validRange: [null, Validators.required],
      systemTerminals: this.fb.array([]), // 系统级终端
      modules: this.fb.array([])
    });

    // 监听授权类型变化
    this.form.get('authType')?.valueChanges.subscribe(authType => {
      if (authType === SystemAuthorizationType.CONCURRENT || 
          authType === SystemAuthorizationType.BOTH) {
        this.form.get('concurrentLimit')?.enable();
      } else {
        this.form.get('concurrentLimit')?.disable();
        this.form.patchValue({ concurrentLimit: null });
      }
    });
  }

  // Form Arrays 获取器
  get modulesArray() {
    return this.form.get('modules') as FormArray;
  }

  get systemTerminalsArray() {
    return this.form.get('systemTerminals') as FormArray;
  }

  // 获取模块的终端列表
  getModuleTerminals(moduleIndex: number): FormArray {
    const moduleControl = this.modulesArray.at(moduleIndex);
    if (!moduleControl) {
      return this.fb.array([]); // 返回空数组
    }
    const terminals = moduleControl.get('moduleTerminals');
    return terminals as FormArray || this.fb.array([]);
  }

  // 加载系统列表
  private loadSoftwares() {
    this.softwareService.getSystems({page: 1, pageSize: 1000}).subscribe(data => {
      this.softwares = data.data;
    });
  }

  // 系统选择改变时的处理
  onSoftwareChange(softwareId: number) {
    const software = this.getSelectedSoftware();
    if (!software) return;

    // 设置系统授权类型
    this.form.patchValue({ 
      authType: software.authType 
    });

    // 清空并重新加载模块列表
    const modulesArray = this.modulesArray;
    modulesArray.clear();
    this.systemTerminalsArray.clear();

    this.softwareService.getModules({systemId: softwareId, page: 1, pageSize: 1000}).subscribe(modules => {
      modules.data.forEach(module => {
        modulesArray.push(this.createModuleForm(module));
      });
    });
  }

  // 创建模块表单组
  private createModuleForm(module: Module) {
    if (!module) {
      return this.fb.group({}); // 返回空表单组
    }
    const group = this.fb.group({
      moduleId: [module.id],
      name: [module.name],
      enabled: [false],
      authType: [module.authType], // 模块授权类型
      concurrentLimit: [{ value: null, disabled: true }],
      validRange: [null],
      moduleTerminals: this.fb.array([]) // 模块级终端
    });

    // 监听enabled状态变化
    group.get('enabled')?.valueChanges.subscribe(enabled => {
      const concurrentControl = group.get('concurrentLimit');
      const validRangeControl = group.get('validRange');
      
      if (enabled) {
        if (this.isModuleConcurrentAuth(group)) {
          concurrentControl?.enable();
        }
        validRangeControl?.enable();
      } else {
        concurrentControl?.disable();
        validRangeControl?.disable();
        group.patchValue({
          concurrentLimit: null,
          validRange: null
        });
      }
    });

    return group;
  }

  // 创建终端表单组
  private createTerminalForm() {
    return this.fb.group({
      name: ['', Validators.required],
      macAddress: ['', [
        Validators.required, 
        Validators.pattern(/^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/)
      ]]
    });
  }

  // 获取选中的系统
  getSelectedSoftware(): System | undefined {
    const softwareId = this.form.get('softwareId')?.value;
    return this.softwares.find(s => s.id === softwareId);
  }

  // 获取授权类型显示文本
  getAuthTypeDisplay(authType: SystemAuthorizationType): string {
    const authTypes: Record<SystemAuthorizationType, string> = {
      [SystemAuthorizationType.TERMINAL]: '终端授权',
      [SystemAuthorizationType.CONCURRENT]: '并发授权',
      [SystemAuthorizationType.BOTH]: '终端和并发授权'
    };
    return authTypes[authType] || authType;
  }

  // 判断系统是否支持并发授权
  isSoftwareConcurrentAuth(): boolean {
    const authType = this.form.get('authType')?.value;
    return authType === SystemAuthorizationType.CONCURRENT || 
           authType === SystemAuthorizationType.BOTH;
  }

  // 判断系统是否支持终端授权
  isSoftwareTerminalAuth(): boolean {
    const authType = this.form.get('authType')?.value;
    return authType === SystemAuthorizationType.TERMINAL || 
           authType === SystemAuthorizationType.BOTH;
  }

  isModuleConcurrentAuth(moduleControl: AbstractControl): boolean {
    const authType = moduleControl.get('authType')?.value;
    return authType === SystemAuthorizationType.CONCURRENT || 
           authType === SystemAuthorizationType.BOTH;
  }

  isModuleTerminalAuth(moduleControl: AbstractControl): boolean {
    const authType = moduleControl.get('authType')?.value;
    return authType === SystemAuthorizationType.TERMINAL || 
           authType === SystemAuthorizationType.BOTH;
  }

  // 获取最大并发数
  getMaxConcurrent(): number {
    const software = this.getSelectedSoftware();
    return software?.maxConcurrent || 999999;
  }

  // 添加系统终端
  addSystemTerminal() {
    this.systemTerminalsArray.push(this.createTerminalForm());
  }

  // 删除系统终端
  removeSystemTerminal(index: number) {
    this.systemTerminalsArray.removeAt(index);
  }

  // 添加模块终端
  addModuleTerminal(moduleIndex: number) {
    const moduleTerminals = this.getModuleTerminals(moduleIndex);
    moduleTerminals.push(this.createTerminalForm());
  }

  // 删除模块终端
  removeModuleTerminal(moduleIndex: number, terminalIndex: number) {
    const moduleTerminals = this.getModuleTerminals(moduleIndex);
    moduleTerminals.removeAt(terminalIndex);
  }

  // 提交表单
  submit() {
    if (!this.form.valid) {
      this.markAllAsTouched(this.form);
      this.message.warning('请填写所有必填项, 并发数/日期未选择');
      return;
    }
  
    const formValue = this.form.value;
    const request = this.prepareLicenseData(formValue);
    console.log(request);
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

  private prepareLicenseData(formValue: any): any {
    return {
      hospitalName: formValue.hospitalName,
      softwareId: formValue.softwareId,
      authType: formValue.authType,
      concurrentLimit: formValue.concurrentLimit,
      validFrom: formValue.validRange[0],
      validTo: formValue.validRange[1],
      systemTerminals: formValue.systemTerminals,
      modules: formValue.modules
        .filter((m: any) => m.enabled)
        .map((m: any) => ({
          moduleId: m.moduleId,
          authType: m.authType,
          concurrentLimit: m.concurrentLimit,
          validFrom: m.validRange[0],
          validTo: m.validRange[1],
          moduleTerminals: m.moduleTerminals
        }))
    };
  }
}

