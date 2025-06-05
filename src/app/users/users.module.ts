import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UsersPageRoutingModule } from './users-routing.module';

import { UsersPage } from './users.page';
import { LayoutsModule } from '../layouts/layouts.module';
import { ProfileComponent } from './profile/profile.component';
import { SearchUserPipe } from './pipes/search-user.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    LayoutsModule,
    IonicModule,
    UsersPageRoutingModule,
  ],
  declarations: [UsersPage, ProfileComponent, SearchUserPipe],
})
export class UsersPageModule {}
