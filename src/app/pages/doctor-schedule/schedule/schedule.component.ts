// schedule.component.ts
import { Component, ElementRef, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { Observable, Subject, forkJoin } from 'rxjs';
import { DoctorSchedule, ScheduleQueryDTO, ScheduleSaveDTO, ScheduleView, ShiftSummary } from 'src/app/core/models/doctor-shedule';
import { ShiftType } from 'src/app/core/models/shift';
import { ScheduleService } from 'src/app/core/services/schedule.service';
import { utcToZonedTime, zonedTimeToUtc } from 'date-fns-tz'
import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours,
  getDaysInMonth,
  startOfWeek,
  format,
  startOfMonth,
  endOfWeek,
  isWithinInterval,
  subWeeks,
  subMonths,
  addWeeks,
  addMonths,
  eachDayOfInterval,
} from 'date-fns';
import {} from 'date-fns-tz';
import { ExamUser } from 'src/app/core/models/common-models';
import { UserService } from 'src/app/core/services/user.service';
import zhCN from 'date-fns/locale/zh-CN';
import { BatchScheduleModalComponent } from '../batch-schedule-modal/batch-schedule-modal.component';
import { NzCalendarMode } from 'ng-zorro-antd/calendar';
import { AddScheduleModalComponent } from '../add-schedule-modal/add-schedule-modal.component';
import { EditScheduleModalComponent } from '../edit-schedule-modal/edit-schedule-modal.component';
import { NzDropdownMenuComponent } from 'ng-zorro-antd/dropdown';
import { map } from 'rxjs/operators';
import { PageResult } from 'src/app/core/models/page-result';
import { DateUtils } from 'src/app/core/utils/date-utils';


@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss']
})
export class ScheduleComponent implements OnInit, OnDestroy  {
  timeZone: string = 'Asia/Shanghai'; // 设置时区，建议从配置中读取
  date = new Date();
  displayMode: 'week' | 'month' = 'week';
  currentDate = new Date();
  shiftTypes: ShiftType[] = [];
  schedules: ScheduleView[] = [];
  loading = false;
  // 添加缺失的属性
  selectedShiftType?: ShiftType;
  scheduleDays: Array<{ dateUtc:string, // 保存 UTC 时间，用于发送给后端
  dateLocal:Date,weekDay: string }> = [];
  private modalRef: NzModalRef | null = null; // 添加模态框引用
  private destroy$ = new Subject<void>();     // 用于清理订阅

  viewMode: 'calendar' | 'table' = 'calendar';
  selectedSchedules: string[] = [];
  tableData: any[] = [];
  tableColumns = [
    { title: '日期', key: 'scheduleDate' },
    { title: '医生', key: 'doctorName' },
    { title: '班次', key: 'shiftTypeName' },
    { title: '状态', key: 'status' },
    { title: '操作', key: 'action' }
  ];
  searchForm!: FormGroup;
  pageIndex = 1;
  pageSize = 10;
  total = 0;
  doctors: ExamUser[] = [];
  

  @ViewChild('scheduleGrid', { static: true }) scheduleGrid!: ElementRef;

  constructor(
    private scheduleService: ScheduleService,
    private fb: FormBuilder,
    private message: NzMessageService,
    private modal: NzModalService,
    private userService: UserService // 假设你有用户服务获取当前用户信息
  ) {
    this.searchForm = this.fb.group({
      doctorId: [null],
      doctorName: [null],
      shiftTypeId: [null],
      dateRange: [null],
      status: [null]
    });

  }

  ngOnInit() {
    this.loading = true;
    this.loadShiftTypes();
    this.updateScheduleDays();
    this.loadSchedules();
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    // 确保关闭任何可能存在的模态框
    if (this.modalRef) {
      this.modalRef.close();
      this.modalRef = null;
    }
  }

  /************表格视图模式下操作与属性 ****************/
  switchView(mode: 'calendar' | 'table') {
    this.viewMode = mode;
    if (mode === 'table') {
      this.loadTableData();
    }
  }
  search(): void {
    this.pageIndex = 1;
    this.loadTableData();
  }

  reset(): void {
    this.searchForm.reset();
    this.pageIndex = 1;
    this.loadTableData();
  }

  onPageIndexChange(index: number): void {
    this.pageIndex = index;
    this.loadTableData();
  }

