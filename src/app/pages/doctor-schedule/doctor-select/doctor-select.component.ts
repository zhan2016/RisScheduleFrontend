import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { ExamUser } from 'src/app/core/models/common-models';
import { ScheduleService } from 'src/app/core/services/schedule.service';

@Component({
  selector: 'app-doctor-select',
  templateUrl: './doctor-select.component.html',
  styleUrls: ['./doctor-select.component.scss']
})
export class DoctorSelectComponent implements OnInit {

  @Input() control!: FormControl;
  @Input() shiftTypeId: string | null = null;
  @Input() multiple = false;
  @Input() placeholder = '请选择医生'; 
  @Output() doctorSelected = new EventEmitter<string | string[]>();
  
  doctors: ExamUser[] = [];
  isLoading = false;
  
  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();

  constructor(private userService: ScheduleService) {}

  ngOnInit() {
    // 设置搜索防抖
    this.searchSubject.pipe(
      debounceTime(500), // 500ms防抖
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(searchText => {
      this.loadDoctors(searchText);
    });
    
    // 初始加载医生列表
    if (this.shiftTypeId) {
      this.loadDoctors();
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSearch(value: string): void {
    this.searchSubject.next(value);
  }

  loadDoctors(search: string = '') {
    if (!this.shiftTypeId) {
      return;
    }
    
    this.isLoading = true;
    
    this.userService.getDoctorsByShiftType(this.shiftTypeId, search).subscribe({
      next: (res) => {
        if (res && res.length > 0) {
          this.doctors = res;
        } else {
          this.doctors = [];
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('获取医生列表失败:', err);
        this.doctors = [];
        this.isLoading = false;
      }
    });
  }

  onChange(value: string) {
    this.doctorSelected.emit(value);
  }

}
