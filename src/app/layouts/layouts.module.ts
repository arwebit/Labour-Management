import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TopComponent } from './top/top.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [TopComponent, SidebarComponent],
  imports: [CommonModule, RouterModule],
  exports: [TopComponent, SidebarComponent],
})
export class LayoutsModule {}