  onPageSizeChange(size: number): void {
    this.pageSize = size;
    this.pageIndex = 1;
    this.loadTableData();
  }
  loadTableData() {
    const formValue = this.searchForm.value;
    const dateRange = formValue.dateRange;
    
    const params: ScheduleQueryDTO = {
      doctorId: formValue.doctorId,
      doctorName: formValue.doctorName,
      shiftTypeId: formValue.shiftTypeId,
      startDate: dateRange?.[0],
      endDate: dateRange?.[1],
      status: formValue.status,
      pageIndex: this.pageIndex,
      pageSize: this.pageSize
    };
    //console.log(params);
    this.loading = true;
    this.scheduleService.getSchedules(params).subscribe({
      next: (res) => {
        if (res.data.length > 0) {
          this.tableData = res.data.map((schedule: any) => ({
            key: schedule.scheduleId,
            scheduleDate: new Date(schedule.scheduleDate).toLocaleDateString(),
            doctorName: schedule.doctorName,
            shiftTypeName: this.shiftTypes.find(s => s.shiftTypeId === schedule.shiftTypeId)?.shiftTypeName,
            status: this.getStatusText(schedule.status),
            schedule: schedule
          }));
          this.total = (res.total);
        } else {
          this.message.info("未查询到排版信息");
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load schedules:', err);
        this.message.error('加载排班失败');
        this.loading = false;
      }
    });
  }
  batchDelete() {
    this.modal.confirm({
      nzTitle: '确认删除',
      nzContent: `是否确认删除选中的 ${this.selectedSchedules.length} 条排班记录？`,
      nzOnOk: () => {
        this.scheduleService.batchDeleteSchedules(this.selectedSchedules).subscribe({
          next: (res) => {
             this.message.success('批量删除成功');
              this.selectedSchedules = [];
              this.loadTableData();
          },
          error: (err) => {
            console.error('Failed to batch delete:', err);
            this.message.error('批量删除失败');
          }
        });
      }
    });
  }
  copyToNextWeek() {
    if (this.selectedSchedules.length === 0) {
      this.message.warning('请选择需要复制的排班');
      return;
    }

    const selectedData = this.schedules.filter(s => 
      this.selectedSchedules.includes(s.scheduleId!)
    );

    const nextWeekSchedules = selectedData.map(schedule => ({
      doctorId: schedule.doctorId,
      scheduleDate: addWeeks(new Date(schedule.scheduleDate), 1),
      shiftTypeId: schedule.shiftTypeId
    }));

    this.scheduleService.batchSaveSchedules(nextWeekSchedules).subscribe({
      next: (res) => {
        if (res) {
          this.message.success('复制到下周成功');
          this.loadSchedules();
        } else {
          this.message.error('复制失败');
        }
      },
      error: (err) => {
        console.error('Failed to copy schedules:', err);
        this.message.error('复制到下周失败');
      }
    });
  }
  getStatusText(status: string): string {
    switch (status) {
      case '0': return '未生效';
      case '1': return '已生效';
      case '2': return '已结束';
      default: return '未知';
    }
  }
  onAllCheckedChange(checked: boolean): void {
    if (checked) {
      // 全选：将所有记录的 key 添加到选中数组
      this.selectedSchedules = this.tableData.map(item => item.key);
    } else {
      // 取消全选：清空选中数组
      this.selectedSchedules = [];
    }
  }
  onItemCheckedChange(checked: boolean, scheduleId: string): void {
    if (checked) {
      // 选中：添加到选中数组
      this.selectedSchedules = [...this.selectedSchedules, scheduleId];
    } else {
      // 取消选中：从选中数组中移除
      this.selectedSchedules = this.selectedSchedules.filter(id => id !== scheduleId);
    }
  }
  isAllChecked(): boolean {
    return this.tableData.length > 0 && this.tableData.every(item => 
      this.selectedSchedules.includes(item.key)
    );
  }

  isIndeterminate(): boolean {
    return this.selectedSchedules.length > 0 && !this.isAllChecked();
  }
  showBatchScheduleFromCell(
    event: Event, 
    dateLocal: Date, 
    shift: ShiftType, 
    doctors: any[]
  ): void {
    // 阻止事件冒泡，避免触发 onCellClick
    event.stopPropagation();
    
    const today = new Date();
    const nextWeek = addDays(today, 7);
    
    // 提取医生ID列表
    const doctorIds = doctors.map(d => d.doctorId);
    
    forkJoin({
      doctors: this.scheduleService.getDoctors().pipe(map(data => data)),
      shiftTypes: this.scheduleService.getShiftTypes()
    }).pipe(
      map(data => ({
        doctors: Array.isArray(data.doctors) ? data.doctors : [],
        shiftTypes: Array.isArray(data.shiftTypes) ? data.shiftTypes : []
      }))
    ).subscribe({
      next: (data) => {
        const modalRef = this.modal.create({
          nzTitle: '批量排班',
          nzContent: BatchScheduleModalComponent,
          nzWidth: 800,
          nzComponentParams: {
            doctorOptions: data.doctors,
            shiftTypes: data.shiftTypes,
            // 预设参数
            presetData: {
              dateRange: [today, nextWeek],
              doctorIds: doctorIds,
              selectedShiftId: shift.shiftTypeId
            }
          },
          nzFooter: null,
          nzOnOk: () => {}
        });

        modalRef.afterClose.subscribe(result => {
          if (result?.action === 'updateSchedule') {
            this.loadSchedules();
          }
        });
      },
      error: (error) => {
        this.message.error('加载数据失败');
        console.error('Error loading data:', error);
      }
    });
  }
  loadShiftTypes() {
    this.scheduleService.getShiftTypes().subscribe({
      next: (res) => {
        if (res) {
          this.shiftTypes = res;
        } else {
          this.message.error("获取班种错误");
        }
      },
      error: (err) => {
        console.error('Failed to load shift types:', err);
        this.message.error('加载班种失败');
      }
    });
  }
  onDateSelect(date: Date): void {
    this.date = date;
    this.loadSchedules();
  }

  onModeChange(mode: 'week' | 'month') {
    this.displayMode = mode;
    this.updateScheduleDays();
    this.loadSchedules();
  }

 // 检查日期是否为今天
  isToday(date: Date): boolean {
    return isSameDay(date, new Date());
  }

  // 检查日期是否为选中日期
  isSelected(date: Date): boolean {
    return isSameDay(date, this.date);
  }
  
  loadSchedules() {
    this.loading = true;
    const startDate = this.displayMode === 'week'
            ? zonedTimeToUtc(startOfWeek(this.currentDate, { weekStartsOn: 1 }), this.timeZone)
            : zonedTimeToUtc(startOfMonth(this.currentDate), this.timeZone);
        const endDate = this.displayMode === 'week'
            ? zonedTimeToUtc(endOfWeek(this.currentDate, { weekStartsOn: 1 }), this.timeZone)
            : zonedTimeToUtc(endOfMonth(this.currentDate), this.timeZone);
        const params: ScheduleQueryDTO = {
            pageIndex:1,
            pageSize: 1000,
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString()
        };

    this.scheduleService.getSchedules(params).subscribe({
      next: (res) => {
        //console.log(res, "res");
        if (res) {
          this.schedules = ((res as any) as PageResult<ScheduleView[]>).data;
        } else {
          this.message.error("获取排班失败");
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load schedules:', err);
        this.message.error('加载排班失败');
        this.loading = false;
      }
    });
  }
  onCellClick(dateLocal: Date, shift: ShiftType) {
    console.log("cellclick", shift);
    const dateUtc = zonedTimeToUtc(dateLocal, this.timeZone); // 在点击事件中转换为 UTC
    this.selectedShiftType = shift;
    this.showAddScheduleModal(dateUtc);
  }
  refreshCalendarView(): void {
    this.loading = true;
    this.loadSchedules();
    this.message.success('刷新成功');
  }
  showAddScheduleModal(date: Date) {
    const modal = this.modal.create({
      nzTitle: '添加排班',
      nzContent: AddScheduleModalComponent,
      nzWidth: 600,
      nzComponentParams: {
        scheduleDate: date,
        shiftTypes: this.shiftTypes,
        selectedShiftType: this.selectedShiftType
      },
      nzOnOk: (componentInstance: AddScheduleModalComponent) => {
        if (componentInstance.scheduleForm.valid) {
          const formValue = componentInstance.getFormValue();
          const dateObj = new Date(formValue.scheduleDate);
          formValue.scheduleDate = DateUtils.formatLocalDate(dateObj)
          return new Promise((resolve, reject) => {
            this.scheduleService.saveSchedule(formValue).subscribe({
              next: (res) => {
                  this.message.success('添加排班成功');
                  this.loadSchedules();
                  resolve(true);
              },
              error: (err) => {
                console.error('Failed to add schedule:', err);
                this.message.error('添加排班失败');
                reject(false);
              }
            });
          });
        } else {
          Object.values(componentInstance.scheduleForm.controls).forEach(control => {
            if (control.invalid) {
              control.markAsTouched();
              control.updateValueAndValidity({ onlySelf: true });
            }
          });
          return false;
        }
      }
    });
  }
  deleteSchedule(scheduleId: string | undefined) {
    console.log(scheduleId);
    if (!scheduleId) return;
    
    this.modal.confirm({
      nzTitle: '确认删除',
      nzContent: '是否确认删除该排班？',
      nzOnOk: () => {
        this.scheduleService.deleteSchedule(scheduleId).subscribe({
          next: (res) => {
            if (res) {
              //this.message.success('删除成功');
              this.loadSchedules();
            } else {
              this.message.error(res.message);
            }
          },
          error: (err) => {
            console.error('Failed to delete schedule:', err);
            this.message.error('删除失败');
          }
        });
      }
    });
  }
  addSchedule(date: Date, doctorId: string, shiftTypeId: string) {
    this.modal.confirm({
      nzTitle: '确认添加排班',
      nzContent: '是否确认添加该排班？',
      nzOnOk: () => {
        const currentUser = this.userService.getUser;
        this.scheduleService.saveSchedule({
          doctorId,
          scheduleDate: date,
          shiftTypeId,
          //createUser: currentUser?.userId
        }).subscribe({
          next: (res) => {
            console.log(res);
            if (res.code == 200) {
              this.message.success('添加排班成功');
              this.loadSchedules();
            } else {
              this.message.error(res.message);
            }
          },
          error: (err) => {
            console.error('Failed to add schedule:', err);
            this.message.error('添加排班失败');
          }
        });
      }
    });
  }

  batchAddSchedules(schedules: Array<{
    doctorId: string;
    scheduleDate: Date;
    shiftTypeId: string;
  }>) {
    //const currentUser = this.userService.getCurrentUser();
    const scheduleRequests = schedules.map(schedule => ({
      ...schedule,
      //createUser: currentUser?.userId
    }));

    this.scheduleService.batchSaveSchedules(scheduleRequests).subscribe({
      next: (res) => {
        if (res.success) {
          this.message.success('批量添加排班成功');
          this.loadSchedules();
        } else {
          this.message.error(res.message);
        }
      },
      error: (err) => {
        console.error('Failed to batch add schedules:', err);
        this.message.error('批量添加排班失败');
      }
    });
  }

  updateStatus(scheduleId: string | undefined, status: string) {
    if (!scheduleId) return;
    
   // const currentUser = this.userService.getCurrentUser();
    this.scheduleService.updateScheduleStatus(scheduleId, status).subscribe({
      next: (res) => {
        if (res.success) {
          this.message.success('更新状态成功');
          this.loadSchedules();
        } else {
          this.message.error(res.message);
        }
      },
      error: (err) => {
        console.error('Failed to update status:', err);
        this.message.error('更新状态失败');
      }
    });
  }


  // 获取指定日期和班种的排班
  getSchedulesByShiftType(dateLocal: Date, shiftTypeId: string): ScheduleView[] {
    return this.schedules.filter(schedule =>
       {
          return       isSameDay(new Date(schedule.scheduleDate), dateLocal) &&
          schedule.shiftTypeId === shiftTypeId;
       }

    );
  }
    updateScheduleDays() {
      // 确保使用本地时间进行计算
      const startDateLocal = this.displayMode === 'week'
          ? startOfWeek(this.currentDate, { weekStartsOn: 1 })
          : startOfMonth(this.currentDate);
      
      const endDateLocal = this.displayMode === 'week'
          ? endOfWeek(this.currentDate, { weekStartsOn: 1 })
          : endOfMonth(this.currentDate);

      // 获取时间区间
      const daysLocal = eachDayOfInterval({
          start: startDateLocal,
          end: endDateLocal
      });

      // 转换每一天
      this.scheduleDays = daysLocal.map(dateLocal => {
          // 使用 date-fns-tz 的 zonedTimeToUtc 进行时区转换
          const zonedDate = zonedTimeToUtc(dateLocal, 'Asia/Shanghai');

          return {
              dateUtc: zonedDate.toISOString(),
              dateLocal: new Date(dateLocal),
              weekDay: format(dateLocal, 'EEE', { 
                  locale: zhCN
              })
          };
      });
  }
  // 检查是否可以添加排班
  canAddSchedule(date: Date, doctorId: string): boolean {
    return !this.schedules.some(schedule => 
      isSameDay(new Date(schedule.scheduleDate), date) &&
      schedule.doctorId === doctorId &&
      schedule.status !== '2' // 不是已结束状态
    );
  }
  previousPeriod() {
    this.currentDate = this.displayMode === 'week'
      ? subWeeks(this.currentDate, 1)
      : subMonths(this.currentDate, 1);
    this.updateScheduleDays();
    this.loadSchedules();
  }

  nextPeriod() {
    this.currentDate = this.displayMode === 'week'
      ? addWeeks(this.currentDate, 1)
      : addMonths(this.currentDate, 1);
    this.updateScheduleDays();
    this.loadSchedules();
  }

  onDateChange(date: Date) {
    this.currentDate = date;
    this.updateScheduleDays();
    this.loadSchedules();
  }

  onDisplayModeChange(mode: 'week' | 'month') {
    this.displayMode = mode;
    this.updateScheduleDays();
    this.loadSchedules();
  }
  showBatchScheduleModal() {

    forkJoin({
      doctors: this.scheduleService.getDoctors().pipe(map(data => data)),
      shiftTypes: this.scheduleService.getShiftTypes()
    }).pipe(
      map(data => ({
        doctors: Array.isArray(data.doctors) ? data.doctors : [],
        shiftTypes: Array.isArray(data.shiftTypes) ? data.shiftTypes : []
      }))
    ).subscribe({
      next: (data) => {
        const modalRef = this.modal.create({
          nzTitle: '批量排班',
          nzContent: BatchScheduleModalComponent,
          nzWidth: 800,
          nzComponentParams: {
            doctorOptions: data.doctors,
            shiftTypes: data.shiftTypes
          },
          nzFooter: null,
          nzOnOk: () => {}
        });

        modalRef.afterClose.subscribe(result => {
          if (result?.action === 'updateSchedule') {
            this.loadSchedules();
          }
        });
      },
      error: (error) => {
        this.message.error('加载数据失败');
        console.error('Error loading data:', error);
      }
    });
  
  }
  getShiftSummary(date: Date, shiftTypeId: string): ShiftSummary | null {
    //console.log(date);
    const schedules = this.getSchedulesByShiftType(date, shiftTypeId);
    
    if (schedules.length === 0) {
      return null;
    }
  
    const shift = this.shiftTypes.find(s => s.shiftTypeId === shiftTypeId);
    if (!shift) return null;
  
    // 计算工作时长
    const startTime = new Date(`2000-01-01 ${shift.startTime}`);
    const endTime = new Date(`2000-01-01 ${shift.endTime}`);
    const workHours = shift.workHours;
  
    return {
      shiftTypeId: shift.shiftTypeId,
      shiftTypeName: shift.shiftTypeName,
      startTime: shift.startTime,
      endTime: shift.endTime,
      workHours: workHours,
      doctorCount: schedules.length,
      doctors: schedules.map(schedule => ({
        doctorId: schedule.doctorId,
        doctorName: schedule.doctorName,
        status: schedule.status,
        scheduleId: schedule.scheduleId!,
        shiftTypeId: shift.shiftTypeId,
        scheduleDate: schedule.scheduleDate,
        weight: schedule.weight
      }))
    };
  }
  
  getStatusColor(status: string): string {
    //console.log(status);
    switch (status) {
      case '0':
        return 'gold';    // 待确认
      case '1':
        return 'green';   // 已确认
      case '2':
        return 'default'; // 已完成
      default:
        return 'default';
    }
  }
  trackById(item: any) {
    return item.scheduleId;
  }
  // schedule.component.ts
  showEditScheduleModal(doctor: any): void {
    //console.log('Opening modal for doctor:', doctor);
    if (this.modalRef) {
      this.modalRef.close();
      this.modalRef = null;
    }
    // 确保 doctors 和 shiftTypes 是数组
    forkJoin({
      doctors: this.scheduleService.getDoctors().pipe(map(data => data)),
      shiftTypes: this.scheduleService.getShiftTypes()
    }).pipe(
      map(data => ({
        doctors: Array.isArray(data.doctors) ? data.doctors : [],
        shiftTypes: Array.isArray(data.shiftTypes) ? data.shiftTypes : []
      }))
    ).subscribe({
      next: (data) => {
        console.log("data", data);
        const modalRef = this.modal.create({
          nzTitle: '编辑排班信息',
          nzContent: EditScheduleModalComponent,
          nzWidth: 600,
          nzComponentParams: {
            doctor: {
              ...doctor,
              scheduleDate: doctor.scheduleDate ? new Date(doctor.scheduleDate) : null
            },
            doctors: data.doctors,
            shiftTypes: data.shiftTypes
          },
          nzFooter: null,
          nzOnOk: () => {}
        });

        modalRef.afterClose.subscribe(result => {
          if (result?.action === 'updateSchedule') {
            this.loadSchedules();
          }
        });
      },
      error: (error) => {
        this.message.error('加载数据失败');
        console.error('Error loading data:', error);
      }
    });
  }
    /**
   * 刷新表格视图
   */
  refreshTableView(): void {
    this.loading = true;
    this.loadTableData();
    this.message.success('刷新成功');
  }

}



