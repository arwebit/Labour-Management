import { HttpErrorResponse } from '@angular/common/module.d-CnjH8Dlt';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { LabourAttendancesService } from 'src/app/shared/services/labour/labour-attendances.service';
import { LabourRatesService } from 'src/app/shared/services/master/labour-rates.service';
import { HelpersService } from 'src/app/shared/services/others/helpers.service';
import { UserService } from 'src/app/shared/services/users/user.service';

interface WorkSite {
  WorkSiteID: string;
  WorkSiteName: string;
  WorkSiteLocation: string;
  AttendanceStatus: string;
  Disabled: boolean;
  Attendance: {
    AttendanceID: string;
    LabourRate: string;
    CheckIn: string;
    CheckOut: string;
    WorkDate: string;
    Description: string;
  };
}
@Component({
  selector: 'app-show-attendances',
  standalone: false,
  templateUrl: './show-attendances.component.html',
  styleUrls: ['./show-attendances.component.scss'],
})
export class ShowAttendancesComponent implements OnInit {
  showAttendanceDiv: boolean = true;
  addAttendanceDiv: boolean = false;

  currentDate: any = '';
  currentDateTime: any = '';
  loggedInUserID: any = localStorage.getItem('user_id');
  userRole: any = '';
  userModuleAccess: number[] = [];

  constructor(private userSrv: UserService) {}

  ionViewWillEnter() {
    this.getUserDetails();
    this.getCurrentDate();
  }
  ngOnInit() {
    this.getCurrentDate();
  }
  toggleFormDiv(str: string) {
    if (str === 'view') {
      this.showAttendanceDiv = true;
      this.addAttendanceDiv = false;
    } else {
      this.showAttendanceDiv = false;
      this.addAttendanceDiv = true;
    }
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
    const formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    this.currentDate = `${year}-${month}-${day}`;
    this.currentDateTime = formattedDateTime;
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
