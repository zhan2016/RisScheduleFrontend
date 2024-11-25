import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Observable } from 'rxjs';
import { PaginatedResponse } from 'src/app/core/models/common-models';
import { EncryptionKey, KeyStatus } from 'src/app/core/models/encryption-key';
import { EncryptionKeyService } from 'src/app/core/services/encryption-key.service';
import { EncryptionKeyFormComponent } from '../encryption-key-form/encryption-key-form.component';

@Component({
  selector: 'app-encryption-key-list',
  templateUrl: './encryption-key-list.component.html',
  styleUrls: ['./encryption-key-list.component.scss']
})
export class EncryptionKeyListComponent implements OnInit {

  keysData$!: Observable<PaginatedResponse<EncryptionKey>>;
  KeyStatus = KeyStatus;

  queryParams = {
    page: 1,
    pageSize: 10,
    name: '',
    status: undefined as KeyStatus | undefined
  };

  constructor(
    private keyService: EncryptionKeyService,
    private message: NzMessageService,
    private modal: NzModalService
  ) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.keysData$ = this.keyService.getKeys(this.queryParams);
  }

  onPageChange(page: number) {
    this.queryParams.page = page;
    this.loadData();
  }

  onSearch() {
    this.queryParams.page = 1;
    this.loadData();
  }

  onReset() {
    this.queryParams = {
      page: 1,
      pageSize: 10,
      name: '',
      status: undefined
    };
    this.loadData();
  }

  setDefault(id: string) {
    this.modal.confirm({
      nzTitle: '设置默认密钥',
      nzContent: '确定要将此密钥设置为默认密钥吗？',
      nzOnOk: () => {
        this.keyService.setDefault(id).subscribe({
          next: () => {
            this.message.success('设置成功');
            this.loadData();
          },
          error: (error) => {
            this.message.error('设置失败: ' + error.message);
          }
        });
      }
    });
  }

  updateStatus(id: string, status: KeyStatus) {
    this.modal.confirm({
      nzTitle: status === KeyStatus.ACTIVE ? '启用密钥' : '禁用密钥',
      nzContent: `确定要${status === KeyStatus.ACTIVE ? '启用' : '禁用'}此密钥吗？`,
      nzOnOk: () => {
        this.keyService.updateStatus(id, status).subscribe({
          next: () => {
            this.message.success('操作成功');
            this.loadData();
          },
          error: (error) => {
            this.message.error('操作失败: ' + error.message);
          }
        });
      }
    });
  }

  deleteKey(id: string) {
    this.modal.confirm({
      nzTitle: '删除密钥',
      nzContent: '确定要删除此密钥吗？',
      nzOkDanger:true,
      nzOnOk: () => {
        this.keyService.deleteKey(id).subscribe({
          next: () => {
            this.message.success('删除成功');
            this.loadData();
          },
          error: (error) => {
            this.message.error('删除失败: ' + error.message);
          }
        });
      }
    });
  }

  showCreateModal() {
    const modal = this.modal.create({
      nzTitle: '创建密钥',
      nzContent: EncryptionKeyFormComponent,
      nzWidth: 600,
      nzFooter: null
    });

    modal.afterClose.subscribe(result => {
      if (result) {
        this.keyService.createKey(result).subscribe({
          next: () => {
            this.message.success('创建成功');
            this.loadData();
          },
          error: (error) => {
            this.message.error('创建失败: ' + error.message);
          }
        });
      }
    });
  }

  showEditModal(key: EncryptionKey) {
    const modal = this.modal.create({
      nzTitle: '编辑密钥',
      nzContent: EncryptionKeyFormComponent,
      nzWidth: 600,
      nzFooter: null,
      nzComponentParams: {
        key: { ...key }
      }
    });

    modal.afterClose.subscribe(result => {
      if (result) {
        this.keyService.updateKey(key.id, result).subscribe({
          next: () => {
            this.message.success('更新成功');
            this.loadData();
          },
          error: (error) => {
            this.message.error('更新失败: ' + error.message);
          }
        });
      }
    });
  }

  showKeyDetail(key: EncryptionKey) {
    this.modal.info({
      nzTitle: '密钥详情',
      nzContent: `
        <div>
          <p><strong>密钥名称：</strong>${key.name}</p>
          <p><strong>密钥值：</strong>${key.key}</p>
          <p><strong>创建时间：</strong>${new Date(key.createdAt).toLocaleString()}</p>
          <p><strong>描述：</strong>${key.description || '无'}</p>
        </div>
      `,
      nzWidth: 500
    });
  }
}
