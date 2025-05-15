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
import { ShowAttendancesComponent } from './labour-attendances/show-attendances/show-attendances.component';
import { AddAttendancesComponent } from './labour-attendances/show-attendances/add-attendances/add-attendances.component';
import { ViewAttendancesComponent } from './labour-attendances/show-attendances/view-attendances/view-attendances.component';

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
    ShowAttendancesComponent,
    AddAttendancesComponent,
    ViewAttendancesComponent,
  ],
})
export class LabourPageModule {}
