import { Component, OnInit } from '@angular/core';
import {ProjectService} from '../shared/project-service/project.service';
import {ReportService} from '../shared/report-service/report.service';
import {EmployeeService} from '../shared/employee-service/employee.service';
import {NotificationService} from '../shared/notification-service/notification.service';

@Component({
  selector: 'app-tracking',
  templateUrl: './tracking.component.html',
  styleUrls: ['./tracking.component.scss']
})
export class TrackingComponent implements OnInit {

  projects: Array<any>;
  reports: Array<any>;
  employees: Array<any>;
  week: Array<any>;
  startDate: any;
  endDate: any;
  curUser: string;
  curProjId: string;
  weekObj: any;
  weekedReports: any[];
  weekedReportsObj: any;
  weekTaskTimeArr: any;
  dayTimeArr: any;
  totalsPerWeek: any;
  monthsObj: any;


  ngOnInit() {
    this.curProjId = sessionStorage.getItem('currentProjectId');
    this.curUser = sessionStorage.getItem('currentUser');
  }

  constructor(private _projectService: ProjectService, private _reportService: ReportService,
              private _employeeService: EmployeeService, private _notificationService: NotificationService) {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        this._notificationService.askPermission().then(() => {
          return this._notificationService.subscribeUserToPush().then((subscription) => {
            return this._notificationService.sendSubscription(subscription);
          });
        });
      });
    }
    this._projectService.getProjects().subscribe(response => this.projects = response);

    this._projectService.getProjects().subscribe(responseProject => {
      this.projects = responseProject;
      this.curProjId = sessionStorage.getItem('currentProjectId') || this.projects[0].projectId;
      this._employeeService.getEmployees().subscribe(responseEmployee => {
        this.employees = responseEmployee;
        this.curUser = sessionStorage.getItem('currentUser') || this.employees[0].employeeName;
        this.updateTasks();
      });
    });

    this.week = [
      {weekDay: 'M', day: 15, month: 'Feb'},
      {weekDay: 'T', day: 16, month: 'Feb'},
      {weekDay: 'W', day: 17, month: 'Feb'},
      {weekDay: 'Th', day: 18, month: 'Feb'},
      {weekDay: 'F', day: 19, month: 'Feb'},
      {weekDay: 'S', day: 20, month: 'Feb'},
      {weekDay: 'Su', day: 21, month: 'Feb'}
    ];
    this.startDate = new Date('01/01/2018');
    this.endDate = new Date('10/03/2018');

    this.weekObj = {};

    this.monthsObj = {
      0: 'Jan',
      1: 'Feb',
      2: 'Mar',
      3: 'Apr',
      4: 'May',
      5: 'Jun',
      6: 'Jul',
      7: 'Aug',
      8: 'Sep',
      9: 'Oct',
      10: 'Nov',
      11: 'Dec'
    };

    this.weekedReports = [];
    this.weekedReportsObj = {};
    this.weekTaskTimeArr = [];
    this.setDate(this.weekObj);
  }

  updateTasks() {
    this._reportService.getReports().subscribe(responseReport => {
      this.reports = responseReport;
      this.handleReports();
      this.displayReports();
    });
  }

  setDate(weekObj) {
    Object.keys(weekObj).forEach((dateString, index) => {
      const date = new Date(dateString);
      this.week[index].month = this.monthsObj[date.getMonth()];
      this.week[index].day = date.getDate();
    });
  }

  setCurrentUser(user: string) {
    this.curUser = user;
    sessionStorage.setItem('currentUser', this.curUser);
    this.weekedReports = [];
    this.updateTasks();
  }

  setCurrentProject(project: string) {
    this.curProjId = this.projects.find(proj => proj.projectId === project).projectId;
    sessionStorage.setItem('currentProjectId', this.curProjId);
    this.weekedReports = [];
    this.updateTasks();
  }

  handleReports() {
    const reportsFiltered = this.reports.filter((report) => {
      if (this.curUser === report.employeeName && this.curProjId === report.projectId &&
        +new Date(report.date) >= +new Date(this.startDate) && +new Date(report.date) <= +new Date(this.endDate)) {
        return report;
      }
    });
    this.weekedReportsObj = this.groupReports(reportsFiltered);
    console.log('weekedReportsObj: ', this.weekedReportsObj);
  }

  displayReports() {
    this.weekedReports = [];
    for (const prop in this.weekedReportsObj) {
      if (this.weekedReportsObj.hasOwnProperty(prop)) {
        this.weekedReports.push({
          name: prop,
          dayReport: Object.values(this.weekedReportsObj[prop])
        });
      }
    }
    this.sumForDay();
    this.sumForWeek();

    console.log('this.weekedReports: ', this.weekedReports);
  }

  groupReports(reports) {
    const reportObj = {};
    const reportTaskObj = {};
    let curWeekObj = {};

    reports.map(report => {
      if (!reportTaskObj.hasOwnProperty(report.task)) {
        const weekObj = {};
        Object.assign(weekObj, this.weekObj);
        reportTaskObj[report.task] = weekObj;
      }
    });

    reports.map(report => {
      curWeekObj = reportTaskObj[report.task];
      curWeekObj[report.date] = {hour: report.hour, reportId: report.reportId};
      reportObj[report.task] = curWeekObj;
    });

    return reportObj;
  }

  onTimeChange(target: any, reportName: string) {
    const index = target.attributes['data-index'].value;
    reportName = reportName || this.getTaskName();
    const date = this.weekedReportsObj[reportName] ? Object.keys(this.weekedReportsObj[reportName])[index] :
      Object.keys(this.weekObj)[index];
    const reportId = this.weekedReportsObj[reportName] ? this.weekedReportsObj[reportName][date].reportId : '';

    if (Number(target.value) === 0 && reportId) {
      this._reportService.deleteReportById(reportId);
    }

    if (reportId === '') {
      this._reportService.addReport(this.curUser, reportName, this.curProjId,
        date, target.value).subscribe((obj) => {
        console.log('url ', obj.url);
        const reportId = /reportId=(.*)$/g.exec(obj.url)[1];
        this.reports.push({
          date: date,
          employeeName: this.curUser,
          projectId: this.curProjId,
          task: reportName,
          reportId: reportId,
          hour: target.value
        });
        this.handleReports();
        this.displayReports();
      })
    } else {
      this._reportService.updateReport(reportId, date,
        this.curUser, reportName, target.value, this.curProjId).subscribe((obj) => {
        const index = this.reports.findIndex((report, index) => {
          return report.reportId === reportId && report.task === reportName && report.employeeName === this.curUser &&
            report.projectId === this.curProjId && report.date === date;
        });
        this.reports[index].hour = target.value;
        this.handleReports();
        this.displayReports();
      });
    }
  }

  sumForDay() {
    this.dayTimeArr = [0, 0, 0, 0, 0, 0, 0];
    for (let j = 0; j < this.week.length; j++) {
      for (let i = 0; i < this.weekedReports.length; i++) {
        this.dayTimeArr[j] += Number(this.weekedReports[i].dayReport[j].hour);
      }
    }
  }

  sumForWeek() {
    this.weekTaskTimeArr = [];
    for (let i = 0; i < this.weekedReports.length; i++) {
      this.weekTaskTimeArr[i] = 0;
    }

    for (let i = 0; i < this.weekedReports.length; i++) {
      for (let j = 0; j < this.week.length; j++) {
        this.weekTaskTimeArr[i] += Number(this.weekedReports[i].dayReport[j].hour);
      }
    }

    this.totalsPerWeek = 0;
    for (let i = 0; i < this.weekTaskTimeArr.length; i++) {
      this.totalsPerWeek += Number(this.weekTaskTimeArr[i]);
      this.weekedReports[i].total = this.weekTaskTimeArr[i];
    }
  }

  deleteTask(event: any) {
    const reportIdRemoveArr = [];
    const taskName = this.getTaskName();

    if (taskName) {
      Object.values(this.weekedReportsObj[taskName]).forEach((report) => {
        if (report.reportId) {
          reportIdRemoveArr.push(report.reportId);
        }
      });

      this._reportService.deleteReportsByIds(reportIdRemoveArr).subscribe(responseReport => {
        this.updateTasks();
      });
    } else {
      this.updateTasks();
    }
  }

  getTaskName() {
    const parent = this.getClosest(event.srcElement, 'report-row');

    for (let i = 0; i < parent.childNodes.length; i++) {
      if (parent.childNodes[i].className === 'taskName') {
        return parent.childNodes[i].value;
      }
    }

    return '';
  }

  getClosest(elem, selector) {
    for ( ; elem && elem !== document; elem = elem.parentNode ) {
      if ( elem.classList.contains( selector ) ) { return elem; }
    }
    return null;
  }

  newTask() {
    this._notificationService.sendPushMessage();
    /*.subscribe((result) => {
     console.log('subscriptions: ', result);
     });*/

    const dayReportArr = [];
    for (let i = 0; i < 7; i++) {
      dayReportArr.push({hour: 0, reportId: ''});
    }
    const emptyTaskObj = {
      name: '',
      dayReport: dayReportArr,
      total: 0
    };
    this.weekedReports.push(emptyTaskObj);
  }

  onNameChange(event: any, reportOldName: string) {
    const reportUpdateArr = [];
    const promiseArr = [];

    if (this.weekedReportsObj[reportOldName]) {
      const hourArr = Object.keys(this.weekedReportsObj[reportOldName]);

      Object.values(this.weekedReportsObj[reportOldName]).forEach((report) => {
        if (report.reportId) {
          reportUpdateArr.push(report);
        }
      });

      for (let i = 0; i < reportUpdateArr.length; i++) {
        promiseArr.push(new Promise((resolve, reject) => {
          resolve(this._reportService.updateReport(reportUpdateArr[i].reportId, hourArr[i],
            this.curUser, event.srcElement.value, reportUpdateArr[i].hour, this.curProjId));
        }));
      }

      return Promise.all(promiseArr).then(values => {
        console.log(values);
        this.updateTasks();
      });
    }
  }

  onDatePeriodChanged(periodObj: any) {
    console.log('dateChanged: ', periodObj);
    const weekArr = this.getDateArray(periodObj);
    this.formWeekObj(weekArr);
    this.setDate(this.weekObj);
    this.startDate = periodObj.start_date;
    this.endDate = periodObj.end_date;
    this.updateTasks();
  }

  formWeekObj(weekArr) {
    this.weekObj = {};
    let formattedDate = '';

    for (let i = 0; i < weekArr.length; i++) {
      formattedDate = weekArr[i].getFullYear() + '-' + this.getFormattedDate(weekArr[i].getMonth() + 1) +
        '-' + this.getFormattedDate(weekArr[i].getDate());
      this.weekObj[formattedDate] = {hour: 0, reportId: ''};
    }
  }

  getFormattedDate(date: number) {
    return date < 10 ? '0' + date : date;
  }

  getDateArray(periodObj: any) {

    let arr = [];
    let start = new Date(periodObj.start_date);
    let end = new Date(periodObj.end_date);

    while (start <= end) {
      let day = new Date(start);
      arr.push(day);
      start.setDate(start.getDate() + 1);
    }

    return arr;

  }

}
