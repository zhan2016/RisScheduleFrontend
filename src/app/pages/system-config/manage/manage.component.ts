import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { SystemConfigService } from 'src/app/core/services/system-config.service';
import {ServiceManagerComponent} from '../service-manager/service-manager.component';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit {

  cacheTypes: any[] = [];
  cacheForm!: FormGroup;
  settingsForm!: FormGroup;
  isRefreshing = false;
  isSaving = false;

  constructor(
    private systemConfigService: SystemConfigService,
    private fb: FormBuilder,
    private message: NzMessageService
  ) {
    this.createForms();
  }

  ngOnInit() {
    this.loadCacheTypes();
    this.loadSettings();
  }

  private createForms() {
    this.cacheForm = this.fb.group({
      cacheTypes: [[]],
      reason: ['', Validators.required]
    });

    this.settingsForm = this.fb.group({
      redisSyncInterval: [null, [Validators.required, Validators.min(1)]],
      intervalSeconds: [null, [Validators.required, Validators.min(1)]],
      batchSize: [null, [Validators.required, Validators.min(1)]],
      maxRetries: [null, [Validators.required, Validators.min(0)]]
    });
  }

  private loadCacheTypes() {
    this.systemConfigService.getCacheTypes().subscribe(
      types => this.cacheTypes = types,
      error => this.message.error('加载缓存类型失败')
    );
  }

  private loadSettings() {
    this.systemConfigService.getSettings().subscribe(
      settings => {
        this.settingsForm.patchValue({
          redisSyncInterval: settings.redisSyncInterval,
          intervalSeconds: settings.assignment.producer.intervalSeconds,
          batchSize: settings.assignment.producer.batchSize,
          maxRetries: settings.assignment.producer.maxRetries
        });
      },
      error => this.message.error('加载设置失败')
    );
  }

  refreshCache() {
    if (this.cacheForm.valid) {
      const { cacheTypes, reason } = this.cacheForm.value;
      this.systemConfigService.refreshCache(cacheTypes, reason).subscribe(
        () => {
          this.message.success('缓存刷新成功');
          this.cacheForm.get('reason')!.reset();
        },
        error => this.message.error('缓存刷新失败')
      );
    }
  }

  updateSettings() {
    if (this.settingsForm.valid) {
      const values = this.settingsForm.value;
      const settings = {
        redisSyncInterval: values.redisSyncInterval,
        assignment: {
          producer: {
            intervalSeconds: values.intervalSeconds,
            batchSize: values.batchSize,
            maxRetries: values.maxRetries
          }
        }
      };

      this.systemConfigService.updateSettings(settings).subscribe(
        () => this.message.success('设置更新成功'),
        error => this.message.error('设置更新失败')
      );
    }
  }
}
