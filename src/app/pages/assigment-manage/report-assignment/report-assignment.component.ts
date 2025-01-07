import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ExamUser } from 'src/app/core/models/common-models';
import { ASSIGNMENT_STATUS, ASSIGNMENT_STATUS_TEXT, BatchAssignDTO, ReportAssignmentDTO, ReportAssignmentQueryDTO } from 'src/app/core/models/report-assignment';
import { ReportAssignmentService } from 'src/app/core/services/report-assignment.service';
import { TransferModalComponent } from '../transfer-modal/transfer-modal.component';
import { PageResult } from 'src/app/core/models/page-result';
import { subDays } from 'date-fns';
import { AssignmentHistoryModalComponent } from '../assignment-history-modal/assignment-history-modal.component';
import { EllipsisCellComponent } from '../ellipsis-cell/ellipsis-cell.component';
import { ColDef, GridApi } from 'ag-grid-enterprise';
import { CellClickedEvent, GridOptions, GridReadyEvent, ICellRendererParams, IDatasource, IGetRowsParams } from 'ag-grid-community';
import { StatusTagComponent } from '../status-tag/status-tag.component';
import { AG_GRID_LOCALE_INTERNATIONALIZATION } from '../aggrid-internationalization';
@Component({
  selector: 'app-report-assignment',
  templateUrl: './report-assignment.component.html',
  styleUrls: ['./report-assignment.component.scss']
})
export class ReportAssignmentComponent implements OnInit {
  searchForm: FormGroup;
  assignments: ReportAssignmentDTO[] = [];
  loading = false;
  selectedRows: ReportAssignmentDTO[] = [];
  doctorList: ExamUser[] = [];
  isTransferModalVisible = false;
  totalPage = 0; // 数据总数
  pageIndex = 1; // 当前页码
  pageSize = 50; // 每页条数
  today: Date = new Date();
  yesterday: Date = subDays(this.today, 1); // 获取昨天的日期
  initDateRangeValue = [this.yesterday, this.today];
  public localeText = AG_GRID_LOCALE_INTERNATIONALIZATION;
  private gridApi!: GridApi;
  columnDefs: ColDef[] = [
    {
      headerName: '',
      field: 'checkbox',
      checkboxSelection: true,
      headerCheckboxSelection: true,
      width: 60,
      pinned: 'left'
    },
    {
      headerName: '序号',
      field: 'sequenceNumber',
      sortable: false, 
      width: 60,
      pinned: 'left',
      valueGetter: params => {
        // Calculate sequence number based on page size and current page
        const page = Math.floor(params.node?.rowIndex! / this.pageSize);
        return (page * this.pageSize) + params.node?.rowIndex! + 1;
      }
    },
    { field: 'patientName', headerName: '患者姓名', width: 100 },
    { field: 'patientId', headerName: '患者ID', width: 100 },
    { field: 'risNo', headerName: '检查流水号', width: 100 },
    { field: 'patientLocalId', headerName: '影像号', width: 100, tooltipField: 'patientLocalId', },
    { field: 'modality', headerName: '检查类别', width: 80 },
    { field: 'examSubClass', headerName: '检查部位', width: 120 },
    { field: 'patientSource', headerName: '检查来源', width: 100 },
    { 
      field: 'baodaoDateTime', 
      headerName: '报道时间', 
      width: 160,
      valueFormatter: params => {
        return params.value ? new Date(params.value).toLocaleString() : '';
      }
    },
    { 
      field: 'examDateTime', 
      headerName: '检查时间', 
      width: 160,
      valueFormatter: params => {
        return params.value ? new Date(params.value).toLocaleString() : '';
      }
    },
    { 
      field: 'preliminaryDoctorId', 
      headerName: '初步报告分配医生',
      width: 140,
      valueFormatter: params => this.getDoctorName(params.value)
    },
    {
      field: 'preliminaryAssignTime',
      headerName: '初步报告分配时间',
      width: 160,
      valueFormatter: params => {
        return params.value ? new Date(params.value).toLocaleString() : '';
      }
    },
    { 
      field: 'reviewDoctorId', 
      headerName: '审核报告分配医生',
      width: 140,
      valueFormatter: params => this.getDoctorName(params.value)
    },
    {
      field: 'reviewAssignTime',
      headerName: '审核报告分配时间',
      width: 160,
      valueFormatter: params => {
        return params.value ? new Date(params.value).toLocaleString() : '';
      }
    },
    { 
      field: 'createUser', 
      headerName: '记录创建人',
      width: 100,
      valueFormatter: params => this.getDoctorName(params.value)
    },
    { 
      field: 'updateUser', 
      headerName: '最后修改人',
      width: 100,
      valueFormatter: params => this.getDoctorName(params.value)
    },
    {
      field: 'systemAssignmentStatus',
      headerName: '系统分配状态',
      width: 150,
      pinned: 'right',
      sortable: false, 
      cellRenderer: 'statusTagComponent'
    },
    {
      field: 'retryCount',
      headerName: '尝试次数',
      width: 80,
      pinned: 'right',
      sortable: false, 
      cellRenderer: params => {
        if (params.value > 0) {
          return `<span title="已重试${params.value}次">${params.value}</span>`;
        }
        return '';
      }
    },
    {
      field: 'errorMsg',
      headerName: '最近失败原因',
      width: 120,
      pinned: 'right',
      sortable: false, 
      tooltipField: 'errorMsg'
    },
    {
      field: 'operation',
      headerName: '操作',
      width: 100,
      pinned: 'right',
      sortable: false, 
      cellRenderer: params => {
        return '<a class="grid-link">分配历史</a>';
      },
      onCellClicked: (event: CellClickedEvent) => {
        this.showAssignmentHistory(event.data);
      }
    }
  ];

