import { Routes } from '@angular/router';

import { TrackingComponent } from './tracking/tracking.component';
import { ProjectsComponent } from './projects/projects.component';

export const routes: Routes = [
  {path: 'trackingPage', component: TrackingComponent},
  {path: 'projectPage', component: ProjectsComponent},
  //{path: 'dishdetail/:id', component: DishdetailComponent},
  {path: '', redirectTo: '/trackingPage', pathMatch: 'full'}
];
