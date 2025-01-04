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
  selector: 'app-expert-income',
  templateUrl: './expert-income.component.html',
  styleUrls: ['./expert-income.component.scss']
})
export class ExpertIncomeComponent implements OnInit {

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
  public workDay: (string | null)[] = [];
  public holiday: string[] = [];

  public localeText = AG_GRID_LOCALE_INTERNATIONALIZATION;
  defaultColDef = {
    resizable: true,
  };

  computeBonus = (params:any) => { 
    console.log("params",params);  
    const count = parseFloat(params.data.workDayCost) + parseFloat(params.data.holidayCost);
    return this.roundNumber(count);
  }
  roundNumber(num: number): string{
    return this.decimalPipe.transform(num, "1.2-2") ?? '0';
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
      field: 'ckzjs',
      headerName: '窗口专家数',
    },   
    {
      field: 'yyzjmfs',
      headerName: '预约专家收费数',
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
      field: 'yyzjghf',
      headerName: '预约专家挂号费',
    },
    {
      field: 'yyzjzcf',
      headerName: '预约专家诊查费',
    },
    {
      field: 'workDayCost',
      headerName: '工作日总费用',
    },
    {
      field: 'holidayCost',
      headerName: '节假日总费用',
    },
    {
      field: 'yyzjzcf',
      headerName: '专家门诊奖励',
      valueGetter: this.computeBonus
    },
    
  ];
  rowData: DoctorBonus[] = [];
  searchForm = new FormGroup({
    workDay: new FormControl(),
    holiday: new FormControl(),
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
    private decimalPipe: DecimalPipe,
    private datePipe: DatePipe,
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
  getWorkDayAndHoliday() {
    this.holiday = this.daysSelected
    const startDate = Date.parse(this.startDate)/(1000 * 60 * 60 * 24);  
    const endDate = Date.parse(this.endDate)/(1000 * 60 * 60 * 24);
    console.log("start and end ",startDate, endDate);
    
    const dateArray: (string | null)[] = [];

    for(let i = startDate, j = 0; i <= endDate; i++, j++) {
      const currentDate = this.datePipe.transform(new Date(i * 1000 * 60 * 60 * 24), 'yyyy-MM-dd') ?? '';
      if (this.holiday.indexOf(currentDate) === -1) {
        dateArray.push(currentDate);
      }
    }
    this.workDay = dateArray;
    console.log("dateArray",dateArray,this.holiday, this.workDay,this.workDay.length);
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
    this.searchForm.patchValue({
      workDay: this.workDay,
      holiday: this.holiday,
    })
    this.requesting = true;
    return this.apiService
      .post<DoctorBonus[]>(
        '/expertsReward/experts_income',
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
