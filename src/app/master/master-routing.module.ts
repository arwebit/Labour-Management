import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GroupAccessComponent } from './group-access/group-access.component';
import { WorkSiteComponent } from './work-site/work-site.component';
import { LabourRatesComponent } from './labour-rates/labour-rates.component';

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
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MasterPageRoutingModule {}
