import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NzContextMenuService, NzDropdownMenuComponent } from 'ng-zorro-antd/dropdown';

@Component({
  selector: 'app-doctor-schedule-item',
  changeDetection: ChangeDetectionStrategy.OnPush,  
  templateUrl: './doctor-schedule-item.component.html',
  styleUrls: ['./doctor-schedule-item.component.scss']
})
export class DoctorScheduleItemComponent implements OnInit {
  ngOnInit(): void {
    //throw new Error('Method not implemented.');
  }

  @Input() doctor: any;
  @Output() delete = new EventEmitter<void>();
  @Output() edit = new EventEmitter<void>();
  constructor(private nzContextMenuService: NzContextMenuService) {}
  showMenu(event: MouseEvent, menu: NzDropdownMenuComponent): void {
    event.preventDefault();
    this.nzContextMenuService.create(event, menu);
  }

  getStatusColor(status: string): string {
    switch (status) {
      case '0': return 'orange';
      case '1': return 'green';
      case '2': return 'gray';
      default: return 'blue';
    }
  }

  onDelete(event: Event) {
    event.stopPropagation();
    this.delete.emit();
  }

  onEdit(event: Event) {
    event.stopPropagation();
    this.edit.emit();
  }

}
