import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ReportGroup, ReportGroupQuery } from 'src/app/core/models/exam-mapset';
import { ReportGroupService } from 'src/app/core/services/report-group.service';

@Component({
  selector: 'app-report-group-list',
  templateUrl: './report-group-list.component.html',
  styleUrls: ['./report-group-list.component.scss']
})
export class ReportGroupListComponent implements OnInit {

  reportGroups: ReportGroup[] = [];
  categories: any[] = []; // 存储所有分类
  loading = false;
  visible = false;
  editingGroup: Partial<ReportGroup> = {};
  expandSet = new Set<string>();
  searchParams: ReportGroupQuery = {};
  sqlEditorOptions = {
    theme: 'vs-light',
    language: 'sql',
    minimap: { enabled: false },
    scrollBeyondLastLine: false,
    automaticLayout: true,
    formatOnPaste: true,
    formatOnType: true,
    fontSize: 14
  };

  constructor(
    private route: ActivatedRoute,
    private reportGroupService: ReportGroupService,
    private message: NzMessageService
  ) {
    this.categories = this.route.snapshot.data['categories'];
  }

  ngOnInit(): void {
    this.loadData();
    this.loadCategories();
  }

  loadData(): void {
    this.loading = true;
    this.reportGroupService.getReportGroups(this.searchParams).subscribe(
      data => {
        this.reportGroups = data;
        this.loading = false;
      },
      error => {
        this.message.error('加载数据失败');
        this.loading = false;
      }
    );
  }

  // 添加搜索方法
  search(): void {
    this.loadData();
  }

  // 添加重置方法
  resetSearch(): void {
    this.searchParams = {};
    this.loadData();
  }


  loadCategories(): void {
    // 加载分类数据的逻辑
  }

  showModal(group?: ReportGroup): void {
    this.editingGroup = group ? { ...group } : {
      isActive: '1',
      groupType: '1',
      reportType: '1'
    };
    this.visible = true;
  }

  handleCancel(): void {
    this.visible = false;
    this.editingGroup = {};
  }

  handleOk(): void {
    if (this.editingGroup.groupId) {
      this.reportGroupService.updateReportGroup(this.editingGroup as ReportGroup).subscribe(
        () => {
          this.message.success('更新成功');
          this.loadData();
          this.visible = false;
        },
        error => this.message.error('更新失败')
      );
    } else {
      this.reportGroupService.createReportGroup(this.editingGroup as ReportGroup).subscribe(
        () => {
          this.message.success('创建成功');
          this.loadData();
          this.visible = false;
        },
        error => this.message.error('创建失败')
      );
    }
  }

  handleDelete(id: string): void {
    this.reportGroupService.deleteReportGroup(id).subscribe(
      () => {
        this.message.success('删除成功');
        this.loadData();
      },
      error => this.message.error('删除失败')
    );
  }

  onExpandChange(id: string, checked: boolean): void {
    if (checked) {
      this.expandSet.add(id);
    } else {
      this.expandSet.delete(id);
    }
  }

  onGroupTypeChange(): void {
    if (this.editingGroup.groupType === '1') {
      this.editingGroup.customSql = undefined;
      this.editingGroup.categories = [];
    } else {
      this.editingGroup.categories = undefined;
      this.editingGroup.customSql = '';
    }
  }

  getCategoryName(categoryId: string): string {
    const category = this.categories.find(c => c.categoryId === categoryId);
    return category ? category.categoryName : categoryId;
  }

}
