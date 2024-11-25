import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { EncryptionKey } from 'src/app/core/models/encryption-key';

@Component({
  selector: 'app-encryption-key-form',
  templateUrl: './encryption-key-form.component.html',
  styleUrls: ['./encryption-key-form.component.scss']
})
export class EncryptionKeyFormComponent implements OnInit {

  @Input() key?: EncryptionKey;
  form!: FormGroup;
  showKey = false;

  constructor(
    private fb: FormBuilder,
    private modal: NzModalRef
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      name: [this.key?.name || '', [Validators.required, Validators.maxLength(50)]],
      key: [this.key?.key || '', [Validators.required, Validators.minLength(32)]],
      description: [this.key?.description || ''],
      isDefault: [this.key?.isDefault || false]
    });
  }

  generateKey() {
    // 生成32位随机密钥
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let key = '';
    for (let i = 0; i < 32; i++) {
      key += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    this.form.patchValue({ key });
  }

  submitForm() {
    if (this.form.valid) {
      const formData = this.form.value;
      if (this.key) {
        // 编辑模式：合并原有数据
        this.modal.close({
          ...this.key,
          ...formData
        });
      } else {
        // 创建模式：直接使用表单数据
        this.modal.close(formData);
      }
    } else {
      Object.values(this.form.controls).forEach(control => {
        if (control.invalid) {
          control.markAsTouched();
        }
      });
    }
  }

  cancel() {
    this.modal.close();
  }

}
