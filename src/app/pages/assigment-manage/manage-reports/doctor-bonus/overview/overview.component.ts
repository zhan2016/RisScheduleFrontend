import { SelectionModel } from '@angular/cdk/collections';
import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, take, tap } from 'rxjs/operators';
import { DoctorBonus } from 'src/app/core/model/doctorbonus';
import { ApiService } from 'src/app/core/services/api.service';
import { JwtService } from 'src/app/core/services/jwt.service';
import { CustomDatepickerHeaderComponent } from 'src/app/shared/components/custom-datepicker-header/custom-datepicker-header.component';
import {
  ColDef,
  GridReadyEvent,
  ICellRendererComp,
  ICellRendererParams,
  StatusPanelDef,
} from 'ag-grid-community';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import 'ag-grid-enterprise';
import { AG_GRID_LOCALE_INTERNATIONALIZATION } from '../../../../pages/aggrid-internationalization'
@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
  encapsulation:ViewEncapsulation.None
})
export class OverviewComponent implements OnInit {

  public readonly CustomDatepickerHeaderComponent =  CustomDatepickerHeaderComponent;
  public isEnabledOpts:Record<string, string>[] = [];
  // selectedDate: string;
  public requesting: boolean = false;
  private gridApi:any;
  private gridColumnApi:any;
  dates:Record<string, string>[] = [];
  public dataSource: DoctorBonus[] = [];
  public initialSelection = [];
  public allowMultiSelect = true;
  public selection;
  public startDate: string = '';
  public endDate: string = '';

  public localeText = AG_GRID_LOCALE_INTERNATIONALIZATION;

  defaultColDef = {
    resizable: true,
  };
  columnDefs = [
    {
      field: 'ks',
      headerName: '科室',
    },
    {
      field: "ysdm",
      headerName: "医生代码",
    },
    {
      field: "ysmc",
      headerName: "医生名称",
    },
    {
      field: "zc",
      headerName: "职称",
    },
    {
      field: 'ghzs',
      headerName: '挂号总数',
    },
    {
      field: 'thzs',
      headerName: '退号总数',
    },
    {
      field: 'ckptsfs',
      headerName: '窗口普号收费数',
    },
    {
      field: 'ckptmfs',
      headerName: '窗口普号免费数',
    },
    {
      field: 'ckjzsfs',
      headerName: '窗口急诊收费数',
    },
    {
      field: 'ckjzmfs',
      headerName: '窗口急诊免费数',
    },
    {
      field: 'ckzjs',
      headerName: '窗口专家数',
    },
    {
      field: 'ckmfzjs',
      headerName: '窗口免费专家数',
    },
    {
      field: 'yymhsfs',
      headerName: '预约普号收费数',
    },

    {
      field: 'yyphmfs',
      headerName: '预约普号免费数',
    },
    {
      field: 'yyjzsfs',
      headerName: '预约急诊收费数',
    },
    {
      field: 'yyjzmfs',
      headerName: '预约急诊免费数',
    },
    {
      field: 'yyzjmfs',
      headerName: '预约专家收费数',
    },
    {
      field: 'yyzjmfs',
      headerName: '预约专家免费数',
    },
    {
      field: 'zzjphsfs',
      headerName: '自助机普号收费数',
    },
    {
      field: 'zzjphmfs',
      headerName: '自助机普号免费数',
    },
    {
      field: 'zzjjzsfs',
      headerName: '自助机急诊收费数',
    },
    {
      field: 'zzjjzmfs',
      headerName: '自助机急诊免费数',
    },
    {
      field: 'zzjzjsfs',
      headerName: '自助机专家收费数',
    },
    {
      field: 'zzjzjmfs',
      headerName: '自助机专家免费数',
    },

    {
      field: 'ckphghf',
      headerName: '窗口普号挂号费',
    },
    {
      field: 'ckphzcf',
      headerName: '窗口普号诊查费',
    },
    {
      field: 'ckjzghf',
      headerName: '窗口急诊挂号费',
    },
    {
      field: 'ckjzzcf',
      headerName: '窗口急诊诊查费',
    },
    {
      field: 'ckzjghf',
      headerName: '窗口专家挂号费',
    },
    {
      field: 'ckzjzcf',
      headerName: '窗口专家诊查费',
    },

    {
      field: 'yyphghf',
      headerName: '预约普号挂号费',
    },
    {
      field: 'yyphzcf',
      headerName: '预约普号诊查费',
    },
    {
      field: 'yyzjghf',
      headerName: '预约专家挂号费',
    },
    {
      field: 'yyzjzcf',
      headerName: '预约专家诊查费',
    },
    {
      field: 'sjzfghje',
      headerName: '手机支付挂号金额',
    },
    {
      field: 'hsmfh',
      headerName: '核酸免费号',
    },
    {
      field: 'sjghs',
      headerName: '手机挂号数',
    },
  ];
  rowData: DoctorBonus[] = [];
  searchForm = new FormGroup({
    // deptName: new FormControl(),
    // clinicalTime: new FormControl(),
    startDate: new FormControl(),
    endDate: new FormControl(),
  });
  gridOptions:any = {
    defaultColDef: {
      resizable: true,
    },
    columnDefs: this.columnDefs,
    rowData: null,
    onColumnResized: (params:any) => {
      // console.log("params",params);
    },
  };
  selectedDate: string;

