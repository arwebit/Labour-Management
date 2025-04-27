import { Component } from '@angular/core';
import { environment } from 'src/environments/environment';
import { UserService } from '../shared/services/users/user.service';

@Component({
  selector: 'app-reports',
  standalone: false,
  templateUrl: './reports.page.html',
  styleUrls: ['./reports.page.scss'],
})
export class ReportsPage {
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
        id: environment.module_access.labour_detailed_report,
        image: '../../assets/images/menu_pics/reports.png',
        text: 'Labour',
        link: '/reports/labour-report',
      },
      {
        id: environment.module_access.labour_attendance_report,
        text: 'Attendance',
        image: '../../assets/images/menu_pics/reports.png',
        link: '/reports/attendance-report',
      },
      {
        id: environment.module_access.labour_normal_wages_report,
        text: 'Normal Wages',
        image: '../../assets/images/menu_pics/reports.png',
        link: '/reports/labour-normal-wages-report',
      },
      {
        id: environment.module_access.labour_special_wages_report,
        text: 'Special Advance',
        image: '../../assets/images/menu_pics/reports.png',
        link: '/reports/labour-special-wages-report',
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
