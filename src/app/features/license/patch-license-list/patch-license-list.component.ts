import { Component, Input, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { License } from 'src/app/core/models/license-models';
import { System } from 'src/app/core/models/license-systems';
import { LicenseService } from 'src/app/core/services/license.service';

@Component({
  selector: 'app-patch-license-list',
  templateUrl: './patch-license-list.component.html',
  styleUrls: ['./patch-license-list.component.scss']
})
export class PatchLicenseListComponent implements OnInit {

  @Input() mainLicenseId!: string;
  
  patchLicenses: License[] = [];
  loading = false;
  expandSet = new Set<string>();
  systems: System[] = [];
  
  constructor(
    private licenseService: LicenseService,
    private message: NzMessageService
  ) {}

  ngOnInit() {
    this.loadPatchLicenses();
  }

  loadPatchLicenses() {
    this.loading = true;
    this.licenseService.getPatchLicenses(this.mainLicenseId).subscribe({
      next: (data: License[]) => {
        this.patchLicenses = data;
        this.loading = false;
      },
      error: (error: { message: string; }) => {
        this.message.error('加载补丁授权列表失败: ' + error.message);
        this.loading = false;
      }
    });
  }

  downloadLicense(license: License) {
    this.licenseService.downloadLicense(license.id).subscribe({
      next: (blob: Blob | MediaSource) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `patch_license_${license.hospitalName}_${new Date().getTime()}.lic`;
        link.click();
        window.URL.revokeObjectURL(url);
      },
      error: (error: { message: string; }) => {
        this.message.error('下载授权文件失败: ' + error.message);
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

}
