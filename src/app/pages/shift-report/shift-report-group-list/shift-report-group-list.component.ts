// shift-report-group-list.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ShiftReportGroup, ShiftReportGroupQuery } from 'src/app/core/models/shift-report-group';
import { ShiftReportGroupService } from 'src/app/core/services/shift-report-group.service';

@Component({
  selector: 'app-shift-report-group-list',
  templateUrl: './shift-report-group-list.component.html',
  styleUrls: ['./shift-report-group-list.component.scss']
})
export class ShiftReportGroupListComponent implements OnInit {
  list: ShiftReportGroup[] = [];
  loading = false;
  visible = false;
  editForm!: FormGroup;
  searchValue: ShiftReportGroupQuery = {};
  editingId: string | null = null;
  shiftTypes: any[] = [];
  reportGroups: any[] = [];
  constructor(
    private fb: FormBuilder,
    private service: ShiftReportGroupService,
    private message: NzMessageService,
    private route: ActivatedRoute,
  ) {
    this.createForm();
  }

  createForm(): void {
    this.editForm = this.fb.group({
      shiftTypeId: [null, [Validators.required]],
      groupId: [null, [Validators.required]],
      priority: [1, [Validators.required, Validators.min(1)]],
      isActive: ['1']
    });
  }

  ngOnInit(): void {
    // 从resolver获取数据
    const resolverData = this.route.snapshot.data['resolverData'];
    this.shiftTypes = resolverData.shiftTypes;
    this.reportGroups = resolverData.reportGroups;
    this.loadData();
  }

  loadData(): void {
    this.loading = true;
    this.service.getList(this.searchValue).subscribe(
      data => {
        this.list = data;
        this.loading = false;
      },
      error => {
        this.message.error('加载数据失败');
        this.loading = false;
      }
    );
  }

  search(): void {
    this.loadData();
  }

  reset(): void {
    this.searchValue = {};
    this.loadData();
  }

  showModal(data?: ShiftReportGroup): void {
    if (data) {
      this.editingId = data.shiftGroupId;
      this.editForm.patchValue(data);
    } else {
      this.editingId = null;
      this.editForm.reset({ isActive: '1', priority: 1 });
    }
    this.visible = true;
  }

  handleCancel(): void {
    this.visible = false;
  }

  handleOk(): void {
    if (this.editForm.valid) {
      const formValue = this.editForm.value;

      if (this.editingId) {
        this.service.update(this.editingId, formValue).subscribe(
          () => {
            this.message.success('更新成功');
            this.loadData();
            this.visible = false;
          },
          error => this.message.error('更新失败')
        );
      } else {
        this.service.create(formValue).subscribe(
          () => {
            this.message.success('创建成功');
            this.loadData();
            this.visible = false;
          },
          error => this.message.error('创建失败')
        );
      }
    }
  }

  handleDelete(id: string): void {
    this.service.delete(id).subscribe(
      () => {
        this.message.success('删除成功');
        this.loadData();
      },
      error => this.message.error('删除失败')
    );
  }
}