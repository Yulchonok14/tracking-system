import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import 'rxjs/add/operator/map';
import {Observable} from 'rxjs/Observable';


interface Response {
  status: number;
  message: string;
  data: Array<any>;
}

@Injectable()
export class ReportService {

  constructor(private _http: HttpClient) {
  }

  getReports(): Observable<any[]> {
    return this._http.get<Response>('/reports').map(result => result.data);
  }

  generateId() {
    return '_' + Math.random().toString(36).substr(2, 9);
  }

  addReport(employeeName: string, task: string, projectId: string, date: string, hour: string): Observable<any> {
    const reportId = this.generateId();
    const newReport = {
      'reportId' : reportId,
      'employeeName': employeeName,
      'projectId': projectId,
      'task': task,
      'hour': hour || '',
      'date': date || ''
    };

    return this._http.post('/report', newReport, {params: new HttpParams().set('reportId', reportId), observe: "response"});//.subscribe(res => {console.log('result: ', res); });
  }

  updateReport(reportId: string, date: string, employeeName: string, task: string, hour: string, projectId: string) {
    const updatedReport = {
        'reportId' : reportId,
        'employeeName': employeeName,
        'projectId': projectId,
        'task': task,
        'hour': hour,
        'date': date
    };
    console.log('updatedReport: ', updatedReport);
    return this._http.put('/report', updatedReport, {params: new HttpParams().set('reportId', reportId), observe: "response"});/*.subscribe(res => {
      console.log('result: ', res);
    });*/
  }

  deleteReportById(reportId) {
    return this._http.delete('/report', {params: {'reportId': reportId}}).subscribe(res => {
      console.log('result: ', res);
    });
  }

  deleteReportsByIds(IdsArr): Observable<any> {
    return this._http.delete('/report', {params: IdsArr});
  }

}
