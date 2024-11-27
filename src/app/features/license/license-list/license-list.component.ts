import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { License, LicenseQueryResponse } from 'src/app/core/models/license-models';
import { LicenseService } from 'src/app/core/services/license.service';
import { PatchPageComponent } from '../patch-page/patch-page.component';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-license-list',
  templateUrl: './license-list.component.html',
  styleUrls: ['./license-list.component.scss']
})
export class LicenseListComponent implements OnInit {

  searchForm: FormGroup;
  total = 0;
  pageSize = 10;
  pageIndex = 1;
  loading = false;
  licenses: LicenseQueryResponse[] = [];
  
  statusOptions = [
    { label: '有效', value: 'active' },
    { label: '已过期', value: 'expired' },
    { label: '已禁用', value: 'disabled' }
  ];

  constructor(
    private fb: FormBuilder,
    private modal: NzModalService,
    private message: NzMessageService,
    private licenseService: LicenseService // 需要创建这个服务
  ) {
    this.searchForm = this.fb.group({
      hospitalName: [''],
      softwareName: [''],
      status: [''],
      dateRange: [null]
    });
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(params?: NzTableQueryParams): void {
    this.loading = true;
    const filters = this.getFilters();

    this.licenseService.getMainLicenses({
      pageIndex: this.pageIndex,
      pageSize: this.pageSize,
      ...filters
    }).subscribe({
      next: (response: any) => {
        this.licenses = response.data;
        this.total = response.total;
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Failed to load licenses', error);
        this.loading = false;
      }
    });
  }

  private getFilters(): any {
    const values = this.searchForm.value;
    const filters: any = {};

    if (values.hospitalName) {
      filters.hospitalName = values.hospitalName;
    }
    if (values.softwareName) {
      filters.softwareName = values.softwareName;
    }
    if (values.status) {
      filters.status = values.status;
    }
    if (values.dateRange) {
      filters.startDate = values.dateRange[0];
      filters.endDate = values.dateRange[1];
    }

    return filters;
  }

  onSearch(): void {
    this.pageIndex = 1;
    this.loadData();
  }

  onReset(): void {
    this.searchForm.reset();
    this.pageIndex = 1;
    this.loadData();
  }
    // 添加状态颜色方法
    getStatusColor(status: string): string {
      switch (status.toLowerCase()) {
        case 'active':
          return 'success';
        case 'expired':
          return 'error';
        case 'disabled':
          return 'default';
        default:
          return 'default';
      }
    }
  
    // 添加状态文本方法
    getStatusText(status: string): string {
      switch (status.toLowerCase()) {
        case 'active':
          return '有效';
        case 'expired':
          return '已过期';
        case 'disabled':
          return '已禁用';
        default:
          return status;
      }
    }
    showModal(data: LicenseQueryResponse) {
      this.modal.create({
        nzTitle: '补丁授权',
        nzContent: PatchPageComponent,
        nzWidth: 800,
        nzFooter: null,
        nzComponentParams: {
          existingLicense: data
        }
      });
    }
    hasPatchLicenses(license: LicenseQueryResponse): boolean {
      return Array.isArray(license.patchLicenses) && license.patchLicenses.length > 0;
    }
    expandedRowKeys: string[] = [];
    onExpandChange(id: string, expanded: boolean): void {
      if (expanded) {
        this.expandedRowKeys = [...this.expandedRowKeys, id];
      } else {
        this.expandedRowKeys = this.expandedRowKeys.filter(key => key !== id);
      }
    }
  
    isExpanded(id: string): boolean {
      return this.expandedRowKeys.includes(id);
    }
    // 下载主授权文件
  async downloadMainLicense(license: any): Promise<void> {
    try {
      // 显示加载状态
      this.message.loading('正在下载授权文件...');
      
      // 获取文件内容
      const response = await fetch(license.downloadUrl);
      const xmlContent = await response.text();
      
      // 创建 Blob 对象
      const blob = new Blob([xmlContent], { type: 'application/xml' });
      
      // 创建下载链接
      const downloadLink = document.createElement('a');
      downloadLink.href = URL.createObjectURL(blob);
      
      // 设置文件名
      const fileName = `${license.hospitalName}_${license.software.name}_主授权.xml`;
      downloadLink.download = fileName;
      
      // 触发下载
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      
      // 清理 URL 对象
      URL.revokeObjectURL(downloadLink.href);
      
      // 显示成功消息
      this.message.success('下载完成');
    } catch (error) {
      // 显示错误消息
      this.message.error('下载失败，请稍后重试');
      console.error('下载失败:', error);
    }
  }

  // 下载补丁授权文件
  async downloadPatchLicense(patch: any): Promise<void> {
    try {
      this.message.loading('正在下载补丁授权文件...');
      
      const response = await fetch(patch.downloadUrl);
      const xmlContent = await response.text();
      
      const blob = new Blob([xmlContent], { type: 'application/xml' });
      
      const downloadLink = document.createElement('a');
      downloadLink.href = URL.createObjectURL(blob);
      
      // 使用创建时间作为文件名的一部分
      const timestamp = new Date(patch.createdAt).toISOString().slice(0, 19).replace(/[:T]/g, '-');
      const fileName = `补丁授权_${timestamp}.xml`;
      downloadLink.download = fileName;
      
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      
      URL.revokeObjectURL(downloadLink.href);
      
      this.message.success('下载完成');
    } catch (error) {
      this.message.error('下载失败，请稍后重试');
      console.error('下载失败:', error);
    }
  }
}
