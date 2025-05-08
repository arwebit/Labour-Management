import { Component } from '@angular/core';
import { environment } from 'src/environments/environment';
import { UserService } from '../shared/services/users/user.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage {
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
        id: environment.module_access.view_users,
        image: '../../assets/images/menu_pics/users.png',
        text: 'Users',
        link: '/users',
      },
      {
        id: environment.module_access.view_group_access,
        text: 'Group Access',
        image: '../../assets/images/menu_pics/group_access.png',
        link: '/master/group-access',
      },
      {
        id: environment.module_access.view_work_site,
        text: 'Work Site',
        image: '../../assets/images/menu_pics/work_site.png',
        link: '/master/work-site',
      },
      {
        id: environment.module_access.view_note_book,
        text: 'Note Book',
        image: '../../assets/images/menu_pics/note_book.png',
        link: '/master/note-book',
      },
      {
        id: environment.module_access.view_labour_rates,
        text: 'Labour Rates',
        image: '../../assets/images/menu_pics/labour_rates.png',
        link: '/master/labour-rates',
      },

      {
        id: environment.module_access.view_labour_wages,
        text: 'Labour Wages',
        image: '../../assets/images/menu_pics/labour_wages.png',
        link: '/labour/labour-wages',
      },
      {
        id: environment.module_access.labour_attendances,
        text: 'Attendance',
        image: '../../assets/images/menu_pics/labour_attendance.png',
        link: '/labour/labour-attendance',
      },
      {
        id: environment.module_access.show_attendances,
        text: 'Show Attendance',
        image: '../../assets/images/menu_pics/labour_attendance.png',
        link: '/labour/labour-attendance/show-attendances',
      },
      {
        id: environment.module_access.view_machines,
        text: 'Machines',
        image: '../../assets/images/menu_pics/machines.png',
        link: '/machines',
      },
      {
        id: environment.module_access.reports,
        text: 'Reports',
        image: '../../assets/images/menu_pics/reports.png',
        link: '/reports',
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
