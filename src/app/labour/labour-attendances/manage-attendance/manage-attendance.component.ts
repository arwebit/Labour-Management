import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from 'src/app/shared/services/users/user.service';
import { environment } from 'src/environments/environment';
import { ViewManageAttendanceComponent } from './view-manage-attendance/view-manage-attendance.component';

@Component({
  selector: 'app-manage-attendance',
  standalone: false,
  templateUrl: './manage-attendance.component.html',
  styleUrls: ['./manage-attendance.component.scss'],
})
export class ManageAttendanceComponent implements OnInit {
  env: any = environment.module_access;
  showAttendanceDiv: boolean = true;
  addAttendanceDiv: boolean = false;
  updateAttendanceDiv: boolean = false;
  attendanceID: any = '';
  workDate: any = '';
  loggedInUserID: any = localStorage.getItem('user_id');
  userRole: any = '';
  userModuleAccess: number[] = [];
  currentDate: any = '';
  @ViewChild('viewAttendanceComp')
  viewAttendanceComp!: ViewManageAttendanceComponent;

  constructor(private userSrv: UserService) {}

  ionViewWillEnter() {
    this.getUserDetails();
  }

  ngOnInit() {
    this.getCurrentDate();
  }

  getAttendanceID(attendance_id: any) {
    this.attendanceID = attendance_id;
    this.showAttendanceDiv = false;
    this.addAttendanceDiv = false;
    this.updateAttendanceDiv = true;
  }

  getCurrentDate() {
    const now = new Date();
    const istDate = new Date(
      now.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' })
    );

    const year = istDate.getFullYear();
    const month = String(istDate.getMonth() + 1).padStart(2, '0');
    const day = String(istDate.getDate()).padStart(2, '0');
    const hours = String(istDate.getHours()).padStart(2, '0');
    const minutes = String(istDate.getMinutes()).padStart(2, '0');
    const seconds = String(istDate.getSeconds()).padStart(2, '0');
    this.currentDate = `${year}-${month}-${day}`;
  }

  getList(type: string) {
    if (this.currentDate) {
      if (type === 'view') {
        this.showAttendanceDiv = true;
        this.addAttendanceDiv = false;
        this.updateAttendanceDiv = false;
        setTimeout(() => {
          if (this.viewAttendanceComp) {
            this.viewAttendanceComp.loadAttendances();
          }
        });
      } else {
        this.showAttendanceDiv = false;
        this.addAttendanceDiv = true;
        this.updateAttendanceDiv = false;
      }
    } else {
      alert('Please provide work date');
    }
  }

  async getUserDetails() {
    this.userModuleAccess = [];
    const data = await this.userSrv.getUserDetails(this.loggedInUserID);
    const [details] = data.rows;
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
}
