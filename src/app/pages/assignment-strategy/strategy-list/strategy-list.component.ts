import { Component, OnInit } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AssignmentStrategy } from 'src/app/core/models/assigment-stragegy';
import { AssignmentStrategyService } from 'src/app/core/services/assignment-strategy.service';

@Component({
  selector: 'app-strategy-list',
  templateUrl: './strategy-list.component.html'
})
export class StrategyListComponent implements OnInit {
  strategies: AssignmentStrategy[] = [];
  loading = false;
  workloadModes = [
    { label: '合并计算', value: '1' },
    { label: '分开计算', value: '2' }
  ];
  constructor(
    private strategyService: AssignmentStrategyService,
    private modal: NzModalService,
    private message: NzMessageService
  ) { }

  ngOnInit(): void {
    this.loadStrategies();
  }

  loadStrategies(): void {
    this.loading = true;
    this.strategyService.getStrategies().subscribe({
      next: (data) => {
        this.strategies = data;
        this.loading = false;
      },
      error: (error) => {
        this.message.error('加载失败: ' + error.message);
        this.loading = false;
      }
    });
  }

  deleteStrategy(id: string): void {
    this.modal.confirm({
      nzTitle: '确认删除',
      nzContent: '是否确认删除该分配策略？',
      nzOnOk: () => {
        this.strategyService.deleteStrategy(id).subscribe({
          next: () => {
            this.message.success('删除成功');
            this.loadStrategies();
          },
          error: (error) => this.message.error('删除失败: ' + error.message)
        });
      }
    });
  }
  getWorkloadModeLabel(worloadId: string) {
    return this.workloadModes
            .filter(item => item.value === worloadId)
            .map(item => item.label)
            ;
  }
}
