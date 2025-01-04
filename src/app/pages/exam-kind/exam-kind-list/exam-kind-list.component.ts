import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ExamCategory, SearchParams } from 'src/app/core/models/ExamCategory';
import { ExamCategoryService } from 'src/app/core/services/exam-category.service';

@Component({
  selector: 'app-exam-kind-list',
  templateUrl: './exam-kind-list.component.html',
  styleUrls: ['./exam-kind-list.component.scss']
})
export class ExamKindListComponent implements OnInit {
  categories: ExamCategory[] = [];
  loading = false;
  visible = false;
  editingCategory: Partial<ExamCategory> | null = null;
  editorOptions = {
    theme: 'vs-light',
    language: 'json',
    minimap: { enabled: false },
    scrollBeyondLastLine: false,
    automaticLayout: true,
    formatOnPaste: true,
    formatOnType: true,
    fontSize: 14
  };

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
    private examCategoryService: ExamCategoryService,
    private modal: NzModalService,
    private message: NzMessageService
  ) { }

  ngOnInit(): void {
    this.loadData();
     // 设置默认内容模板
     if (this.editingCategory && !this.editingCategory.content) {
      this.setDefaultContent();
    }
  }
  setDefaultContent() {
    if (!this.editingCategory) return;

    switch (this.editingCategory.categoryType) {
      case '1':
        this.editingCategory.content = JSON.stringify({
          examTypeIds: []
        }, null, 2);
        break;
      case '2':
        this.editingCategory.content = JSON.stringify({
          bodyPartIds: []
        }, null, 2);
        break;
      case '3':
        this.editingCategory.content = JSON.stringify({
          examItemIds: []
        }, null, 2);
        break;
      case '4':
        this.editingCategory.content = 'SELECT * FROM table_name WHERE 1=1';
        break;
    }
  }

  onCategoryTypeChange() {
    this.setDefaultContent();
  }
  getContentTemplate(type: string): string {
    switch (type) {
      case '1': // 检查类别
        return JSON.stringify({
          examTypeIds: ["TYPE001", "TYPE002"]
        }, null, 2);
      case '2': // 检查部位
        return JSON.stringify({
          bodyPartIds: ["PART001", "PART002"]
        }, null, 2);
      case '3': // 检查项目
        return JSON.stringify({
          examItemIds: ["ITEM001", "ITEM002"]
        }, null, 2);
      default:
        return '';
    }
  }
  searchParams: SearchParams = {};

  // ... 原有的构造函数和其他方法

  search(): void {
    this.loading = true;
    this.examCategoryService.getAll(this.searchParams).subscribe(
      data => {
        this.categories = data;
        this.loading = false;
      },
      error => {
        this.message.error('加载数据失败！');
        this.loading = false;
      }
    );
  }

  resetSearch(): void {
    this.searchParams = {};
    this.search();
  }

  // 修改原有的 loadData 方法
  loadData(): void {
    this.search();
  }
  // loadData(): void {
  //   this.loading = true;
  //   this.examCategoryService.getAll().subscribe(
  //     data => {
  //       this.categories = data;
  //       this.loading = false;
  //     },
  //     error => {
  //       this.message.error('加载数据失败！');
  //       this.loading = false;
  //     }
  //   );
  // }

  showModal(category?: ExamCategory): void {
    this.editingCategory = category ? 
      { ...category } : 
      { isActive: '1', categoryType: '1' };
    this.visible = true;
  }

  handleOk(): void {
    if (!this.editingCategory) return;
    
    if (!this.editingCategory.categoryName || !this.editingCategory.categoryType) {
      this.message.error('请填写必填项！');
      return;
    }

    // 验证content的格式
    if (this.editingCategory.content) {
      try {
        if (this.editingCategory.categoryType !== '4') {
          // 如果不是自定义类型，验证JSON格式
          JSON.parse(this.editingCategory.content);
        }
      } catch (e) {
        this.message.error('内容格式不正确！');
        return;
      }
    }
    if (this.editingCategory.categoryType === '4' && this.editingCategory.content) {
      //sql类型
      this.editingCategory.content = this.editingCategory.content.trim();
    }
    const request = this.editingCategory.categoryId ?
      this.examCategoryService.update(this.editingCategory.categoryId, this.editingCategory) :
      this.examCategoryService.create(this.editingCategory);

    request.subscribe(
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

  handleDelete(id: string): void {
    this.modal.confirm({
      nzTitle: '确定要删除这条记录吗？',
      nzContent: '删除后无法恢复',
      nzOnOk: () => {
        this.examCategoryService.delete(id).subscribe(
          () => {
            this.message.success('删除成功！');
            this.loadData();
          },
          error => {
            this.message.error('删除失败！');
          }
        );
      }
    });
  }
  expandSet = new Set<string>();

  onExpandChange(id: string, checked: boolean): void {
    if (checked) {
      this.expandSet.add(id);
    } else {
      this.expandSet.delete(id);
    }
  }

  formatJSON(content: string): string {
    try {
      return JSON.stringify(JSON.parse(content), null, 2);
    } catch {
      return content;
    }
  }
}
