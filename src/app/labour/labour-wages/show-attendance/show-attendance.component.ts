import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { LabourAttendancesService } from 'src/app/shared/services/labour/labour-attendances.service';
import { HelpersService } from 'src/app/shared/services/others/helpers.service';
import { UserService } from 'src/app/shared/services/users/user.service';

@Component({
  selector: 'app-show-attendance',
  standalone: false,
  templateUrl: './show-attendance.component.html',
  styleUrls: ['./show-attendance.component.scss'],
})
export class ShowAttendanceComponent {
  loggedInUserID: any = localStorage.getItem('user_id');
  userModuleAccess: number[] = [];
  userRole: any = '';
  labourRole: any = '';
  labourID: any = '';
  labourLists: any = [];
  attWagesLists: any = [];
  attendances: boolean = false;
  attTable: boolean = false;
  totalWages: any = '';
  fromDate: any = '';
  toDate: any = '';

  constructor(
    public alertController: AlertController,
    private helperSrv: HelpersService,
    private userSrv: UserService,
    private attSrv: LabourAttendancesService
  ) {
    this.getUserDetails();
    this.getLabourRole();
  }
  getLabourRole() {
    this.helperSrv.getAllUserRoles().subscribe(
      (res: any) => {
        const roles = res.rows;
        this.labourRole = roles.find(
          (role: any) => role.role_name === 'Labour'
        )?.role_id;
        this.getLabours(this.labourRole);
      },
      (err: HttpErrorResponse) => {
        console.log('Something went wrong');
      }
    );
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

  getLabours(labourRole: any) {
    const postData = {
      filter: {
        condition: [['user_role', '=', labourRole]],
      },
      start_row: 0,
      page_records: 1000000,
      sort_field: 'full_name',
      sort: -1,
    };

    this.userSrv.getUsers(postData).subscribe(
      (result: any) => {
        this.labourLists = result.rows;
      },
      (err: HttpErrorResponse) => {
        console.log('Something went wrong');
      }
    );
  }

  getUserPerformanceDetails(event: Event) {
    this.labourID = (<HTMLInputElement>event.target).value;
    if (this.labourID) {
      this.attendances = true;
    } else {
      this.attendances = false;
    }
  }

  async getUserAttendanceDetails() {
    const fromDate = this.fromDate;
    const toDate = this.toDate;
    if (fromDate && toDate) {
      const postData = {
        labour: this.labourID,
        from_date: fromDate,
        to_date: toDate,
      };

      this.attSrv.getNoOfWages(postData).subscribe(
        (result: any) => {
          this.attTable = true;
          this.totalWages = result.total_wages;
          this.attWagesLists = result.rows;
        },
        (err: HttpErrorResponse) => {
          this.attTable = false;
          console.log('Something went wrong');
        }
      );
    } else {
      this.attTable = false;
      const alert = await this.alertController.create({
        header: 'Recorrect errors',
        message: 'Provide all the dates',
        backdropDismiss: false,
        buttons: [
          {
            text: 'Ok',
            role: 'cancel',
          },
        ],
      });
      await alert.present();
    }
  }
}
