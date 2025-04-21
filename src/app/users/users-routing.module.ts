import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UsersPage } from './users.page';
import { ProfileComponent } from './profile/profile.component';

const routes: Routes = [
  {
    path: '',
    component: UsersPage,
    title: 'Labour Management : Users',
  },
  {
    path: '',
    children: [
      {
        path: 'profile',
        component: ProfileComponent,
        title: 'Labour Management : User Profile',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsersPageRoutingModule {}
