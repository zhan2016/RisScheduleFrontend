// schedule.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';
import { ScheduleView } from '../models/doctor-shedule';

@Pipe({
  name: 'filterSchedule'
})
export class ScheduleFilterPipe implements PipeTransform {
    transform(schedules: ScheduleView[] | null | undefined, date: Date, doctorId: string): ScheduleView[] {
        if (!schedules || !Array.isArray(schedules)) return [];
        if (!date || !doctorId) return [];
        
        return schedules.filter(schedule => {
          if (!schedule) return false;
          
          const scheduleDate = new Date(schedule.scheduleDate);
          return schedule.doctorId === doctorId && 
                 scheduleDate.toDateString() === date.toDateString();
        });
      }
}