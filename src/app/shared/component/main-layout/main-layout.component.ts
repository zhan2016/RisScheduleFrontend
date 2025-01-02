import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { AuthService, User } from 'src/app/core/services/auth.service';
import { UserInfoModalComponent } from '../user-info-modal/user-info-modal.component';
import { ChangePasswordModalComponent } from '../change-password-modal/change-password-modal.component';
import { NavigationEnd, Router } from '@angular/router';
import { ServiceManagerService } from 'src/app/core/services/service-manager.service';
import { LicenseService } from 'src/app/core/services/license.service';
import { LicenseStatus } from 'src/app/core/models/license-info';
import { ServiceOverallStatus } from 'src/app/core/models/service-manager';
import { formatDate } from '@angular/common';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss']
})
export class MainLayoutComponent implements OnInit {
  isCollapsed = false;
  currentUser: User | null = null;
  licenseStatus: LicenseStatus | null = null;
  overallStatus!: ServiceOverallStatus;
  private refreshInterval: any;
  private readonly REFRESH_INTERVAL = 10000; // 10秒刷新一次
  constructor(
    private authService: AuthService,
    private modalService: NzModalService,
    private message: NzMessageService,
    private router: Router,
    private serviceManager: ServiceManagerService,
    private licenseService: LicenseService
  ) {}

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    if (this.router.url === '/') {
      this.router.navigate(['/assigmentManage']);
    }
    this.licenseService.getLicenseStatus().subscribe({
      next: (status) => {
        this.licenseStatus = status;
      },
      error: (error) => {
        this.message.error('加载授权信息失败');
        console.error('Error loading license status:', error);
      }
    });
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.loadStatuses();
    });

    // 定期刷新状态
    this.refreshInterval = setInterval(() => {
      this.loadStatuses();
    }, this.REFRESH_INTERVAL);

  }
  private loadStatuses() {
    this.loadServiceStatus();
  }
  private loadServiceStatus() {
    this.serviceManager.getOverallStatus().subscribe(
      status => {
        this.overallStatus = status;
      }
    );
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
  getExpiryInfo(): string {
    if (!this.licenseStatus?.licenseInfo?.validTo) {
      return '未知';
    }

    const validTo = new Date(this.licenseStatus.licenseInfo.validTo);
    const now = new Date();
    const daysToExpiry = Math.ceil((validTo.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    if (daysToExpiry <= 0) {
      return '已过期';
    } else if (daysToExpiry <= 30) {
      return `剩余 ${daysToExpiry} 天`;
    } else {
      return formatDate(validTo, 'yyyy-MM-dd', 'zh-CN');
    }
  }

  getExpiryTooltip(): string {
    if (!this.licenseStatus?.licenseInfo?.validTo) {
      return '授权期限未知';
    }

    const validFrom = new Date(this.licenseStatus.licenseInfo.validFrom);
    const validTo = new Date(this.licenseStatus.licenseInfo.validTo);

    return `授权期限：${formatDate(validFrom, 'yyyy-MM-dd', 'zh-CN')} 至 ${formatDate(validTo, 'yyyy-MM-dd', 'zh-CN')}`;
  }

  // 可以添加一个计算过期状态的方法来动态添加CSS类
  getExpiryClass(): string {
    if (!this.licenseStatus?.licenseInfo?.validTo) {
      return '';
    }

    const validTo = new Date(this.licenseStatus.licenseInfo.validTo);
    const now = new Date();
    const daysToExpiry = Math.ceil((validTo.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    if (daysToExpiry <= 0) {
      return 'expired';
    } else if (daysToExpiry <= 30) {
      return 'near-expiry';
    }
    return '';
  }
  getServiceStatusIcon(): string {
    if (!this.overallStatus) return 'loading';
    if (this.overallStatus.allServicesRunning) return 'check-circle';
    if (this.overallStatus.allServicesStopped) return 'stop';
    return 'exclamation-circle';
  }

  getServiceStatusText(): string {
    if (!this.overallStatus) return '加载中';
    if (this.overallStatus.allServicesRunning) return '自动分发服务正常';
    if (this.overallStatus.allServicesStopped) return '自动分发服务停止';
    return '服务运行中';
  }

  getServiceCountInfo(): string {
    if (!this.overallStatus) return '加载服务状态...';
    return `运行中: ${this.overallStatus.runningCount}/${this.overallStatus.totalCount}`;
  }

}
