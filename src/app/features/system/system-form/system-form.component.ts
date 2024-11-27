import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { finalize } from 'rxjs/operators';
import { KeyStatus } from 'src/app/core/models/common-models';
import { EncryptionKey } from 'src/app/core/models/encryption-key';
import { System, SystemAuthorizationType, SystemStatus } from 'src/app/core/models/license-systems';
import { EncryptionKeyService } from 'src/app/core/services/encryption-key.service';
import { SystemService } from 'src/app/core/services/system.service';

@Component({
  selector: 'app-system-form',
  templateUrl: './system-form.component.html',
  styleUrls: ['./system-form.component.scss']
})
export class SystemFormComponent implements OnInit {
  @Input() system?: System;
  
  systemForm!: FormGroup;
  submitting = false;
  AuthorizationType = SystemAuthorizationType;
  encryptionKeys: EncryptionKey[] = [];

  constructor(
    private fb: FormBuilder,
    private modalRef: NzModalRef,
    private systemService: SystemService,
    private encryptionKeyService: EncryptionKeyService
  ) {
    this.createForm();
  }

  ngOnInit() {
    if (this.system) {
      this.systemForm.patchValue({
        ...this.system,
        status: this.system.status === SystemStatus.ACTIVE
      });
    }
    // 加载可用的加密key
    this.loadEncryptionKeys();
  }

  loadEncryptionKeys() {
    this.encryptionKeyService.getKeys({ status: KeyStatus.ACTIVE })
      .subscribe(response => {
        this.encryptionKeys = response.data;
      });
  }

  private createForm() {
    this.systemForm = this.fb.group({
      name: ['', [Validators.required]],
      code: ['', [
        Validators.required, 
        Validators.pattern('^[a-zA-Z0-9][a-zA-Z0-9_]*$')
      ]],
      description: [''],
      maxConcurrent: [1, [Validators.required, Validators.min(1)]],
      authType: [SystemAuthorizationType.CONCURRENT, [Validators.required]],
      independentAuth: [false],
      status: [true],
      encryptionKeyId: [this.system?.encryptionKeyId]
    });
  }

  submitForm() {
    if (this.systemForm.valid) {
      this.submitting = true;
      const formValue = this.systemForm.value;
      const systemData = {
        ...formValue,
        status: formValue.status ? SystemStatus.ACTIVE : SystemStatus.INACTIVE
      };

      const request = this.system
        ? this.systemService.updateSystem(this.system.id, systemData)
        : this.systemService.createSystem(systemData);

      request.subscribe(
        (result) => {
          this.modalRef.close(result);
        },
        (error) => {
          console.error('保存系统失败', error);
          this.submitting = false;
        }
      );
    }
  }

  cancel() {
    this.modalRef.close();
  }
}
