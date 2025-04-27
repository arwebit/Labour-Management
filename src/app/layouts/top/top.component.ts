import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { UserService } from 'src/app/shared/services/users/user.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-top',
  templateUrl: './top.component.html',
  styleUrls: ['./top.component.scss'],
  standalone: false,
})
export class TopComponent {
  accessID: number = 0;
  userModuleAccess: number[] = [];
  userID: any = localStorage.getItem('user_id');
  profileImg: string = '';
  loginUserName: string = '';
  imageURL: string = '';
  userRole: any = '';
  headerText: string = '';

  constructor(
    private router: Router,
    private userSrv: UserService,
    private location: Location
  ) {
    this.accessID = environment.module_access.note_book_notification;
    this.ionViewWillEnter();
  }

  ionViewWillEnter() {
    this.getUserDetails();
    this.imageURL = environment.imageURL;
    const path = this.location.path();

    if (path === '/dashboard') {
      this.headerText = 'HOME';
    } else if (path === '/users/profile') {
      this.headerText = 'MY PROFILE';
    } else if (path === '/users') {
      this.headerText = 'USERS';
    } else if (path === '/master/group-access') {
      this.headerText = 'GROUP ACCESS';
    } else if (path === '/master/work-site') {
      this.headerText = 'WORK SITE';
    } else if (path === '/master/labour-rates') {
      this.headerText = 'LABOUR RATES';
    } else if (path === '/master/note-book') {
      this.headerText = 'NOTE BOOK';
    } else if (path === '/master/note-book/noti') {
      this.headerText = 'NOTE BOOK NOTI';
    } else if (path === '/labour/labour-wages') {
      this.headerText = 'LABOUR WAGES';
    } else if (path === '/labour/labour-attendance') {
      this.headerText = 'LABOUR ATTENDANCE';
    } else if (path === '/reports') {
      this.headerText = 'REPORTS';
    } else if (path.startsWith('/reports/labour-report')) {
      this.headerText = 'LABOUR REPORTS';
    } else if (path.startsWith('/reports/attendance-report')) {
      this.headerText = 'ATTENDANCE REPORTS';
    } else if (path.startsWith('/reports/labour-normal-wages-report')) {
      this.headerText = 'WAGE REPORTS';
    } else if (path.startsWith('/reports/labour-special-wages-report')) {
      this.headerText = 'ADVANCE REPORTS';
    }
  }

  async getUserDetails() {
    this.userModuleAccess = [];
    const data = await this.userSrv.getUserDetails(this.userID);
    const [details] = data.rows;
    this.loginUserName = details.full_name;
    this.profileImg = details.profile_pic;
    this.userRole = details.user_role.role_id;
    this.userModuleAccess = details.user_role.module_access.map(
      (access: any) => access.module_access_id
    );
  }

  hasAccess(id: number, userRole: number): boolean {
    let bool: boolean = false;
    if (userRole == -1) {
      bool = true;
    } else {
      bool = this.userModuleAccess.includes(id);
    }
    return bool;
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['']);
  }
}
