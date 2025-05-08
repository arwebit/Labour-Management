import { HttpErrorResponse } from '@angular/common/module.d-CnjH8Dlt';
import { Component } from '@angular/core';
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
export class ShowAttendancesComponent {
  checkInForm!: FormGroup;
  checkOutForm!: FormGroup;
  currentDate: any = '';
  currentDateTime: any = '';
  loggedInUserID: any = localStorage.getItem('user_id');
  userModuleAccess: number[] = [];
  workSiteLists: WorkSite[] = [];
  siteName: string = '';
  labourID: any = '';
  labourRate: any = '';
  labourLists: any = [];
  userRole: any = '';
  labourRole: any = '';
  labourErr: string = '';
  labourRateErr: string = '';
  locationErr: string = '';
  checkInErr: string = '';
  checkOutErr: string = '';
  workSiteErr: string = '';
  descriptionErr: string = '';
  saveMsg: string = '';
  isToastOpen: boolean = false;
  hasPresent: boolean = false;

  constructor(
    private userSrv: UserService,
    private attSrv: LabourAttendancesService,
    private helperSrv: HelpersService,
    private rateSrv: LabourRatesService
  ) {
    this.checkInFormInit();
    this.checkOutFormInit();
  }

  ionViewWillEnter() {
    this.getUserDetails();
    this.getLabourRole();
    this.getCurrentDate();
    this.checkInFormInit();
    this.checkOutFormInit();
    this.emptyErrors();
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

  getLabourDetails(event: Event) {
    this.labourID = (<HTMLInputElement>event.target).value;
    this.getLabourRates(this.labourID);
    this.getWorkSites(this.labourID);
  }

  getLabourRates(labourID: any) {
    const postData = {
      filter: {
        condition: [['user_details.user_id', '=', labourID]],
      },
      start: 0,
      page_records: 1,
      sort_field: 'labour_rates.rate_id',
      sort: -1,
    };
    this.rateSrv.getLabourRates(postData).subscribe((result: any) => {
      const [details] = result.rows;
      this.labourRate = details.labour_rate;
    });
  }

  getWorkSites(labourID: any) {
    const postData = {
      work_site: '',
      labour: labourID,
      work_date: this.currentDate,
    };

    this.attSrv.getCurrentAttandance(postData).subscribe(
      (result: any) => {
        this.workSiteLists = [];
        const sites = result.rows;

        const isAnyPresent = sites.some(
          (site: any) => site.attendance_status === 'present'
        );

        for (let site of sites) {
          let disabled = false;

          if (site.attendance_status === 'check-out') {
            disabled = true;
          } else if (isAnyPresent && site.attendance_status !== 'present') {
            disabled = true;
          }

          const item = {
            WorkSiteID: site.work_site_id,
            WorkSiteName: site.work_site_name,
            WorkSiteLocation: site.work_site_location,
            AttendanceStatus: site.attendance_status,
            Disabled: disabled,
            Attendance: {
              AttendanceID: site.attendance?.attendance_id,
              LabourRate: site.attendance?.labour_rate,
              CheckIn: site.attendance?.check_in,
              CheckOut: site.attendance?.check_out,
              WorkDate: site.attendance?.work_date,
              Description: site.attendance?.description,
            },
          };

          this.workSiteLists.push(item);

          this.checkInForm = new FormGroup({
            labour: new FormControl(labourID),
            labour_rate: new FormControl(this.labourRate),
            check_in: new FormControl(this.currentDateTime),
            work_site: new FormControl(''),
            work_date: new FormControl(this.currentDate),
            latitude: new FormControl(''),
            longitude: new FormControl(''),
            location: new FormControl(''),
          });

          if (site.attendance_status === 'present') {
            this.siteName = site.work_site_name;
            this.checkOutForm = new FormGroup({
              attendance_id: new FormControl(site.attendance?.attendance_id),
              labour: new FormControl(labourID),
              check_out: new FormControl(this.currentDateTime),
              description: new FormControl(''),
              latitude: new FormControl(''),
              longitude: new FormControl(''),
              location: new FormControl(''),
            });
          }
        }
        this.hasPresent = result.attendance_status === 'present';
      },
      (err: HttpErrorResponse) => {
        console.log(err.error.message);
      }
    );
  }

  checkInFormInit() {
    this.checkInForm = new FormGroup({
      labour: new FormControl(''),
      labour_rate: new FormControl(''),
      check_in: new FormControl(this.currentDateTime),
      work_site: new FormControl(''),
      work_date: new FormControl(this.currentDate),
      latitude: new FormControl(''),
      longitude: new FormControl(''),
      location: new FormControl(''),
    });
  }

  checkOutFormInit() {
    this.checkOutForm = new FormGroup({
      attendance_id: new FormControl(''),
      labour: new FormControl(''),
      check_out: new FormControl(this.currentDateTime),
      description: new FormControl(''),
      latitude: new FormControl(''),
      longitude: new FormControl(''),
      location: new FormControl(''),
    });
  }
  setToastOpen(isOpen: boolean) {
    this.isToastOpen = isOpen;
  }

  emptyErrors() {
    this.labourErr = '';
    this.labourRateErr = '';
    this.checkInErr = '';
    this.checkOutErr = '';
    this.workSiteErr = '';
    this.locationErr = '';
    this.descriptionErr = '';
  }

  checkIn() {
    const confirmation = confirm(
      'Are you sure you want to check in? This action cannot be undone.'
    );

    if (confirmation) {
      this.attSrv.checkIn(this.checkInForm.value).subscribe(
        (res: any) => {
          this.emptyErrors();
          this.saveMsg = '';
          this.saveMsg = res.message;
          this.checkInFormInit();
          this.setToastOpen(true);
        },
        (err: HttpErrorResponse) => {
          this.emptyErrors();
          this.saveMsg = '';
          this.saveMsg = err.error.message;
          this.labourErr = err.error.errors.labour;
          this.labourRateErr = err.error.errors.labour_rate;
          this.workSiteErr = err.error.errors.work_site;
          this.locationErr = err.error.errors.location;
          this.setToastOpen(true);
        }
      );
    }
  }

  checkOut() {
    const confirmation = confirm(
      'Are you sure you want to check out? This action cannot be undone.'
    );

    if (confirmation) {
      this.attSrv
        .checkOut(
          this.checkOutForm.value,
          this.checkOutForm.value.attendance_id
        )
        .subscribe(
          (res: any) => {
            this.emptyErrors();
            this.saveMsg = '';
            this.saveMsg = res.message;
            this.hasPresent = false;
            this.checkOutFormInit();
            this.setToastOpen(true);
          },
          (err: HttpErrorResponse) => {
            this.descriptionErr = '';
            this.descriptionErr = err.error.errors.description;
            this.saveMsg = '';
            this.saveMsg = err.error.message;
            this.setToastOpen(true);
          }
        );
    }
  }
}
