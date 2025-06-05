import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LabourPageRoutingModule } from './labour-routing.module';

import { LabourPage } from './labour.page';
import { LayoutsModule } from '../layouts/layouts.module';
import { LabourWagesComponent } from './labour-wages/labour-wages.component';
import { NormalWagesComponent } from './labour-wages/normal-wages/normal-wages.component';
import { SpecialWagesComponent } from './labour-wages/special-wages/special-wages.component';
import { LabourAttendancesComponent } from './labour-attendances/labour-attendances.component';
import { ShowAttendanceComponent } from './labour-wages/show-attendance/show-attendance.component';

import { ManageAttendanceComponent } from './labour-attendances/manage-attendance/manage-attendance.component';
import { ViewManageAttendanceComponent } from './labour-attendances/manage-attendance/view-manage-attendance/view-manage-attendance.component';
import { SaveAttendanceComponent } from './labour-attendances/manage-attendance/save-attendance/save-attendance.component';
import { UpdateAttendanceComponent } from './labour-attendances/manage-attendance/update-attendance/update-attendance.component';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LabourPageRoutingModule,
    ReactiveFormsModule,
    LayoutsModule,
  ],
  declarations: [
    LabourPage,
    LabourWagesComponent,
    NormalWagesComponent,
    SpecialWagesComponent,
    LabourAttendancesComponent,
    ShowAttendanceComponent,
    ManageAttendanceComponent,
    ViewManageAttendanceComponent,
    SaveAttendanceComponent,
    UpdateAttendanceComponent,
  ],
})
export class LabourPageModule {}
