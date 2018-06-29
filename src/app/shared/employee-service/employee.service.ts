import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import 'rxjs/add/operator/map';
import {Observable} from 'rxjs/Observable';


interface Response {
  status: number;
  message: string;
  data: Array<any>;
}

@Injectable()
export class EmployeeService {

  constructor(private _http: HttpClient) {
  }

  getEmployees(): Observable<any[]> {
    return this._http.get<Response>('/employees').map(result => result.data);
  }

  addEmployee() {
    const newEmployee = {'employeeId' : '3','employeeName': 'Mary'};
    return this._http.post('/employee', newEmployee).subscribe(res => {console.log('result: ', res); });
  }

  updateEmployee() {
    const updateEmployee = {
      'employeeName': 'YuryUpdated'
    };
    return this._http.put('/employee', updateEmployee).subscribe(res => {console.log('result: ', res); });
  }
  deleteEmployee(employeeId) {
    return this._http.delete('/employee', {params: {'employeeId': employeeId}}).subscribe(res => {console.log('result: ', res); });
  }

}
