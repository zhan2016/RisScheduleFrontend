import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { User } from 'src/app/core/models/user-manage';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent implements OnInit {

  @Input() user?: User;
  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private modal: NzModalRef
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      username: [this.user?.username || '', [Validators.required, Validators.pattern(/^[a-zA-Z0-9_]{4,20}$/)]],
      realName: [this.user?.realName || '', [Validators.required]],
      email: [this.user?.email || '', [Validators.required, Validators.email]],
      phone: [this.user?.phone || '', [Validators.required, Validators.pattern(/^1[3-9]\d{9}$/)]],
      validFrom: [this.user?.validFrom || new Date(), [Validators.required]],
      validTo: [this.user?.validTo || null, [Validators.required]],
      status: [this.user?.status || 'active']
    });

    if (this.user) {
      this.form.get('username')?.disable();
    }
  }

  submitForm() {
    if (this.form.valid) {
      const formData = this.form.value;
      if (this.user) {
        this.modal.close({
          ...this.user,
          ...formData,
          username: this.user.username
        });
      } else {
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
