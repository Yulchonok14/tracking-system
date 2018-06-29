import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { MyDatePickerModule } from 'mydatepicker';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { ReportService } from './shared/report-service/report.service';
import { ProjectService } from './shared/project-service/project.service';
import { EmployeeService } from './shared/employee-service/employee.service';
import { NotificationService } from './shared/notification-service/notification.service';
import { DatePickerComponent } from './datePicker/datePicker.component';
import { TrackingComponent } from './tracking/tracking.component';
import { ProjectsComponent } from './projects/projects.component';
import { HeaderComponent } from './header/header.component';



@NgModule({
  declarations: [
    AppComponent,
    DatePickerComponent,
    TrackingComponent,
    ProjectsComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    MyDatePickerModule
  ],
  providers: [ReportService, ProjectService, EmployeeService, NotificationService],
  bootstrap: [AppComponent]
})
export class AppModule { }
