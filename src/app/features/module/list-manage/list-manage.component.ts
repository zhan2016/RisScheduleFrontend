import { Component, Input, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { AuthorizationType, Module, ModuleStatus } from 'src/app/core/models/license-module';
import { ModuleService } from 'src/app/core/services/module.service';
import { ModuleFormComponent } from '../module-form/module-form.component';
import { finalize } from 'rxjs/operators';
import { NzTableQueryParams } from 'ng-zorro-antd/table';

@Component({
  selector: 'app-list-manage',
  templateUrl: './list-manage.component.html',
  styleUrls: ['./list-manage.component.scss']
})
export class ListManageComponent implements OnInit {

  @Input() systemId?: string;
  
  ModuleStatus = ModuleStatus;
  AuthorizationType = AuthorizationType;
  
  modules: Module[] = [];
  loading = false;
  searchValue = '';
  selectedType = '';
  expandSet = new Set<string>();
  
  pageIndex = 1;
  pageSize = 10;
  total = 0;

  queryParams = {
    status: null as ModuleStatus | null,
    authType: null as AuthorizationType | null
  };

  constructor(
    private moduleService: ModuleService,
    private modal: NzModalService,
    private message: NzMessageService
  ) {}

  ngOnInit() {
    this.loadModules();
  }

  getAuthTypeLabel(type: AuthorizationType): string {
    const labels = {
      [AuthorizationType.CONCURRENT]: '并发授权',
      [AuthorizationType.TERMINAL]: '终端授权',
      [AuthorizationType.BOTH]: '两种均可'
    };
    return labels[type];
  }

  getAuthTypeColor(type: AuthorizationType): string {
    const colors = {
      [AuthorizationType.CONCURRENT]: 'blue',
      [AuthorizationType.TERMINAL]: 'green',
      [AuthorizationType.BOTH]: 'purple'
    };
    return colors[type];
  }

  loadModules() {
    this.loading = true;
    this.moduleService.getModules({
      systemId: this.systemId,
      name: this.searchValue,
      status: this.queryParams.status,
      authType: this.queryParams.authType,
      page: this.pageIndex,
      pageSize: this.pageSize
    }).subscribe(
      (response: { data: Module[]; total: number; }) => {
        this.modules = response.data;
        this.total = response.total;
        this.loading = false;
      }
    );
  }
  onSearch() {
    this.pageIndex = 1;
    this.loadModules();
  }

  onQueryParamsChange(params: NzTableQueryParams) {
    this.pageIndex = params.pageIndex;
    this.pageSize = params.pageSize;
    this.loadModules();
  }

  onExpandChange(id: string, checked: boolean) {
    if (checked) {
      this.expandSet.add(id);
    } else {
      this.expandSet.delete(id);
    }
  }

  addModule() {
    this.openModuleForm();
  }

  addSubModule(parentModule: Module) {
    this.openModuleForm(undefined, parentModule);
  }

  editModule(module: Module) {
    this.openModuleForm(module);
  }

  private openModuleForm(module?: Module, parentModule?: Module) {
    const modal = this.modal.create({
      nzTitle: module ? '编辑模块' : '添加模块',
      nzContent: ModuleFormComponent,
      nzComponentParams: {
        module,
        parentModule,
        systemId: this.systemId
      },
      nzWidth: 700,
      nzFooter: null
    });

    modal.afterClose.subscribe(result => {
      if (result) {
        this.loadModules();
      }
    });
  }

  deleteModule(id: string) {
    this.loading = true;
    this.moduleService.deleteModule(id).pipe(
      finalize(() => this.loading = false)
    ).subscribe(
      () => {
        this.message.success('删除成功');
        this.loadModules();
      }
    );
  }

}
