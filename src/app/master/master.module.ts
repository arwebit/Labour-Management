import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MasterPageRoutingModule } from './master-routing.module';

import { MasterPage } from './master.page';
import { LayoutsModule } from '../layouts/layouts.module';
import { GroupAccessComponent } from './group-access/group-access.component';
import { WorkSiteComponent } from './work-site/work-site.component';
import { LabourRatesComponent } from './labour-rates/labour-rates.component';
import { NoteBookComponent } from './note-book/note-book.component';
import { NoteBookNotificationComponent } from './note-book/note-book-notification/note-book-notification.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    LayoutsModule,
    MasterPageRoutingModule,
  ],
  declarations: [
    MasterPage,
    GroupAccessComponent,
    WorkSiteComponent,
    LabourRatesComponent,
    NoteBookComponent,
    NoteBookNotificationComponent,
  ],
})
export class MasterPageModule {}
