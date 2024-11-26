import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { KeyStatus } from 'src/app/core/models/common-models';
import { Role } from 'src/app/core/models/role-permission';
import { User } from 'src/app/core/models/user-manage';
import { RoleService } from 'src/app/core/services/role.service';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent implements OnInit {

  @Input() user?: User;
  form!: FormGroup;
  roles: Role[] = [];
  
  constructor(
    private fb: FormBuilder,
    private modal: NzModalRef,
    private roleService: RoleService
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      username: [this.user?.username || '', [Validators.required, Validators.pattern(/^[a-zA-Z0-9_]{4,20}$/)]],
      password: ['123456', this.user ? [] : [Validators.required, Validators.minLength(6)]],  // 添加password字段
      roleId: [this.user?.roleId, [Validators.required]], // 添加role字段
      realName: [this.user?.realName || '', [Validators.required]],
      email: [this.user?.email || '', [Validators.required, Validators.email]],
      phone: [this.user?.phone || '', [Validators.required, Validators.pattern(/^1[3-9]\d{9}$/)]],
      validDateRange: [
        [
          this.user?.validFrom ? new Date(this.user.validFrom) : new Date(), 
          this.user?.validTo ? new Date(this.user.validTo) : new Date()
        ],
        [Validators.required]
      ],
      status: [this.user?.status || KeyStatus.ACTIVE]
    });

    if (this.user) {
      this.form.get('username')?.disable();
      this.form.get('password')?.clearValidators();
      this.form.get('password')?.updateValueAndValidity();
    }
    this.loadRoles();
  }
  loadRoles() {
    this.roleService.getRoles().subscribe({
      next: (roles) => {
        this.roles = roles;
      },
      error: (error) => {
        console.error('Failed to load roles:', error);
      }
    });
  }

  submitForm() {
    //console.log(this.form.valid);
    if (this.form.valid) {
      const formData = this.form.value;
      const [validFrom, validTo] = formData.validDateRange;
      console.log(formData, this.user);
      const submitData = {
        ...formData,
        validFrom,
        validTo,
        username: this.user ? this.user.username : formData.username,
        validDateRange: undefined // Remove the validDateRange field
      };
      console.log(formData, this.user);
      if (!this.user) {
        // 如果是新建用户，包含password
        this.modal.close(submitData);
      } else {
        // 如果是编辑用户，删除password字段
        const { password, ...updateData } = submitData;
        this.modal.close(updateData);
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
