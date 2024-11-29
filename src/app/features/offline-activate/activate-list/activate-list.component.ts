import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ActivationQuery, OfflineActivation, OfflineActivationResponse } from 'src/app/core/models/offline-activate';
import { ActivationFormComponent } from '../activation-form/activation-form.component';
import { OfflineActivateService } from 'src/app/core/services/offline-activate.service';
import { catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-activate-list',
  templateUrl: './activate-list.component.html',
  styleUrls: ['./activate-list.component.scss']
})
export class ActivateListComponent implements OnInit {

  activations: OfflineActivationResponse[] = [];
  total = 0;
  loading = false;
  
  query: ActivationQuery = {
    pageIndex: 1,
    pageSize: 10
  };

  constructor(
    private activationService: OfflineActivateService,
    private modal: NzModalService,
    private message: NzMessageService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }
  getDisplayCode(code: string| null): string {
    if (code!.length <= 20) return "";
    return code!.substring(0, 8) + '...' + code!.substring(code!.length - 8);
  }

  copySingleCode(code: string) {
    this.copyToClipboard(code);
  }

  private async copyToClipboard(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      this.message.success('复制成功');
    } catch (err) {
      this.message.error('复制失败');
      console.error('Copy failed', err);
    }
  }

  loadData(): void {
    this.loading = true;
    this.activationService.getActivations(this.query).subscribe({
      next: (res:any) => {
        this.activations = res.data;
        this.total = res.total;
      },
      error: (err:any) => this.message.error('加载数据失败'),
      complete: () => this.loading = false
    });
  }

  search(): void {
    this.query.pageIndex = 1;
    this.loadData();
  }

  resetSearch(): void {
    this.query = {
      pageIndex: 1,
      pageSize: 10
    };
    this.loadData();
  }

  createActivation(): void {
    const modal = this.modal.create({
      nzTitle: '新增机器激活',
      nzContent: ActivationFormComponent,
      nzWidth: 800,
      nzFooter: null
      }
    );
    modal.afterClose.subscribe(result => {
      if (result) {
        this.loadData();
      }
    });
  }

  viewActivation(data: OfflineActivation): void {
    const modal = this.modal.create({
      nzTitle: '查看机器激活',
      nzContent: ActivationFormComponent,
      nzWidth: 800,
      nzComponentParams: {
        data: data,
        mode: 'view'  // 传入查看模式
      },
      nzFooter: null
    });
    modal.afterClose.subscribe(result => {
      if (result) {
        this.loadData();
      }
    });
  }

  deleteActivation(id: string): void {
    this.activationService.deleteActivation(id).subscribe({
      next: () => {
        this.message.success('删除成功');
        this.loadData();
      },
      error: () => this.message.error('删除失败')
    });
  }

}
