import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReportsPage } from './reports.page';
import { LabourAttendanceReportComponent } from './labour-attendance-report/labour-attendance-report.component';
import { LabourDetailReportComponent } from './labour-detail-report/labour-detail-report.component';
import { LabourNormalWagesReportsComponent } from './labour-normal-wages-reports/labour-normal-wages-reports.component';
import { LabourSpecialWagesReportsComponent } from './labour-special-wages-reports/labour-special-wages-reports.component';

const routes: Routes = [
  {
    path: '',
    component: ReportsPage,
    title: 'Labour Management System :: Reports',
  },
  {
    path: '',
    children: [
      {
        path: 'attendance-report',
        component: LabourAttendanceReportComponent,
        title: 'Labour Management System :: Atendance Report',
      },
      {
        path: 'labour-report',
        component: LabourDetailReportComponent,
        title: 'Labour Management System :: Labour Details Report',
      },
      {
        path: 'labour-normal-wages-report',
        component: LabourNormalWagesReportsComponent,
        title: 'Labour Management System :: Labour Normal Wages Report',
      },
      {
        path: 'labour-special-wages-report',
        component: LabourSpecialWagesReportsComponent,
        title: 'Labour Management System :: Labour Normal Wages Report',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportsPageRoutingModule {}
