import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MachinesPageRoutingModule } from './machines-routing.module';

import { MachinesPage } from './machines.page';
import { LayoutsModule } from '../layouts/layouts.module';
import { SearchWorkSitePipe } from './pipes/search-work-site.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MachinesPageRoutingModule,
    ReactiveFormsModule,
    LayoutsModule,
  ],
  declarations: [MachinesPage, SearchWorkSitePipe],
})
export class MachinesPageModule {}
