import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { User } from 'src/app/core/models/user-manage';
import { UserFormComponent } from '../user-form/user-form.component';
import { UserService } from 'src/app/core/services/user.service';
import { UserQuotaComponent } from '../user-quota/user-quota.component';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {

  users: User[] = [];
  loading = false;
  searchText = '';

  constructor(
    private userService: UserService,
    private modal: NzModalService,
    private message: NzMessageService
  ) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.loading = true;
    this.userService.getUser().subscribe({
      next: (users) => {
        this.users = users;
        this.loading = false;
      },
      error: (error) => {
        this.message.error('加载用户列表失败: ' + error.message);
        this.loading = false;
      }
    });
  }

  showCreateModal() {
    const modal = this.modal.create({
      nzTitle: '创建用户',
      nzContent: UserFormComponent,
      nzWidth: 700,
      nzFooter: null
    });

    modal.afterClose.subscribe(result => {
      if (result) {
        this.userService.createUser(result).subscribe({
          next: () => {
            this.message.success('创建用户成功');
            this.loadUsers();
          },
          error: (error) => {
            this.message.error('创建用户失败: ' + error.message);
          }
        });
      }
    });
  }

  showEditModal(user: User) {
    const modal = this.modal.create({
      nzTitle: '编辑用户',
      nzContent: UserFormComponent,
      nzWidth: 700,
      nzFooter: null,
      nzComponentParams: {
        user: { ...user }
      }
    });

    modal.afterClose.subscribe(result => {
      if (result) {
        this.userService.updateUser(user.id, result).subscribe({
          next: () => {
            this.message.success('更新用户成功');
            this.loadUsers();
          },
          error: (error) => {
            this.message.error('更新用户失败: ' + error.message);
          }
        });
      }
    });
  }

  showQuotaModal(user: User) {
    this.modal.create({
      nzTitle: '配额管理',
      nzContent: UserQuotaComponent,
      nzWidth: 800,
      nzFooter: null,
      nzComponentParams: {
        userId: user.id
      }
    });
  }

  toggleStatus(user: User) {
    const newStatus = user.status === 'active' ? 'disabled' : 'active';
    this.userService.updateStatus(user.id, newStatus).subscribe({
      next: () => {
        this.message.success(`${newStatus === 'active' ? '启用' : '禁用'}用户成功`);
        this.loadUsers();
      },
      error: (error) => {
        this.message.error(`${newStatus === 'active' ? '启用' : '禁用'}用户失败: ${error.message}`);
      }
    });
  }

  resetPassword(user: User) {
    this.modal.confirm({
      nzTitle: '重置密码',
      nzContent: '确定要重置该用户的密码吗？重置后密码将变为默认密码。',
      nzOnOk: () => {
        this.userService.resetPassword(user.id).subscribe({
          next: () => {
            this.message.success('重置密码成功');
          },
          error: (error) => {
            this.message.error('重置密码失败: ' + error.message);
          }
        });
      }
    });
  }

  deleteUser(user: User) {
    this.modal.confirm({
      nzTitle: '删除用户',
      nzContent: '确定要删除该用户吗？此操作不可恢复。',
      nzOnOk: () => {
        this.userService.deleteUser(user.id).subscribe({
          next: () => {
            this.message.success('删除用户成功');
            this.loadUsers();
          },
          error: (error) => {
            this.message.error('删除用户失败: ' + error.message);
          }
        });
      }
    });
  }

}
