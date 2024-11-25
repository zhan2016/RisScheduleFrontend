import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';
import { License } from 'src/app/core/models/license-models';
import { Module } from 'src/app/core/models/license-module';
import { System } from 'src/app/core/models/license-systems';
import { AuthService } from 'src/app/core/services/auth.service';
import { LicenseService } from 'src/app/core/services/license.service';
import { SystemService } from 'src/app/core/services/system.service';
import { LicenseFormComponent } from '../license-form/license-form.component';
import { PatchLicenseListComponent } from '../patch-license-list/patch-license-list.component';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit {

  licenses: License[] = [];
  loading = false;
  expandSet = new Set<string>();

  constructor(
    private licenseService: LicenseService,
    private modal: NzModalService,
    private message: NzMessageService,
    public authService: AuthService // 注意这里改为public以便在模板中使用
  ) {}

  ngOnInit() {
    this.loadLicenses();
  }

  loadLicenses() {
    this.loading = true;
    this.licenseService.queryLicenses({}).subscribe({
      next: (data) => {
        this.licenses = data;
        this.loading = false;
      },
      error: (error) => {
        this.message.error('加载授权列表失败: ' + error.message);
        this.loading = false;
      }
    });
  }

  createLicense() {
    const modal = this.modal.create({
      nzTitle: '创建授权',
      nzContent: LicenseFormComponent,
      nzWidth: '800px',
      nzFooter: null
    });

    modal.afterClose.subscribe(result => {
      if (result) {
        this.loadLicenses();
      }
    });
  }

  createPatchLicense(mainLicense: License) {
    const modal = this.modal.create({
      nzTitle: '创建补丁授权',
      nzContent: LicenseFormComponent,
      nzWidth: '800px',
      nzComponentParams: {
        mainLicense: mainLicense,
        isPatch: true
      },
      nzFooter: null
    });

    modal.afterClose.subscribe(result => {
      if (result) {
        this.loadLicenses();
      }
    });
  }

  downloadLicense(license: License) {
    this.licenseService.downloadLicense(license.id).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `license_${license.hospitalName}_${new Date().getTime()}.lic`;
        link.click();
        window.URL.revokeObjectURL(url);
      },
      error: (error) => {
        this.message.error('下载授权文件失败: ' + error.message);
      }
    });
  }

  revokeLicense(license: License) {
    this.modal.confirm({
      nzTitle: '确认撤销授权？',
      nzContent: `确定要撤销 ${license.hospitalName} 的授权吗？撤销后该授权将立即失效。`,
      nzOkDanger: true,
      nzOnOk: () => {
        this.licenseService.revokeLicense(license.id).subscribe({
          next: () => {
            this.message.success('授权撤销成功');
            this.loadLicenses();
          },
          error: (error: any) => {
            this.message.error('撤销授权失败: ' + error.message);
          }
        });
      }
    });
  }

  deleteLicense(license: License) {
    this.modal.confirm({
      nzTitle: '确认删除授权？',
      nzContent: `确定要删除 ${license.hospitalName} 的授权吗？删除后无法恢复。`,
      nzOkDanger: true,
      nzOnOk: () => {
        this.licenseService.deleteLicense(license.id).subscribe({
          next: () => {
            this.message.success('授权删除成功');
            this.loadLicenses();
          },
          error: (error) => {
            this.message.error('删除授权失败: ' + error.message);
          }
        });
      }
    });
  }

  onExpandChange(id: string, checked: boolean) {
    if (checked) {
      this.expandSet.add(id);
    } else {
      this.expandSet.delete(id);
    }
  }

  getLicenseStatusColor(license: License): string {
    if (license.status === 'REVOKED') return 'red';
    if (license.status === 'EXPIRED') return 'orange';
    return 'green';
  }

  getLicenseStatusText(license: License): string {
    const statusMap: Record<string, string> = {
      'ACTIVE': '有效',
      'EXPIRED': '已过期',
      'REVOKED': '已撤销'
    };
    return statusMap[license.status] || license.status;
  }

  isLicenseActive(license: License): boolean {
    return license.status === 'ACTIVE';
  }
}

