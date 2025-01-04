import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { finalize, take } from 'rxjs/operators';
import { ClinicalLog } from 'src/app/core/model/clinicallog';
import { ApiService } from 'src/app/core/services/api.service';
import { JwtService } from 'src/app/core/services/jwt.service';
import { CustomDatepickerHeaderComponent } from 'src/app/shared/components/custom-datepicker-header/custom-datepicker-header.component';
import { AG_GRID_LOCALE_INTERNATIONALIZATION } from '../../aggrid-internationalization';

@Component({
  selector: 'app-clinical-log',
  templateUrl: './clinical-log.component.html',
  styleUrls: ['./clinical-log.component.scss']
})
export class ClinicalLogComponent implements OnInit {
  public requesting: boolean = false;
  public readonly CustomDatepickerHeaderComponent =  CustomDatepickerHeaderComponent;
  private gridApi:any;
  private gridColumnApi:any;
  public ifSearchFitter: boolean = false;
  dates:Record<string, string>[] = [];
  startTime: string = '';
  endTime: string = '';
  searchForm = new FormGroup({
    startTime: new FormControl(''),
    endTime: new FormControl(''),
    offset: new FormControl(),
    limit: new FormControl()
  });

  public offset: number = 0;
  public limit: number = 20;
  public length: number = 0;
  public pageIndex: number = 0;

  public localeText = AG_GRID_LOCALE_INTERNATIONALIZATION;
  defaultColDef = {
    resizable: true,
  };
  columnDefs = [
    { 
      field: 'jksj',
      headerName: '建卡时间',
      //colSpan: (params:any) =>  2 ,
    },
    {
      field: 'czy',
      headerName: '操作员',
    },
    {
      field: 'jzkh',
      headerName: '就诊卡号',
    },
    {
      field: 'hzxm',
      headerName: '患者姓名',
      editable:true,
    },
    {
      field: 'sfzh',
      headerName: '身份证号',
    }, 
    {
      field: 'jtdz',
      headerName: '家庭地址',
    }, 
  ];
  rowData: ClinicalLog[] = [];
  constructor(
    public apiService: ApiService,
    public _jwt: JwtService,
    public router: Router,
    private datepipe: DatePipe,
    public dialog: MatDialog,
  ) { 
    for (var i = 0; i <= 12; i++) {
      var d = new Date();
      d.setMonth(d.getMonth() - i);
      var month = ("0" + (d.getMonth() + 1)).slice(-2);
      var year = d.getFullYear();
      this.dates.push({value:`${year}-${month}`, name:`${year}-${month}`});
    }
    // this.startTime = this.dates[0].value; 
    // this.endTime = this.dates[0].value; 
  }

  ngOnInit(): void {
    // this.searchForm.patchValue({endTime: this.dates[0].value, startTime: this.dates[0].value});
  }
  changeSearchResultPage(event: PageEvent) {
    this.offset = event.pageIndex * event.pageSize;
    this.limit = event.pageSize;
    this.pageIndex = event.pageIndex;
    console.log("this.ifSearchFitter",this.ifSearchFitter);
    
    if(this.ifSearchFitter) {
      this.searchFitter();
    } else {
      this.search();
    }
  }

  search() {
    this.ifSearchFitter = false;
    this.searchPipe().subscribe((result) => {
      // console.log("result",result);
      this.rowData = result;
    })
    this.searchCountPipe().subscribe((result) => {
      this.length = result;
    })
  }
  searchFitter() {
    this.ifSearchFitter = true;
    this.searchFitterPipe().subscribe((result) => {
      this.rowData = result;
    });
    this.searchCountFitterPipe().subscribe((result) => {
      this.length = result;
    })
  }
  
  searchPipe() {
    const startTime = this.startTime? this.datepipe.transform(this.startTime,'yyyy-MM-dd') : this.startTime;
    const endTime = this.startTime? this.datepipe.transform(this.endTime,'yyyy-MM-dd') : this.endTime;
    this.searchForm.patchValue({
      startTime: startTime,
      endTime: endTime,
    })
    this.requesting = true;
    return this.apiService
      .post<ClinicalLog[]>(
        `/outpatientLog/queryAll`,
        {
          startTime: this.searchForm.value.startTime,
          endTime: this.searchForm.value.endTime,
          limit: this.limit,
          offset: this.offset
        },
        {
          headers: {
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
  searchCountPipe () {
    const startTime = this.startTime? this.datepipe.transform(this.startTime,'yyyy-MM-dd') : this.startTime;
    const endTime = this.startTime? this.datepipe.transform(this.endTime,'yyyy-MM-dd') : this.endTime;
    this.searchForm.patchValue({
      startTime: startTime,
      endTime: endTime,
    })
    return this.apiService
      .post<number>(
        `/outpatientLog/countAll`,
        {
          startTime: this.searchForm.value.startTime,
          endTime: this.searchForm.value.endTime,
          limit: this.limit,
          offset: this.offset
        },
        {
          headers: {
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
  

  searchFitterPipe() {
    return this.apiService
    .post<ClinicalLog[]>(
      `/outpatientLog/query`,
      {
        startTime: this.searchForm.value.startTime,
        endTime: this.searchForm.value.endTime,
        limit: this.limit,
        offset: this.offset
      },
      {
        headers: {
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
    )
  }

  searchCountFitterPipe() {
    return this.apiService
    .post<number>(
      `/outpatientLog/count`,
      {
        startTime: this.searchForm.value.startTime,
        endTime: this.searchForm.value.endTime,
        limit: this.limit,
        offset: this.offset
      },
      {
        headers: {
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
    )
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
  onGridReady(params:any) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }
}
