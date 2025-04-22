import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MasterPage } from './master.page';
import { GroupAccessComponent } from './group-access/group-access.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'group-access',
        component: GroupAccessComponent,
        title: 'Labour Management System :: Group Access',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MasterPageRoutingModule {}
