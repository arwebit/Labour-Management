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
    } else if (path === '/users/add') {
      this.headerText = 'ADD USER';
    } else if (path.startsWith('/users/edit')) {
      this.headerText = 'EDIT USER';
    } else if (path.startsWith('/settings/users/group-access')) {
      this.headerText = 'GROUP ACCESS';
    } else if (/^\/tickets\/\d+\/replies$/.test(path)) {
      this.headerText = 'TICKET DETAILS';
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
