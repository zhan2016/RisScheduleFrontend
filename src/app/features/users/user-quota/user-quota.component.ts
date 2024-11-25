import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { UserQuota } from 'src/app/core/models/user-manage';
import { UserQuotaService } from 'src/app/core/services/user-quota.service';

@Component({
  selector: 'app-user-quota',
  templateUrl: './user-quota.component.html',
  styleUrls: ['./user-quota.component.scss']
})
export class UserQuotaComponent implements OnInit {

  @Input() userId!: number;
  quotas: UserQuota[] = [];
  loading = false;
  form!: FormGroup;
  systems: any[] = [];  // 需要从服务获取系统列表
  modules: any[] = [];  // 需要从服务获取模块列表

  constructor(
    private fb: FormBuilder,
    private modalRef: NzModalRef,       
    private modalService: NzModalService, 
    private message: NzMessageService,
    private quotaService: UserQuotaService
  ) {}

  ngOnInit() {
    this.initForm();
    this.loadQuotas();
    this.loadSystems();
  }

  initForm() {
    this.form = this.fb.group({
      systemId: [null, [Validators.required]],
      moduleId: [null, [Validators.required]],
      terminalLimit: [0, [Validators.required, Validators.min(0)]],
      concurrentLimit: [0, [Validators.required, Validators.min(0)]],
      hospitalLimit: [0, [Validators.required, Validators.min(0)]],
      validTo: [null, [Validators.required]]
    });
  }

  loadQuotas() {
    this.loading = true;
    this.quotaService.getUserQuotas(this.userId).subscribe({
      next: (quotas) => {
        this.quotas = quotas;
        this.loading = false;
      },
      error: (error) => {
        this.message.error('加载配额失败: ' + error.message);
        this.loading = false;
      }
    });
  }

  loadSystems() {
    // 加载系统列表
  }

  onSystemChange() {
    // 根据选择的系统加载对应的模块列表
  }

  submitForm() {
    if (this.form.valid) {
      const quota = {
        ...this.form.value,
        userId: this.userId
      };
      this.quotaService.createQuota(quota).subscribe({
        next: () => {
          this.message.success('添加配额成功');
          this.loadQuotas();
          this.form.reset();
        },
        error: (error) => {
          this.message.error('添加配额失败: ' + error.message);
        }
      });
    }
  }

  deleteQuota(quotaId: string) {
    this.modalService.confirm({
      nzTitle: '删除配额',
      nzContent: '确定要删除该配额吗？',
      nzOnOk: () => {
        this.quotaService.deleteQuota(quotaId).subscribe({
          next: () => {
            this.message.success('删除配额成功');
            this.loadQuotas();
          },
          error: (error) => {
            this.message.error('删除配额失败: ' + error.message);
          }
        });
      }
    });
  }
  getSystemName(systemId: number): string {
    return this.systems.find(s => s.id === systemId)?.name || '';
  }

  getModuleName(moduleId: number): string {
    return this.modules.find(m => m.id === moduleId)?.name || '';
  }
}
