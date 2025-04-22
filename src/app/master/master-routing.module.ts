import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GroupAccessComponent } from './group-access/group-access.component';
import { WorkSiteComponent } from './work-site/work-site.component';
import { LabourRatesComponent } from './labour-rates/labour-rates.component';
import { NoteBookComponent } from './note-book/note-book.component';
import { NoteBookNotificationComponent } from './note-book/note-book-notification/note-book-notification.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'group-access',
        component: GroupAccessComponent,
        title: 'Labour Management System :: Group Access',
      },
      {
        path: 'work-site',
        component: WorkSiteComponent,
        title: 'Labour Management System :: Work Site',
      },
      {
        path: 'labour-rates',
        component: LabourRatesComponent,
        title: 'Labour Management System :: Labour Rates',
      },
      {
        path: 'note-book',
        component: NoteBookComponent,
        title: 'Labour Management System :: Note Book',
      },
      {
        path: 'note-book/noti',
        component: NoteBookNotificationComponent,
        title: 'Labour Management System :: Note Book Notification',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MasterPageRoutingModule {}
