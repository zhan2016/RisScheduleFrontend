import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { KeyStatus } from 'src/app/core/models/common-models';
import {Module } from 'src/app/core/models/license-module';
import { System, SystemAuthorizationType } from 'src/app/core/models/license-systems';
import { ModuleService } from 'src/app/core/services/module.service';
import { SystemService } from 'src/app/core/services/system.service';

@Component({
  selector: 'app-module-form',
  templateUrl: './module-form.component.html',
  styleUrls: ['./module-form.component.scss']
})
export class ModuleFormComponent implements OnInit {

  @Input() module?: Module;
  @Input() systemId?: string;
  @Input() parentModule?: Module;  // 添加这个输入属性
  KeyStatusDict = KeyStatus;
  moduleForm!: FormGroup;
  submitting = false;
  AuthorizationType = SystemAuthorizationType;
  systems: System[] = []; // 存储系统列表

  constructor(
    private fb: FormBuilder,
    private modalRef: NzModalRef,
    private moduleService: ModuleService,
    private systemService: SystemService
  ) {
    this.createForm();
  }

  ngOnInit() {
    this.loadSystems();
    if (this.module) {
      this.moduleForm.patchValue({
        ...this.module,
        systemId: this.module.software!.id, // 使用 softwareId
        status: this.module.status === KeyStatus.ACTIVE
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
      systemId: ['', [Validators.required]], // 添加系统ID字段
      name: ['', [Validators.required]],
      description: [''],
      authType: [this.AuthorizationType.CONCURRENT, [Validators.required]],
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
        softwareId: formValue.systemId, // 将 systemId 转换为 softwareId
        status: formValue.status ? KeyStatus.ACTIVE : KeyStatus.INACTIVE
      };
      delete moduleData.systemId;
      
      // 如果 parentId 为空，则删除它
      if (!moduleData.parentId) {
        delete moduleData.parentId;
      }

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
  private loadSystems() {
    this.systemService.getSystems({page:1, pageSize:10000}).subscribe(
      systems => {
        this.systems = systems.data;
      }
    );
  }


}
