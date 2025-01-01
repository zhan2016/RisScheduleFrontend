import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { LicenseStatus } from 'src/app/core/models/license-info';
import { LicenseService } from 'src/app/core/services/license.service';

@Component({
  selector: 'app-license-info',
  templateUrl: './license-info.component.html',
  styleUrls: ['./license-info.component.scss']
})
export class LicenseInfoComponent implements OnInit {

  licenseStatus: LicenseStatus | null = null;

  constructor(
    private licenseService: LicenseService,
    private message: NzMessageService
  ) {}

  ngOnInit(): void {
    this.loadLicenseStatus();
  }

  loadLicenseStatus(): void {
    this.licenseService.getLicenseStatus().subscribe({
      next: (status) => {
        this.licenseStatus = status;
      },
      error: (error) => {
        this.message.error('加载授权信息失败');
        console.error('Error loading license status:', error);
      }
    });
  }

  copyHardwareId(): void {
    if (this.licenseStatus?.hardwareId) {
      navigator.clipboard.writeText(this.licenseStatus.hardwareId)
        .then(() => {
          this.message.success('机器码已复制到剪贴板');
        })
        .catch(() => {
          this.message.error('复制失败');
        });
    }
  }

}
