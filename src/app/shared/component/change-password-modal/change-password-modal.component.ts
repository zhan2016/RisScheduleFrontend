import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-change-password-modal',
  templateUrl: './change-password-modal.component.html',
  styleUrls: ['./change-password-modal.component.scss']
})
export class ChangePasswordModalComponent implements OnInit {

  passwordForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private modalRef: NzModalRef,
    private message: NzMessageService,
    private userService: UserService
  ) {
    this.passwordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, {
      validator: this.passwordMatchValidator
    });
  }
  ngOnInit(): void {
    
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('newPassword')?.value === g.get('confirmPassword')?.value
      ? null : {'mismatch': true};
  }

  submitForm() {
    if (this.passwordForm.valid) {
      this.userService.changePassword(
        this.passwordForm.value.currentPassword,
        this.passwordForm.value.newPassword
      ).subscribe(
        () => {
          this.message.success('密码修改成功');
          this.modalRef.close();
        },
        (error:any) => {
          this.message.error('密码修改失败：' + error.message);
        }
      );
    }
  }

  cancel() {
    this.modalRef.close();
  }

}