  defaultColDef = {
    sortable: true,
    resizable: true
  };

  getRowId = (params: any) => params.data.risNo;

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    // 设置 getRowNodeId
    //this.gridApi.setGridOption('getRowNodeId', this.getRowNodeId);
    this.loadData();
  }
  gridOptions: GridOptions = {
    localeText: this.localeText,
    rowModelType: 'infinite',
    enableCellTextSelection: true,
    suppressRowClickSelection: true,
    rowSelection: 'multiple',
    pagination: true,
    paginationPageSize: this.pageSize,
    cacheBlockSize: this.pageSize,
    maxConcurrentDatasourceRequests: 1,
    infiniteInitialRowCount: 1,
    getRowNodeId: (data: any) => {
      return data.risNo;
    },
    defaultColDef: {
      sortable: true,
      resizable: true,
      sort: null
    },
    multiSortKey: 'ctrl', // 按住ctrl键可以进行多列排序
    sortingOrder: ['asc', 'desc', null],
    onGridReady: (params) => {
      this.gridApi = params.api;
      // 从localStorage加载排序状态
      this.loadSortState();
      this.loadData();
    },
    onSortChanged: (event: any) => {
      // 保存排序状态到localStorage
      this.saveSortState();
      if (this.gridApi) {
        this.gridApi.purgeInfiniteCache();
      }
    }
  };
  private readonly SORT_STATE_KEY = 'reportAssignment_sortState';
   // 保存排序状态到localStorage
   private saveSortState(): void {
    const sortModel = this.gridApi.getSortModel();
    localStorage.setItem(this.SORT_STATE_KEY, JSON.stringify(sortModel));
  }

  // 从localStorage加载排序状态
  private loadSortState(): void {
    try {
      const savedState = localStorage.getItem(this.SORT_STATE_KEY);
      if (savedState) {
        const sortModel = JSON.parse(savedState);
        this.gridApi.setSortModel(sortModel);
      }
    } catch (error) {
      console.error('Error loading sort state:', error);
      localStorage.removeItem(this.SORT_STATE_KEY);
    }
  }

  // 单独定义 getRowNodeId 函数
  public getRowNodeId = (data: any) => {
    return data.risNo;
  };
  onSelectionChanged(event: any) {
    this.selectedRows = this.gridApi.getSelectedRows();
  }
  loadData(reset: boolean = false): void {
    if (reset) {
      // localStorage.removeItem(this.SORT_STATE_KEY);
      // this.gridApi.setSortModel(null);
      this.searchForm.reset({
        examDateRange: [this.yesterday, this.today]
      });
      this.pageIndex = 1;
    }
    
    const dataSource: IDatasource = {
      getRows: (params: IGetRowsParams) => {
        const query = this.getSearchParams();
        // 计算开始行和结束行
        const startRow = params.startRow;
        const endRow = params.endRow;
        const sortModel = params.sortModel;
        if (sortModel && sortModel.length > 0) {
          query.sortModel = sortModel.map((model:any) => ({
            colId: model.colId,
            sort: model.sort as 'asc' | 'desc'
          }));
        }
        // 更新查询参数
        query.pageIndex = Math.floor(startRow / this.pageSize) + 1;
        query.pageSize = this.pageSize;
        
        this.loading = true;
        
        this.reportAssignmentService.getAssignments(query).subscribe({
          next: (result: any) => {
            params.successCallback(
              result.data,
              result.total
            );
            this.totalPage = result.total;
            this.loading = false;
          },
          error: (error) => {
            params.failCallback();
            this.message.error('加载数据失败');
            this.loading = false;
          }
        });
      }
    };

    this.gridApi.setDatasource(dataSource);
  }
  constructor(
    private fb: FormBuilder,
    private reportAssignmentService: ReportAssignmentService,
    private message: NzMessageService,
    private modal: NzModalService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef 
  ) {
    this.searchForm = this.fb.group({
      patientName: [''],
      patientId: [''],
      modality: [''],
      examSubClass: [''],
      examItemsstr:[''],
      patientSource: [''],
      doctorId: [''],
      status: [''],
      assignType: [''],
      onlySystemAssigned: [false],
      onlyFailedAssignments:[false],
      dateRange: [[]],
      startDate: [this.yesterday],  // 默认开始日期为昨天
      endDate: [this.today],        // 默认结束日期为今天
      examDateRange: [[this.yesterday, this.today]] // 默认日期范围为昨天到今天
    });
    this.gridOptions = {
      ...this.gridOptions,
      frameworkComponents: {
        statusTagComponent: StatusTagComponent
      }
    };
  }
  // 添加获取状态颜色的方法
  getStatusColor(preliminaryDoctorId: string | undefined, reviewDoctorId: string | undefined): string {
    if (!preliminaryDoctorId && !reviewDoctorId) {
      return 'warning';  // 如果两者都没有值，表示待分配，使用警告颜色
    } else if (preliminaryDoctorId && !reviewDoctorId) {
      return 'processing'; // 如果只有 preliminaryDoctorId 有值，表示初步已分配，使用处理中颜色
    } else if (!preliminaryDoctorId && reviewDoctorId) {
      return 'processing'; // 如果只有 reviewDoctorId 有值，表示审核已分配，使用处理中颜色
    } else {
      return 'success'; // 如果两者都有值，表示已完成，使用成功颜色
    }
  }

  // 添加获取状态文本的方法
  getStatusText(status: string, preliminaryDoctorId: string | undefined, reviewDoctorId: string | undefined): string {
    //console.log(preliminaryDoctorId, reviewDoctorId);
    if (!preliminaryDoctorId && !reviewDoctorId) {
      return '待分配';  // 如果两者都没有值，表示待分配
    } else if (preliminaryDoctorId && !reviewDoctorId) {
      return '初步医生已分配'; // 如果只有 preliminaryDoctorId 有值，表示初步已分配
    } else if (preliminaryDoctorId && reviewDoctorId) {
      return '审核医生已分配';  // 如果只有 reviewDoctorId 有值，表示审核已分配
    } else {
      return (ASSIGNMENT_STATUS_TEXT as any)[status] || '未知状态';  // 如果都有值，返回已有的状态文本
    }
  }
  
  ngOnInit(): void {
    const resolverData = this.route.snapshot.data['resolverData'];
    this.doctorList = resolverData.doctorList.data;
    this.loadData();
  }

  // loadData(reset: boolean = false): void {
  //   if (reset) {
  //     this.searchForm.reset();
  //     this.searchForm.reset({
  //       examDateRange: [this.yesterday, this.today],  // 重置时默认选择昨天到今天
  //     });
  //     this.pageIndex = 1; // 重置页码
  //   }
    
  //   this.loading = true;
  //   const query = this.getSearchParams();
    
  //   this.reportAssignmentService.getAssignments(query).subscribe(
  //     data => {
  //       const pageResult = data as any as PageResult<ReportAssignmentDTO[]>;
  //       this.assignments = [...pageResult.data];
  //       // this.pageIndex = pageResult.page;
  //       // this.pageSize = pageResult.pageSize;
  //       this.totalPage = pageResult.total;
  //       this.loading = false;
  //       this.cdr.detectChanges();
  //     },
  //     error => {
  //       this.message.error('加载数据失败');
  //       this.loading = false;
  //     }
  //   );
  // }
  trackById(index: number, item: any): any {
    return item.risNo; // 假设 risNo 是唯一标识符
  }
  getDoctorName(doctorId: string | undefined): string {

    if (!doctorId) return '';
    if(doctorId.toLowerCase() === 'system') {
      return "系统自动";
    }
    const doctor = this.doctorList.find(d => d.userId === doctorId);
    return doctor ? doctor.userName : '未知医生';
  }
  onTransfer(): void {
    const modal = this.modal.create({
      nzTitle: '选择转发医生',
      nzContent: TransferModalComponent,
      nzWidth: 600,
      nzFooter: null,
      nzComponentParams: {
        doctorList: this.doctorList,
        selectedRows: this.selectedRows,
      },
      nzOnOk: (componentInstance: TransferModalComponent) => {

      }
    });
    modal.afterClose.subscribe(result => {
      //console.log("???");
      this.loading = true;
      this.loadData();
    });
  }

  getSystemAssignmentStatusColor(data: ReportAssignmentDTO): string {
    if (data.isProcessed === '0') {
      return 'error';
    }
    return 'success';
  }

  onPageChange(pageIndex: number): void {
    this.pageIndex = pageIndex;
    this.loadData();
  }

  onPageSizeChange(pageSize: number): void {
    this.pageSize = pageSize;
    this.pageIndex = 1; // 页码重置为第一页
    this.loadData();
  }
  /*
  根据选中表格里的患者信息，生成召回sumarry，并允许去掉一些记录:没有分配记录，不允许召回
  如果ResultStatus大于等于审核报告，不允许召回，
  如果resultStatus大于等于40，且reviewDoctorId有值，允许召回审核医生，
  如果resultStatus小于40，且preliminaryDoctorId有值，允许召回初步报告医生。
  */
  onRecall(): void {
    if (this.selectedRows.length === 0) {
      this.message.warning('请选择需要召回的报告');
      return;
    }
    const recallSummary = this.selectedRows.map(row => {
      let canRecall = false;
      let reason = '';
      
      if (!row.assignmentId) {
        // If there's no assignmentId, it can't be recalled
        reason = '没有分配记录，不允许召回';
      } else if (row.resultStatus >= '45') {
        // ResultStatus is greater than or equal to 审核报告 (Review Report), cannot recall
        reason = '审核报告或更高状态，不允许召回';
      } else if (row.resultStatus >= '40' && row.reviewDoctorId) {
        // ResultStatus is greater than or equal to 40 (initial report), and reviewDoctorId exists, allow recall
        canRecall = true;
        reason = '可以召回审核医生';
      } else if (row.resultStatus < '40' && row.preliminaryDoctorId) {
        // ResultStatus is less than 40 (preliminary report), and preliminaryDoctorId exists, allow recall
        canRecall = true;
        reason = '可以召回初步报告医生';
      } else {
        // Otherwise, cannot recall
        reason = '没有对应医生，不允许召回';
      }
  
      return {
        ...row,
        canRecall,
        reason
      };
    });
    //console.log(recallSummary);
    const validRowsToRecall = recallSummary.filter(row => row.canRecall);
    if (validRowsToRecall.length === 0) {
      this.message.warning('没有可以召回的报告');
      return;
    }
    const recallText = validRowsToRecall.map(row => `${row.patientName}（${row.risNo}）：${row.reason}`).join('<br>');
    this.modal.confirm({
      nzTitle: '确认召回',
      nzContent: '确定要召回选中的报告吗？',
      nzOnOk: () => {
        const recallInfos = validRowsToRecall.map(row => ({
          risNo: row.risNo,            // Assuming risNo exists in the row
          assignmentId: row.assignmentId!,  // Assuming assignmentId exists in the row
          resultStatus: row.resultStatus // Assuming resultStatus exists in the row
        }));
        return this.reportAssignmentService.recallAssignments(recallInfos).toPromise()
          .then(() => {
            this.message.success('召回成功');
            this.loadData();
          });
      }
    });
  }

  onExport(): void {
    const query = this.getSearchParams();
    this.reportAssignmentService.exportAssignments(query);
  }

  private getSearchParams(): ReportAssignmentQueryDTO {
    const formValue = this.searchForm.value;
    
    return {
      patientName: formValue.patientName,
      patientId: formValue.patientId,
      modality: formValue.modality,
      examSubClass: formValue.examSubClass,
      examItemsstr: formValue.examItemsstr,
      patientSource: formValue.patientSource,
      doctorId: formValue.doctorId,
      status: formValue.status,
      assignType: formValue.assignType,
      startDate: formValue.examDateRange ? formValue.examDateRange[0] : this.yesterday,
      endDate: formValue.examDateRange ? formValue.examDateRange[1] : this.today,
      pageIndex: this.pageIndex,
      pageSize: this.pageSize,
      onlySystemAssigned: formValue.onlySystemAssigned,
      onlyFailedAssignments: formValue.onlyFailedAssignments,
    };
  }
  setOfCheckedId = new Set<string>();

  onItemChecked(id: string, checked: boolean): void {
    if (checked) {
      this.setOfCheckedId.add(id);
    } else {
      this.setOfCheckedId.delete(id);
    }
    this.selectedRows = this.assignments.filter(item => 
      this.setOfCheckedId.has(item.risNo!)
    );
  }

  onAllChecked(checked: boolean): void {
    this.assignments.forEach(item => 
      this.onItemChecked(item.risNo, checked)
    );
  }
  showAssignmentHistory(data: ReportAssignmentDTO): void {
    this.modal.create({
      nzTitle: `分配历史 - ${data.patientName}`,
      nzContent: AssignmentHistoryModalComponent,
      nzWidth: 1000,
      nzComponentParams: {
        risNo: data.risNo,
        doctorList: this.doctorList
      },
      nzFooter: null
    });
  }
  loadErrorAssignments(): void {
    this.loading = true;
    const query = this.getSearchParams();
    
    this.reportAssignmentService.getErrorAssignments(query).subscribe(
      data => {
        const pageResult = data as any as PageResult<ReportAssignmentDTO[]>;
        this.assignments = [...pageResult.data];
        this.totalPage = pageResult.total;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error => {
        this.message.error('加载数据失败');
        this.loading = false;
      }
    );
  }
  retryAssignments(): void {
    if (this.selectedRows.length === 0) {
      this.message.warning('请选择需要重新尝试分配的报告');
      return;
    }
    this.modal.confirm({
      nzTitle: '确认重新尝试分配',
      nzContent: '确定要重新尝试分配选中的报告吗？',
      nzOnOk: () => {
        const lastLogIds = this.selectedRows
          .filter(row => row.lastLogId)
          .map(row => row.lastLogId!);
        if(lastLogIds.length === 0) {
          //重试分配的日志已过期删除, 操作无效
          this.message.warning('重试分配的日志已过期删除, 操作无效');
          return;
        }
        return this.reportAssignmentService.retryAssignments(lastLogIds)
          .toPromise()
          .then(() => {
            this.message.success('重新分配成功');
            this.loadData();
          });
      }
    });
  }

  
}
