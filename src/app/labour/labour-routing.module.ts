import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LabourPage } from './labour.page';
import { LabourWagesComponent } from './labour-wages/labour-wages.component';
import { LabourAttendancesComponent } from './labour-attendances/labour-attendances.component';
import { ShowAttendancesComponent } from './labour-attendances/show-attendances/show-attendances.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'labour-attendance',
        component: LabourAttendancesComponent,
        title: 'Labour Management System :: Labour Attendances',
      },
      {
        path: 'labour-attendance/show-attendances',
        component: ShowAttendancesComponent,
        title: 'Labour Management System :: Labour Attendances',
      },
      {
        path: 'labour-wages',
        component: LabourWagesComponent,
        title: 'Labour Management System :: Labour Wages',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LabourPageRoutingModule {}
