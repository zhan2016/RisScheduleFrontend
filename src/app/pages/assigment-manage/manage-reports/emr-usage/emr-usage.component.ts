import { SelectionModel } from '@angular/cdk/collections';
import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { GridReadyEvent, RowNode } from 'ag-grid-community';
import { Observable } from 'rxjs';
import { finalize, take, tap } from 'rxjs/operators';
import { Emr } from 'src/app/core/model/emr';
import { ApiService } from 'src/app/core/services/api.service';
import { JwtService } from 'src/app/core/services/jwt.service';
import { CustomDatepickerHeaderComponent } from 'src/app/shared/components/custom-datepicker-header/custom-datepicker-header.component';
import { TotalValueRenderer } from 'src/app/shared/components/renderer/renderer.component';
import { AG_GRID_LOCALE_INTERNATIONALIZATION } from '../../aggrid-internationalization';

@Component({
  selector: 'app-emr-usage',
  templateUrl: './emr-usage.component.html',
  styleUrls: ['./emr-usage.component.scss']
})
export class EmrUsageComponent implements OnInit {
  public readonly CustomDatepickerHeaderComponent =  CustomDatepickerHeaderComponent;
  public isEnabledOpts:Record<string, string>[] = [];
  public sortingOrder: string[];
  // selectedDate: string;
  public requesting: boolean = false;
  private gridApi:any;
  private gridColumnApi:any;
  dates:Record<string, string>[] = [];
  public dataSource: Emr[] = [];
  public initialSelection = [];
  public allowMultiSelect = true;
  public selection;
  public frameworkComponents: any;

  public offset: number = 0;
  public limit: number = 20;
  public length: number = 0;
  public pageIndex: number = 0;

  searchForm = new FormGroup({
    endClinicalTime: new FormControl(''),
    startClinicalTime: new FormControl(''),
    deptName: new FormControl(''),
    offset: new FormControl(0),
    limit: new FormControl(20)
  });
  getDataRenderer = () => {  
    const data = {
      startClinicalTime: this.searchForm.value.startClinicalTime,
      endClinicalTime: this.searchForm.value.endClinicalTime,
      limit: 20,
      offset: 0
    }
    return data;
  }
  writeNumPercent = (params: any) => {
    const num = (params.data.writeNum / params.data.emrNum) * 100;
    return this.roundNumber(num) + "%";
  }
  public localeText = AG_GRID_LOCALE_INTERNATIONALIZATION;
  defaultColDef = {
    resizable: true,
  };
  rowData: Emr[] = [];
  startClinicalTime: string | null = '';
  endClinicalTime: string | null = '';

  gridOptions: any;
  deptName: string = '';
  columnDefs: Record<string, any>[];
  public context: any;


  rowDataGetter = () => this.rowData;
  
  constructor(
    public decimalPipe: DecimalPipe,
    public apiService: ApiService,
    public router: Router,
    public dialog: MatDialog,
    public _jwt: JwtService,
    private datepipe: DatePipe,
  ) { 
    this.context = {componentParent: this};
    this.sortingOrder = ['desc', 'asc'];
    this.frameworkComponents = {
      totalValueRenderer: TotalValueRenderer,
    };
    for (var i = 0; i <= 12; i++) {
      var d = new Date();
      d.setMonth(d.getMonth() - i);
      var month = ("0" + (d.getMonth() + 1)).slice(-2);
      var year = d.getFullYear();
      this.dates.push({value:`${year}-${month}`, name:`${year}-${month}`});
    }
    // this.startClinicalTime = this.dates[0].value; 
    // this.endClinicalTime = this.dates[0].value; 
    this.searchForm.patchValue({
      // endClinicalTime: this.dates[0].value, 
      // startClinicalTime: this.dates[0].value,
      deptName: this.deptName
    });
    
    this.selection = new SelectionModel<Emr>(this.allowMultiSelect, this.initialSelection);


  
    this.columnDefs = [
      {
        field: 'clinicalTime',
        headerName: '就诊时间区间',
        valueGetter: this.getTimeRound,
        // valueGetter: '1111111',
      },
      {
        field: 'deptName',
        headerName: '科室名称',
      },
      {
        field: "emrNum",
        headerName: "电子病历总数",
      },
      {
        field: "writeNum",
        headerName: "已书写数",
        sortingOrder: ['asc', 'desc'],
      },
      {
        field: "notWriteNum",
        headerName: "未书写数",
        sortingOrder: ['asc', 'desc'],
      },
      {
        field: 'rat',
        headerName: '已书写百分比',
        valueGetter: this.writeNumPercent,
      },
      {
        field: 'total',
        headerName: '',
        minWidth: 175,
        colId: "total",
        colKey: "total",
        cellRenderer: 'totalValueRenderer',
        cellRendererParams: {
          emrUsageList: this.rowData,
          data: this.getDataRenderer()
       }
      },
    ];
    this.gridOptions = {
      defaultColDef: {
        resizable: true,
      },
      columnDefs: this.columnDefs,
      rowData: null,
      onColumnResized: (params:any) => {
      },
    };
  }

