import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MasterPageRoutingModule } from './master-routing.module';

import { MasterPage } from './master.page';
import { LayoutsModule } from '../layouts/layouts.module';
import { GroupAccessComponent } from './group-access/group-access.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    LayoutsModule,
    MasterPageRoutingModule,
  ],
  declarations: [MasterPage, GroupAccessComponent],
})
export class MasterPageModule {}
