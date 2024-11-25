import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { AuthorizationType, Module, ModuleStatus } from 'src/app/core/models/license-module';
import { ModuleService } from 'src/app/core/services/module.service';

@Component({
  selector: 'app-module-form',
  templateUrl: './module-form.component.html',
  styleUrls: ['./module-form.component.scss']
})
export class ModuleFormComponent implements OnInit {

  @Input() module?: Module;
  @Input() systemId?: string;
  @Input() parentModule?: Module;  // 添加这个输入属性

  moduleForm!: FormGroup;
  submitting = false;
  AuthorizationType = AuthorizationType;

  constructor(
    private fb: FormBuilder,
    private modalRef: NzModalRef,
    private moduleService: ModuleService
  ) {
    this.createForm();
  }

  ngOnInit() {
    if (this.module) {
      this.moduleForm.patchValue({
        ...this.module,
        status: this.module.status === ModuleStatus.ACTIVE
      });
    }
     // 如果有父模块，可以设置一些默认值或进行其他处理
     if (this.parentModule) {
      this.moduleForm.patchValue({
        parentId: this.parentModule.id
      });
    }
  }

  private createForm() {
    this.moduleForm = this.fb.group({
      name: ['', [Validators.required]],
      description: [''],
      authType: [AuthorizationType.CONCURRENT, [Validators.required]],
      independentAuth: [false, [Validators.required]],
      status: [true]
    });
  }

  submitForm() {
    if (this.moduleForm.valid) {
      this.submitting = true;
      const formValue = this.moduleForm.value;
      const moduleData = {
        ...formValue,
        systemId: this.systemId,
        status: formValue.status ? ModuleStatus.ACTIVE : ModuleStatus.INACTIVE
      };

      const request = this.module
        ? this.moduleService.updateModule(this.module.id, moduleData)
        : this.moduleService.createModule(moduleData);

      request.subscribe(
        () => {
          this.modalRef.close(true);
          this.submitting = false;
        },
        error => {
          this.submitting = false;
          // 处理错误
        }
      );
    }
  }

  cancel() {
    this.modalRef.close();
  }

}
