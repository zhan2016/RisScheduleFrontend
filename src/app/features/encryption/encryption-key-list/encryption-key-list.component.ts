import { Component, OnInit, ViewChild } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Observable } from 'rxjs';
import { KeyStatus, PaginatedResponse } from 'src/app/core/models/common-models';
import { EncryptionKey } from 'src/app/core/models/encryption-key';
import { EncryptionKeyService } from 'src/app/core/services/encryption-key.service';
import { EncryptionKeyFormComponent } from '../encryption-key-form/encryption-key-form.component';
import { FormBuilder } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { EncryptionKeyDetailModalComponent } from '../encryption-key-detail-modal/encryption-key-detail-modal.component';


@Component({
  selector: 'app-encryption-key-list',
  templateUrl: './encryption-key-list.component.html',
  styleUrls: ['./encryption-key-list.component.scss']
})
export class EncryptionKeyListComponent implements OnInit {

  @ViewChild('formComponent') formComponent!: EncryptionKeyFormComponent;

  listOfData: EncryptionKey[] = [];
  loading = false;
  total = 0;
  pageSize = 10;
  pageIndex = 1;
  
  isModalVisible = false;
  isOkLoading = false;
  isFormValid = false;
  currentKey?: EncryptionKey;
  
  searchForm = this.fb.group({
    name: [''],
    status: [null]
  });

  constructor(
    private service: EncryptionKeyService,
    private message: NzMessageService,
    private modal: NzModalService,
    private datePipe: DatePipe,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.loadData();
  }
  loadData(): void {
    this.loading = true;
    const params = {
      page: this.pageIndex,
      size: this.pageSize,
      ...this.searchForm.value
    };

    this.service.getKeys(params).subscribe(
      data => {
        this.listOfData = data.data;
        this.total = data.total;
        this.loading = false;
      },
      error => {
        this.message.error('加载数据失败');
        this.loading = false;
      }
    );
  }

  showDetail(data: EncryptionKey): void {
    this.modal.create({
      nzTitle: '密钥详情',
      nzContent: EncryptionKeyDetailModalComponent,
      nzComponentParams: {
        data
      },
      nzWidth: 600,
      nzFooter: null
    });
  }

  onPageChange(page: number) {
    this.pageIndex = page;
    this.loadData();
  }

  onSearch() {
    this.pageIndex = 1;
    this.loadData();
  }

  onReset() {
    this.pageIndex = 1;
    this.pageSize = 20;
    this.searchForm = this.fb.group({
      name: [''],
      status: [null]
    });
    this.loadData();
  }

  setDefault(id: string) {
    this.modal.confirm({
      nzTitle: '设置默认密钥',
      nzContent: '确定要将此密钥设置为默认密钥吗？',
      nzOnOk: () => {
        this.service.setDefault(id).subscribe({
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
        this.service.updateStatus(id, status).subscribe({
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


  showCreateModal() {
    const modal = this.modal.create({
      nzTitle: '创建密钥',
      nzContent: EncryptionKeyFormComponent,
      nzWidth: 600,
      nzFooter: null
    });

    modal.afterClose.subscribe(result => {
      if (result) {
        this.service.createKey(result).subscribe({
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
  showModal(data?: EncryptionKey): void {
    this.currentKey = data;
    this.isModalVisible = true;
  }
  handleOk(): void {
    if (this.isFormValid) {
      this.isOkLoading = true;
      const formValue = this.formComponent.getFormValue();

      const request = this.currentKey
        ? this.service.updateKey(this.currentKey.id, formValue)
        : this.service.createKey(formValue);

      request.subscribe(
        () => {
          this.message.success(`${this.currentKey ? '更新' : '创建'}成功`);
          this.isModalVisible = false;
          this.isOkLoading = false;
          this.loadData();
        },
        error => {
          this.message.error(`${this.currentKey ? '更新' : '创建'}失败`);
          this.isOkLoading = false;
        }
      );
    }
  }

  handleCancel(): void {
    this.isModalVisible = false;
  }

  onFormValidChange(valid: boolean): void {
    this.isFormValid = valid;
  }

  onFormValueChange(value: any): void {
    // 可以在这里处理表单值变化
  }

  deleteKey(id: string): void {
    this.service.deleteKey(id).subscribe(
      () => {
        this.message.success('删除成功');
        this.loadData();
      },
      error => {
        this.message.error('删除失败');
      }
    );
  }

  search(): void {
    this.pageIndex = 1;
    this.loadData();
  }

  reset(): void {
    this.searchForm.reset();
    this.search();
  }

  pageIndexChange(index: number): void {
    this.pageIndex = index;
    this.loadData();
  }

  getStatusColor(status: KeyStatus): string {
    const colors: Record<KeyStatus, string> = {
      [KeyStatus.ACTIVE]: 'success',
      [KeyStatus.INACTIVE]: 'warning',
      [KeyStatus.EXPIRED]: 'error',
      [KeyStatus.REVOKED]: ''
    };
    return colors[status] || '';
  }

  getStatusText(status: KeyStatus): string {
    const texts: Record<KeyStatus, string> = {
      [KeyStatus.ACTIVE]: '激活',
      [KeyStatus.INACTIVE]: '未激活',
      [KeyStatus.EXPIRED]: '已过期',
      [KeyStatus.REVOKED]: ''
    };
    return texts[status] || status;
  }
}
