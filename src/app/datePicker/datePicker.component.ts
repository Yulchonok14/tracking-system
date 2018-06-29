import {Component, Output, EventEmitter} from '@angular/core';
import * as moment from 'moment';
import {IMyDpOptions} from 'mydatepicker';

@Component({
  selector: 'app-date-picker',
  templateUrl: './datePicker.component.html',
  styleUrls: ['./datePicker.component.scss']
})
export class DatePickerComponent {

  @Output() datePeriodChanged = new EventEmitter<boolean>();
  curPeriod;
  curDate: any;
  myDatePickerOptions: IMyDpOptions = {
    showClearDateBtn: false,
    showInputField: false
  };

  constructor() {}

  ngOnInit(){
    this.onDateChanged({jsdate: moment()});
  }

  shiftWeek(direction: string) {
    const date = direction === 'right' ? moment(this.curDate).add(7, 'days') :
      moment(this.curDate).subtract(7, 'days');

    return this.onDateChanged({jsdate: date});
  }

  onDateChanged(event: any) {
    this.curDate = moment(event.jsdate);
    const day = this.curDate.day();
    let startDate, endDate;

    if (day !== 1 && day !== 0) {
      startDate = moment(this.curDate).subtract(day - 1, 'days').format('L');
      endDate = moment(this.curDate).add(7 - day, 'days').format('L');
    } else if (day === 1) {
      startDate = this.curDate.format('L');
      endDate = moment(this.curDate).add(5 + day, 'days').format('L');
    } else if (day === 0) {
      startDate = moment(this.curDate).subtract(6, 'days').format('L');
      endDate = this.curDate.format('L');
    }

    this.curPeriod = startDate + ' - ' + endDate;
    const dateObj: any = {
      start_date: startDate,
      end_date: endDate
    };

    this.datePeriodChanged.emit(dateObj);
  }
}
