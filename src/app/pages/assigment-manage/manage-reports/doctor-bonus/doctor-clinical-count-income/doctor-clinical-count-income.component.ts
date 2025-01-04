import { SelectionModel } from '@angular/cdk/collections';
import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, take, tap } from 'rxjs/operators';
import { DoctorBonus } from 'src/app/core/model/doctorbonus';
import { ApiService } from 'src/app/core/services/api.service';
import { JwtService } from 'src/app/core/services/jwt.service';
import { AG_GRID_LOCALE_INTERNATIONALIZATION } from 'src/app/pages/aggrid-internationalization';
import { CustomDatepickerHeaderComponent } from 'src/app/shared/components/custom-datepicker-header/custom-datepicker-header.component';

@Component({
  selector: 'app-doctor-clinical-count-income',
  templateUrl: './doctor-clinical-count-income.component.html',
  styleUrls: ['./doctor-clinical-count-income.component.scss']
})
export class DoctorClinicalCountIncomeComponent implements OnInit {

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

  computeNomalCount = (params: any) => {
    const count = parseInt(params.data.yymhsfs) + parseInt(params.data.yyphmfs)
      + parseInt(params.data.ckptsfs) + parseInt(params.data.ckptmfs);
    return count;
  }

  computeEmergencyCount = (params: any) => {
    // console.log("1",parseInt(params.data.ckjzsfs));
    // console.log("2",parseInt(params.data.ckzjmfs));
    
    const count = parseInt(params.data.ckjzsfs) + parseInt(params.data.ckjzmfs);
    return count;
  }

  computeExpertCount = (params: any) => {
    const count = parseInt(params.data.ckzjs) + parseInt(params.data.yyzjs);
    return count;
  }

  computeTotal = (params: any) => {
    const count = this.computeExpertCount(params) + this.computeEmergencyCount(params) + this.computeNomalCount(params);
    return count;
  }

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
      field: 'ckptsfs',
      headerName: '窗口普号收费数',
    },
    {
      field: 'ckptmfs',
      headerName: '窗口普号免费数',
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
      field: 'pths',
      headerName: '普通号数',
      valueGetter: this.computeNomalCount,
      cellClassRules: {
        'cell-span': "true",
      },
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
      field: 'jzhs',
      headerName: '急诊号数',
      valueGetter: this.computeEmergencyCount,
      cellClassRules: {
        'cell-span': "true",
      },
    },
    {
      field: 'ckzjs',
      headerName: '窗口专家数',
    },
    {
      field: 'yyzjs',
      headerName: '预约专家数',
    },
    {
      field: 'zjhs',
      headerName: '专家号数',
      valueGetter: this.computeExpertCount,
      cellClassRules: {
        'cell-span': "true",
      },
    },
    {
      field: 'hj',
      headerName: '合计',
      valueGetter: this.computeTotal,
      cellClassRules: {
        'cell-span': "true",
      },
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
  }
  search() {
    this.searchPipe().subscribe((result) => {
      // console.log(result);
      this.rowData = result;
      // console.log(this.rowData)
    });
  }
}