  daysSelected: any[] = [];
  // event: any;

  isSelected = (event: any) => {
    const date =
      event.getFullYear() +
      "-" +
      ("00" + (event.getMonth() + 1)).slice(-2) +
      "-" +
      ("00" + event.getDate()).slice(-2);
    return this.daysSelected.find(x => x == date) ? "selected" : "";
  };
  
  select(event: any, calendar: any) {
    const date =
      event.getFullYear() +
      "-" +
      ("00" + (event.getMonth() + 1)).slice(-2) +
      "-" +
      ("00" + event.getDate()).slice(-2);
    const index = this.daysSelected.findIndex(x => x == date);
    if (index < 0) this.daysSelected.push(date);
    else this.daysSelected.splice(index, 1);
  
    calendar.updateTodaysDate();
  }

  constructor(
    private datepipe: DatePipe,
    public apiService: ApiService,
    public router: Router,
    public dialog: MatDialog,
    public _jwt: JwtService,
  ) { 
    for (var i = 0; i <= 12; i++) {
      var d = new Date();
      d.setMonth(d.getMonth() - i);
      var month = ("0" + (d.getMonth() + 1)).slice(-2);
      var year = d.getFullYear();
      this.dates.push({value:`${year}-${month}`, name:`${year}-${month}`});
    }
    this.selectedDate = this.dates[0].value; 
    this.selection = new SelectionModel<DoctorBonus>(this.allowMultiSelect, this.initialSelection);
  }


  
  ngOnInit(): void {
    // this.search();
  }
  onBtExport() {
    this.gridApi.exportDataAsExcel();
  }
  onGridReady(params:any) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
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
  searchPipe(): Observable<DoctorBonus[]> {
    // console.log(this.searchForm);
    const startDate = this.startDate? this.datepipe.transform(this.startDate,'yyyy-MM-dd') : this.startDate;
    const endDate = this.startDate? this.datepipe.transform(this.endDate,'yyyy-MM-dd') : this.endDate;
    this.searchForm.patchValue({
      startDate: startDate,
      endDate: endDate,
    })
    this.requesting = true;
    return this.apiService
      .post<DoctorBonus[]>(
        `/expertsReward/registered_income`,
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
  searchUnwritten(): Observable<DoctorBonus[]> {
    this.requesting = true;
    return this.apiService
      .post<DoctorBonus[]>(
        `/DoctorBonusUsage/check_list`,
        {},
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
  //   this.requesting = true;
  //   return this.apiService
  //     .get<number>(
  //       `/user/count`,
  //       {
  //         headers : {
  //             "token": `${this._jwt.getToken()}`,
  //             "Content-Type": "application/json;charset=UTF-8",
  //         },
 
  //       }
  //     )
  //     .pipe(
  //       finalize(() => {
  //         this.requesting = false;
  //       }),
  //       take(1),
  //     );
  }
  search() {
    this.searchPipe().subscribe((result) => {
      // console.log(result);
      this.rowData = result;
      // console.log(this.rowData)
    });
  }
}
