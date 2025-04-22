import { Component } from '@angular/core';
import { UserService } from 'src/app/shared/services/users/user.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  standalone: false,
})
export class SidebarComponent {
  userModuleAccess: number[] = [];
  userID: any = localStorage.getItem('user_id');
  profileImg: string = '';
  loginUserName: string = '';
  imageURL: string = '';
  userRole: any = '';
  userRoleName: any = '';
  menus: any = [];

  constructor(private userSrv: UserService) {
    this.ionViewWillEnter();
  }

  ionViewWillEnter() {
    this.imageURL = environment.imageURL;
    this.getUserDetails();
  }

  getMenus(userRole: number) {
    const allMenus = [
      {
        id: 1,
        text: 'Users',
        link: '/users',
        icon: 'fa-solid fa-user',
      },
      {
        id: 5,
        text: 'Group Access',
        link: '/master/group-access',
        icon: 'fa-solid fa-universal-access',
      },
      {
        id: 7,
        text: 'Work Site',
        link: '/master/work-site',
        icon: 'fa-solid fa-person-digging',
      },
      {
        id: 11,
        text: 'Note Book',
        link: '/master/note-book',
        icon: 'fa-solid fa-book',
      },
      {
        id: 17,
        text: 'Labour Rates',
        link: '/master/labour-rates',
        icon: 'fa-solid fa-dollar-sign',
      },
      {
        id: 29,
        text: 'Labour Attendance',
        link: '/labour/labour-attendance',
        icon: 'fa-solid fa-user',
      },
      {
        id: 20,
        text: 'Labour Wages',
        link: '/labour/labour-wages',
        icon: 'fa-solid fa-coins',
      },
    ];

    this.menus = allMenus.filter((menu: any) =>
      this.hasAccess(menu.id, userRole)
    );
  }

  async getUserDetails() {
    this.userModuleAccess = [];
    const data = await this.userSrv.getUserDetails(this.userID);
    const [details] = data.rows;
    this.loginUserName = details.full_name;
    this.profileImg = details.profile_pic;
    this.userRole = details.user_role.role_id;
    this.userRoleName = details.user_role.role_name;
    this.userModuleAccess = details.user_role.module_access.map(
      (access: any) => access.module_access_id
    );
    this.getMenus(this.userRole);
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
}
