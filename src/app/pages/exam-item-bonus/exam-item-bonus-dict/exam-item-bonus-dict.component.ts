import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { BatchUpdateWorkloadDTO, ExamItemDict, ExamItemDictQueryDTO } from 'src/app/core/models/exam-item-dict';
import { ExamItemDictService } from 'src/app/core/services/exam-item-dict.service';
import { NzAlertModule } from 'ng-zorro-antd/alert';

@Component({
  selector: 'app-exam-item-bonus-dict',
  templateUrl: './exam-item-bonus-dict.component.html',
  styleUrls: ['./exam-item-bonus-dict.component.scss']
})
export class ExamItemBonusDictComponent implements OnInit {

  // 数据列表
  examItems: ExamItemDict[] = [];
  loading = false;
  
  // 分页参数
  pageIndex = 1;
  pageSize = 10;
  total = 0;

  // 搜索参数
  searchParams: ExamItemDictQueryDTO = {
    pageIndex: 1,
    pageSize: 10
  };

  // 编辑弹窗
  visible = false;
  editingItem: Partial<ExamItemDict> | null = null;

  // 批量更新弹窗
  batchVisible = false;
  batchWorkload: number = 1.0;
  
  // 选中的行
  setOfCheckedId = new Set<string>();
  checked = false;
  indeterminate = false;

  constructor(
    private examItemDictService: ExamItemDictService,
    private modal: NzModalService,
    private message: NzMessageService
  ) { }

  ngOnInit(): void {
    this.loadData();
  }

  // 加载数据
  loadData(): void {
    this.loading = true;
    this.searchParams.pageIndex = this.pageIndex;
    this.searchParams.pageSize = this.pageSize;

    this.examItemDictService.getExamItems(this.searchParams).subscribe(
      result => {
        this.examItems = result.data;
        this.total = result.total;
        this.loading = false;
      },
      error => {
        this.message.error('加载数据失败！');
        this.loading = false;
      }
    );
  }

  // 搜索
  search(): void {
    this.pageIndex = 1;
    this.loadData();
  }

  // 重置搜索
  resetSearch(): void {
    this.searchParams = {
      pageIndex: 1,
      pageSize: 10
    };
    this.pageIndex = 1;
    this.loadData();
  }

  // 分页变化
  onPageIndexChange(pageIndex: number): void {
    this.pageIndex = pageIndex;
    this.loadData();
  }

  onPageSizeChange(pageSize: number): void {
    this.pageSize = pageSize;
    this.pageIndex = 1;
    this.loadData();
  }

  // 显示编辑弹窗
  showEditModal(item: ExamItemDict): void {
    this.editingItem = { ...item };
    this.visible = true;
  }

  // 保存编辑
  handleOk(): void {
    if (!this.editingItem || !this.editingItem.serialNo) {
      this.message.error('数据不完整！');
      return;
    }

    if (this.editingItem.reportWorkload === undefined || this.editingItem.reportWorkload < 0) {
      this.message.error('请输入有效的工作量值！');
      return;
    }

    this.examItemDictService.updateExamItem(
      this.editingItem.serialNo, 
      this.editingItem
    ).subscribe(
      () => {
        this.message.success('保存成功！');
        this.visible = false;
        this.loadData();
      },
      error => {
        this.message.error('保存失败！');
      }
    );
  }

  // 全选/取消全选
  onAllChecked(checked: boolean): void {
    this.examItems.forEach(item => {
      if (checked) {
        this.setOfCheckedId.add(item.serialNo);
      } else {
        this.setOfCheckedId.delete(item.serialNo);
      }
    });
    this.refreshCheckedStatus();
  }

  // 单选
  onItemChecked(serialNo: string, checked: boolean): void {
    if (checked) {
      this.setOfCheckedId.add(serialNo);
    } else {
      this.setOfCheckedId.delete(serialNo);
    }
    this.refreshCheckedStatus();
  }

  // 刷新选中状态
  refreshCheckedStatus(): void {
    const listOfEnabledData = this.examItems;
    this.checked = listOfEnabledData.length > 0 && 
                   listOfEnabledData.every(item => this.setOfCheckedId.has(item.serialNo));
    this.indeterminate = listOfEnabledData.some(item => this.setOfCheckedId.has(item.serialNo)) && 
                         !this.checked;
  }

  // 显示批量更新弹窗
  showBatchUpdateModal(): void {
    if (this.setOfCheckedId.size === 0) {
      this.message.warning('请至少选择一条记录！');
      return;
    }
    this.batchWorkload = 1.0;
    this.batchVisible = true;
  }

  // 批量更新工作量
  handleBatchUpdate(): void {
    if (this.batchWorkload === undefined || this.batchWorkload < 0) {
      this.message.error('请输入有效的工作量值！');
      return;
    }

    const dto: BatchUpdateWorkloadDTO = {
      serialNos: Array.from(this.setOfCheckedId),
      reportWorkload: this.batchWorkload
    };

    this.examItemDictService.batchUpdateWorkload(dto).subscribe(
      () => {
        this.message.success(`成功更新 ${dto.serialNos.length} 条记录！`);
        this.batchVisible = false;
        this.setOfCheckedId.clear();
        this.refreshCheckedStatus();
        this.loadData();
      },
      error => {
        this.message.error('批量更新失败！');
      }
    );
  }
  getWorkloadColor(workload: number): string {
    if (workload >= 5) return 'red';
    if (workload >= 3) return 'orange';
    if (workload >= 2) return 'blue';
    if (workload >= 1) return 'green';
    return 'default';
  }
}
