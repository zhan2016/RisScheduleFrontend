import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { finalize } from 'rxjs/operators';
import { SystemService } from 'src/app/core/services/system.service';
import { SystemFormComponent } from '../system-form/system-form.component';
import { System, SystemAuthorizationType, SystemStatus } from 'src/app/core/models/license-systems';

@Component({
  selector: 'app-list-manage',
  templateUrl: './list-manage.component.html',
  styleUrls: ['./list-manage.component.scss']
})
export class ListManageComponent implements OnInit {

  SystemStatus = SystemStatus;
  systems: System[] = [];
  loading = false;
  total = 0;
  pageIndex = 1;
  pageSize = 10;
  searchValue = '';

  constructor(
    private systemService: SystemService,
    private modal: NzModalService,
    private message: NzMessageService
  ) {}

  ngOnInit() {
    this.loadSystems();
  }

  loadSystems() {
    this.loading = true;
    this.systemService.getSystems({
      name: this.searchValue,
      page: this.pageIndex,
      pageSize: this.pageSize
    }).subscribe(
      (response: { data: System[]; total: number; }) => {
        this.systems = response.data;
        this.total = response.total;
        this.loading = false;
      }
    );
  }

  onSearch() {
    this.pageIndex = 1;
    this.loadSystems();
  }

  getAuthTypeLabel(authType: SystemAuthorizationType): string {
    const labels = {
      [SystemAuthorizationType.CONCURRENT]: '按并发',
      [SystemAuthorizationType.TERMINAL]: '按终端',
      [SystemAuthorizationType.BOTH]: '均可'
    };
    return labels[authType];
  }

  openSystemForm(system?: System) {
    const modal = this.modal.create({
      nzTitle: system ? '编辑系统' : '添加系统',
      nzContent: SystemFormComponent,
      nzComponentParams: { system },
      nzWidth: 700,
      nzFooter: null
    });

    modal.afterClose.subscribe(result => {
      if (result) {
        this.loadSystems();
      }
    });
  }

  deleteSystem(system: System) {
    this.modal.confirm({
      nzTitle: '确认删除',
      nzContent: `确定要删除系统"${system.name}"吗？`,
      nzOkText: '确定',
      nzOkType: 'primary',
      nzOkDanger:true,
      nzOnOk: () => {
        this.systemService.batchDeleteSystems([system.id]).subscribe(
          () => {
            this.message.success('删除成功');
            this.loadSystems();
          },
          error => {
            console.error('删除系统失败', error);
            this.message.error('删除失败');
          }
        );
      },
      nzCancelText: '取消'
    });
  }

}
