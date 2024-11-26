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
      authType: ['', Validators.required],
      concurrentLimit: [{ value: null, disabled: true }],
      validRange: [null, Validators.required],
      systemTerminals: this.fb.array([]),
      modules: this.fb.array([])
    });

    this.form.get('authType')?.valueChanges.subscribe(authType => {
      const concurrentControl = this.form.get('concurrentLimit');
      if (authType === SystemAuthorizationType.CONCURRENT || 
          authType === SystemAuthorizationType.BOTH) {
        concurrentControl?.enable();
      } else {
        concurrentControl?.disable();
        this.form.patchValue({ concurrentLimit: null });
      }
    });
  }

  get modulesArray() {
    return this.form.get('modules') as FormArray;
  }

  get systemTerminalsArray() {
    return this.form.get('systemTerminals') as FormArray;
  }

  private loadSoftwares() {
    this.softwareService.getSystems({page: 1, pageSize: 1000}).subscribe(data => {
      this.softwares = data.data;
    });
  }

  onSoftwareChange(softwareId: number) {
    const software = this.getSelectedSoftware();
    if (!software) return;

    this.form.patchValue({ authType: software.authType });

    const modulesArray = this.modulesArray;
    modulesArray.clear();
    this.systemTerminalsArray.clear();

    this.softwareService.getModules({systemId: softwareId, page: 1, pageSize: 1000}).subscribe(modules => {
      modules.data.forEach(module => {
        modulesArray.push(this.createModuleForm(module));
      });
    });
  }

  private createModuleForm(module: Module) {
    return this.fb.group({
      moduleId: [module.id],
      name: [module.name],
      enabled: [true]  // 默认选中
    });
  }

  private createTerminalForm() {
    return this.fb.group({
      name: ['', Validators.required],
      macAddress: ['', [
        Validators.required, 
        Validators.pattern(/^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/)
      ]]
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
    this.systemTerminalsArray.push(this.createTerminalForm());
  }

  removeSystemTerminal(index: number) {
    this.systemTerminalsArray.removeAt(index);
  }

  submit() {
    if (!this.form.valid) {
      this.markAllAsTouched(this.form);
      this.message.warning('请填写所有必填项');
      return;
    }
  
    const formValue = this.form.value;
    const request = this.prepareLicenseData(formValue);
    console.log(JSON.stringify(request));
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
          moduleId: m.moduleId
        }))
    };
  }
}

