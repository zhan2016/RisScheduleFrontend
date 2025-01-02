import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ControlAllServicesResult, ControlledServiceInfo, ServiceOverallStatus, ServiceState } from 'src/app/core/models/service-manager';
import { ServiceManagerService } from 'src/app/core/services/service-manager.service';
type TimelineColor = 'red' | 'green' | 'blue' | 'gray';
@Component({
  selector: 'app-service-manager',
  templateUrl: './service-manager.component.html',
  styleUrls: ['./service-manager.component.scss']
})
export class ServiceManagerComponent implements OnInit {
  overallStatus!: ServiceOverallStatus;
  services: ControlledServiceInfo[] = [];
  isLogModalVisible = false;
  selectedService: ControlledServiceInfo | null = null;
  private destroy$ = new Subject<void>();

  constructor(
    private serviceManager: ServiceManagerService,
    private message: NzMessageService,
    private modal: NzModalService
  ) {}

  ngOnInit() {
    this.loadServices();
    this.refreshStatus();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadServices() {
    this.serviceManager.getServices()
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        services => this.services = services,
        error => this.message.error('加载服务列表失败')
      );
  }

  onServiceControl(service: ControlledServiceInfo) {
    service.loading = true;
    this.serviceManager.controlService(service.serviceName, service.isManuallyEnabled)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        success => {
          this.message.success(`${service.isManuallyEnabled ? '启动' : '停止'}服务成功`);
          this.loadServices();
        },
        error => {
          service.isManuallyEnabled = !service.isManuallyEnabled;
          this.message.error(`${service.isManuallyEnabled ? '启动' : '停止'}服务失败`);
        }
      )
      .add(() => service.loading = false);
  }

  showLogs(service: ControlledServiceInfo) {
    this.selectedService = service;
    this.isLogModalVisible = true;
  }

  handleLogModalCancel() {
    this.isLogModalVisible = false;
    this.selectedService = null;
  }

  getStateColor(state: number): string {
    switch (state) {
      case ServiceState.Running:
        return 'success';
      case ServiceState.Stopped:
        return 'default';
      case ServiceState.Failed:
        return 'error';
      case ServiceState.Starting:
        return 'processing';
      case ServiceState.Stopping:
        return 'warning';
      default:
        return 'default';
    }
  }
  
  // 添加获取状态文本的方法
  getStateText(state: number): string {
    switch (state) {
      case ServiceState.Running:
        return '运行中';
      case ServiceState.Stopped:
        return '已停止';
      case ServiceState.Failed:
        return '失败';
      case ServiceState.Starting:
        return '启动中';
      case ServiceState.Stopping:
        return '停止中';
      default:
        return '未知';
    }
  }

  // 修改返回类型为 TimelineColor
  getLogColor(result: string): TimelineColor {
    return result.toLowerCase().includes('success') ? 'green' : 'red';
  }
  refreshStatus() {
    // 使用 forkJoin 同时请求两个接口
    this.serviceManager.getOverallStatus()
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: status => {
          this.overallStatus = status;
          // 在获取总体状态后刷新服务列表
          this.loadServices();
        },
        error: error => {
          this.message.error('获取服务状态失败');
        }
      });
  }

  async controlAllServices(enable: boolean) {
    const confirmTitle = enable ? '启动全部服务' : '停止全部服务';
    const confirmContent = enable ? 
      '确定要启动所有服务吗？' : 
      '确定要停止所有服务吗？这可能会影响系统运行。';

    try {
      await this.modal.confirm({
        nzTitle: confirmTitle,
        nzContent: confirmContent,
        nzOkText: '确定',
        nzCancelText: '取消',
        nzOkType: enable ? 'primary' : 'default',
        nzOnOk: () => {
          // 在确认按钮的回调中执行操作
          this.executeControlAllServices(enable);
        }
      }).afterClose.toPromise();
    } catch (error) {
      console.error('Modal error:', error);
    }
  }

  private executeControlAllServices(enable: boolean) {
    this.serviceManager.controlAllServices(enable)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        result => {
          if (result.overallSuccess) {
            this.message.success(`${enable ? '启动' : '停止'}所有服务成功`);
          } else {
            this.message.warning(`部分服务${enable ? '启动' : '停止'}失败，请查看详情`);
            this.showControlAllResult(result);
          }
          this.refreshStatus();
        },
        error => this.message.error(`${enable ? '启动' : '停止'}服务失败`)
      );
  }

  showControlAllResult(result: ControlAllServicesResult) {
    this.modal.info({
      nzTitle: '操作结果',
      nzContent: `
        <div class="result-details">
          ${result.details.map(detail => `
            <div class="result-item">
              <span>${detail.displayName}</span>
              <span>${detail.success ? '成功' : '失败'}</span>
              ${detail.errorMessage ? `<p class="error-message">${detail.errorMessage}</p>` : ''}
            </div>
          `).join('')}
        </div>
      `,
      nzWidth: 600
    });
  }
}
