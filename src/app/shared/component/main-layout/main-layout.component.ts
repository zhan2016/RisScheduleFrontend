import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { AuthService, User } from 'src/app/core/services/auth.service';
import { UserInfoModalComponent } from '../user-info-modal/user-info-modal.component';
import { ChangePasswordModalComponent } from '../change-password-modal/change-password-modal.component';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss']
})
export class MainLayoutComponent implements OnInit {
  isCollapsed = false;
  currentUser: User | null = null;

  constructor(
    private authService: AuthService,
    private modalService: NzModalService,
    private message: NzMessageService
  ) {}

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
  }

  showUserInfoModal() {
    this.modalService.create({
      nzTitle: '个人信息',
      nzContent: UserInfoModalComponent,
      nzComponentParams: {
        user: this.currentUser as unknown as any
      },
      nzFooter: null,
      nzWidth: 600
    });
  }

  showChangePasswordModal() {
    this.modalService.create({
      nzTitle: '修改密码',
      nzContent: ChangePasswordModalComponent,
      nzFooter: null,
      nzWidth: 400
    });
  }

  logout() {
    this.modalService.confirm({
      nzTitle: '确认退出',
      nzContent: '确定要退出登录吗？',
      nzOnOk: () => {
        this.authService.logout();
        this.message.success('已成功退出登录');
      }
    });
  }

}
