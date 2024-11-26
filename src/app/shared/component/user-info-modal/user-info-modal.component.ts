import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { AuthService, User } from 'src/app/core/services/auth.service';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-user-info-modal',
  templateUrl: './user-info-modal.component.html',
  styleUrls: ['./user-info-modal.component.scss']
})
export class UserInfoModalComponent implements OnInit {

  @Input() user!: User;
  userForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private modalRef: NzModalRef,
    private message: NzMessageService,
    private userService: UserService,
    private authService: AuthService
  ) {
    this.userForm = this.fb.group({
      username: [{value: '', disabled: true}],
      realName: ['', Validators.required],
      email: ['', [Validators.email]],
      phone: ['']
    });
  }

  ngOnInit() {
    this.userForm.patchValue(this.user);
  }

  submitForm() {
    if (this.userForm.valid) {
      // 调用更新用户信息的API
      const updatedUser = {...this.user, ...this.userForm.value};
      this.userService.updateUser(updatedUser.id, updatedUser).subscribe(
        response => {
          this.message.success('个人信息更新成功');
          this.modalRef.close(response);
        },
        error => {
          this.message.error('更新失败：' + error.message);
        }
      );
    }
  }

  cancel() {
    this.modalRef.close();
  }
}
