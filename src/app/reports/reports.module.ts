import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PDFGenerator } from '@ionic-native/pdf-generator/ngx';
import { IonicModule } from '@ionic/angular';

import { ReportsPageRoutingModule } from './reports-routing.module';

import { ReportsPage } from './reports.page';
import { LayoutsModule } from '../layouts/layouts.module';
import { RouterModule } from '@angular/router';
import { LabourAttendanceReportComponent } from './labour-attendance-report/labour-attendance-report.component';
import { LabourDetailReportComponent } from './labour-detail-report/labour-detail-report.component';
import { LabourNormalWagesReportsComponent } from './labour-normal-wages-reports/labour-normal-wages-reports.component';
import { LabourSpecialWagesReportsComponent } from './labour-special-wages-reports/labour-special-wages-reports.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReportsPageRoutingModule,
    LayoutsModule,
    RouterModule,
  ],
  declarations: [
    ReportsPage,
    LabourAttendanceReportComponent,
    LabourDetailReportComponent,
    LabourNormalWagesReportsComponent,
    LabourSpecialWagesReportsComponent,
  ],
  providers: [PDFGenerator],
})
export class ReportsPageModule {}
