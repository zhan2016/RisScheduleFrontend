import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { KeyStatus } from 'src/app/core/models/common-models';
import { EncryptionKey } from 'src/app/core/models/encryption-key';

@Component({
  selector: 'app-encryption-key-detail-modal',
  templateUrl: './encryption-key-detail-modal.component.html',
  styleUrls: ['./encryption-key-detail-modal.component.scss']
})
export class EncryptionKeyDetailModalComponent implements OnInit {

  @Input() data!: EncryptionKey;
  
  constructor(private datePipe: DatePipe) {}
  ngOnInit(): void {
  }
  
  get detailItems() {
    return [
      { label: '名称', value: this.data.name },
      { label: '是否默认', value: this.data.isDefault ? '是' : '否' },
      { label: '状态', value: this.getStatusText(this.data.status) },
      { 
        label: '有效期', 
        value: `${this.datePipe.transform(this.data.validFrom, 'yyyy-MM-dd')} 至 
                ${this.datePipe.transform(this.data.validTo, 'yyyy-MM-dd')}` 
      },
      { label: '创建人', value: this.data.createdBy?.name || '-' },
      { 
        label: '创建时间', 
        value: this.datePipe.transform(this.data.createdAt, 'yyyy-MM-dd HH:mm:ss') 
      },
      {
        label: '公钥', 
        value: this.data.publicKey
      },
      { label: '描述', value: this.data.description || '-' }
    ];
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
