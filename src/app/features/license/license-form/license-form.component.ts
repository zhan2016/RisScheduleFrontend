import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { License } from 'src/app/core/models/license-models';
import { Module } from 'src/app/core/models/license-module';
import { System } from 'src/app/core/models/license-systems';
import { LicenseService } from 'src/app/core/services/license.service';

@Component({
  selector: 'app-license-form',
  templateUrl: './license-form.component.html',
  styleUrls: ['./license-form.component.scss']
})
export class LicenseFormComponent implements OnInit {

  @Input() mainLicense?: License;  // 如果是patch授权，会传入主授权
  @Input() isPatch = false;

  form!: FormGroup;
  systems: System[] = [];
  modules: Module[] = [];
  loading = false;

  constructor(
    private fb: FormBuilder,
    private licenseService: LicenseService,
    private modalRef: NzModalRef,
    private message: NzMessageService
  ) {}

  ngOnInit() {
    this.initForm();
    this.loadSystems();
  }

  private initForm() {
    this.form = this.fb.group({
      hospitalName: [this.isPatch ? this.mainLicense?.hospitalName : '', [Validators.required]],
      systemId: [this.isPatch ? this.mainLicense?.systemId : null, [Validators.required]],
      moduleIds: [this.isPatch ? this.mainLicense?.moduleIds : [], [Validators.required]],
      concurrentLimit: [null, [Validators.required, Validators.min(1)]],
      terminals: this.fb.array([]),
      validFrom: [new Date(), [Validators.required]],
      validTo: [this.getDefaultValidTo(), [Validators.required]],
    });

    if (this.isPatch) {
      this.form.get('hospitalName')?.disable();
      this.form.get('systemId')?.disable();
    }
  }

  private getDefaultValidTo(): Date {
    const date = new Date();
    date.setMonth(date.getMonth() + 1);
    return date;
  }

  private loadSystems() {
    this.loading = true;
    this.licenseService.getSystems().subscribe({
      next: (systems) => {
        this.systems = systems;
        this.loading = false;
      },
      error: (error) => {
        this.message.error('加载系统列表失败: ' + error.message);
        this.loading = false;
      }
    });
  }

  onSystemChange(systemId: number) {
    const system = this.systems.find(s => s.id === systemId);
    this.modules = system?.modules || [];
    this.form.patchValue({ moduleIds: [] });
  }

  get terminals() {
    return this.form.get('terminals') as FormArray;
  }

  addTerminal() {
    this.terminals.push(this.fb.group({
      macAddress: ['', [Validators.required, Validators.pattern(/^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/)]],
      description: ['']
    }));
  }

  removeTerminal(index: number) {
    this.terminals.removeAt(index);
  }

  submitForm() {
    if (this.form.invalid) {
      Object.values(this.form.controls).forEach(control => {
        if (control.invalid) {
          control.markAsTouched();
        }
      });
      return;
    }

    const data = this.form.getRawValue();
    
    const observable = this.isPatch
      ? this.licenseService.createPatchLicense(this.mainLicense!.id, data)
      : this.licenseService.createLicense(data);

    observable.subscribe({
      next: () => {
        this.message.success(`${this.isPatch ? '补丁' : ''}授权创建成功`);
        this.modalRef.close(true);
      },
      error: (error) => {
        this.message.error(`创建${this.isPatch ? '补丁' : ''}授权失败: ` + error.message);
      }
    });
  }
}