  ngOnInit(): void {
    // this.search();
  }

  changeSearchResultPage(event: PageEvent) {
    this.offset = event.pageIndex * event.pageSize;
    this.limit = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.search();
  }
  getTimeRound = () =>{
    let startClinicalTime =  this.datepipe.transform(this.startClinicalTime,'yyyy-MM');
    let endClinicalTime = this.datepipe.transform(this.endClinicalTime,'yyyy-MM');
    if(startClinicalTime == null && endClinicalTime == null) {
      return '';
    }
    if(startClinicalTime == null) {
      return endClinicalTime + '之前';
    }
    if(endClinicalTime == null) {
      return startClinicalTime + '以后';
    }
    return startClinicalTime + "至" + endClinicalTime;
  }
  roundNumber(num: number): string {
    return this.decimalPipe.transform(num, "1.2-2") ?? '0';
  }
  sortByUnWriteNum() {
    this.gridColumnApi.applyColumnState({
      state: [
        {
          colId: 'notWriteNum',
          sort: 'asc',
        },
      ],
      defaultState: { sort: null },
    });
  }
  sortByWriteNum() {
    this.gridColumnApi.applyColumnState({
      state: [
        {
          colId: 'writeNum',
          sort: 'asc',
        },
      ],
      defaultState: { sort: null },
    });
  }
  refreshEvenRowsCurrencyData = () => {
    this.gridApi.forEachNode((rowNode:RowNode) => {
      rowNode.setDataValue('total', {
        emrUsageList: rowNode.data.emrUsageList,
        data: this.getDataRenderer()
      });
    });
    this.gridApi.refreshCells({columns: ['total']});
  }
  refreshTimeRound() {
    this.gridApi.forEachNode((rowNode:RowNode) => {
      rowNode.setDataValue('clinicalTime', {
        clinicalTime: rowNode.data.startClinicalTime + rowNode.data.startClinicalTime,
        data: this.getDataRenderer()
      });
    });
    this.gridApi.refreshCells({columns: ['clinicalTime']});
  }
  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
}
  onBtExport() {
    this.gridApi.exportDataAsExcel();
  }
  onFirstDataRendered(params:any) {
    params.api.sizeColumnsToFit();
    this.autoSizeAll(false);
  }
  autoSizeAll(skipHeader:any) {
    const allColumnIds:any = [];
    this.gridColumnApi.getAllColumns().forEach((column:any) => {
      allColumnIds.push(column.colId);
    });
    this.gridColumnApi.autoSizeColumns(allColumnIds, skipHeader);
  }
  searchPipe(): Observable<Emr[]> {
    this.startClinicalTime = this.startClinicalTime? this.datepipe.transform(this.startClinicalTime,'yyyy-MM-dd') : this.startClinicalTime;
    this.endClinicalTime = this.startClinicalTime? this.datepipe.transform(this.endClinicalTime,'yyyy-MM-dd') : this.endClinicalTime;
    this.searchForm.patchValue({
      deptName: this.deptName,
      endClinicalTime: this.endClinicalTime,
      startClinicalTime: this.startClinicalTime,
      // offset: this.offset,
      // limit: this.limit
    })
    this.requesting = true;
    return this.apiService
      .post<Emr[]>(
        `/emrUsage/query`,
        this.searchForm.value,
        {
          headers : {
              "token": `${this._jwt.getToken()}`,
              "Content-Type": "application/json;charset=UTF-8",
          },
        }
      )
      .pipe(
        tap(() => {
          this.selection.clear();
        }),
        finalize(() => {
          this.requesting = false;
        }),
        take(1),
      );
  }
  
  searchCountPipe(){
    this.startClinicalTime = this.startClinicalTime? this.datepipe.transform(this.startClinicalTime,'yyyy-MM-dd') : this.startClinicalTime;
    this.endClinicalTime = this.startClinicalTime? this.datepipe.transform(this.endClinicalTime,'yyyy-MM-dd') : this.endClinicalTime;
    this.searchForm.patchValue({
      deptName: this.deptName,
      endClinicalTime: this.endClinicalTime,
      startClinicalTime: this.startClinicalTime,
      offset: this.offset,
      limit: this.limit
    })
    this.requesting = true;

    return this.apiService
      .post<number>(
        `/emrUsage/check_list/count`,
        this.searchForm.value,
        {
          headers : {
              "token": `${this._jwt.getToken()}`,
              "Content-Type": "application/json;charset=UTF-8",
          },
        }
      )
      .pipe(
        finalize(() => {
          this.requesting = false;
        }),
        take(1),
      );
  }
  search() {
    this.searchPipe().subscribe((result) => {
      setTimeout(() => this.refreshEvenRowsCurrencyData(), 0);
      this.rowData = result;       
    });
    // this.searchCountPipe().subscribe((result) => {
    //   this.length = result
    // });
    this.refreshTimeRound();
  }

}
