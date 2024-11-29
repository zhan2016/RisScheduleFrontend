import { Component, Input, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-activate-success',
  templateUrl: './activate-success.component.html',
  styleUrls: ['./activate-success.component.scss']
})
export class ActivateSuccessComponent implements OnInit {

  @Input() activationList: any[] = [];
  
  constructor(private message: NzMessageService) {}
  ngOnInit(): void {
    //throw new Error('Method not implemented.');
  }

  copySingleRow(item: any) {
    const text = `机器码：${item.machineCode}\n激活码：${item.activationCode}`;
    this.copyToClipboard(text);
  }

  copyAllInfo() {
    const text = this.activationList.map((item, index) => 
      `===== 记录 ${index + 1} =====\n机器码：${item.machineCode}\n激活码：${item.activationCode}`
    ).join('\n\n');
    this.copyToClipboard(text);
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

}
