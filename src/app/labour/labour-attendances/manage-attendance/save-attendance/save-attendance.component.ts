import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { LabourAttendancesService } from 'src/app/shared/services/labour/labour-attendances.service';
import { LabourRatesService } from 'src/app/shared/services/master/labour-rates.service';
import { WorkSiteService } from 'src/app/shared/services/master/work-site.service';
import { HelpersService } from 'src/app/shared/services/others/helpers.service';
import { UserService } from 'src/app/shared/services/users/user.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-save-attendance',
  standalone: false,
  templateUrl: './save-attendance.component.html',
  styleUrls: ['./save-attendance.component.scss'],
})
export class SaveAttendanceComponent implements OnInit {
  env: any = environment.module_access;
  @Input('workDate') workDate = '';
  loggedInUserID: any = localStorage.getItem('user_id');
  userRole: any = '';
  userModuleAccess: number[] = [];
  saveAttendanceForm!: FormGroup;
  workSiteLists: any = [];
  labourID: any = '';
  labourRate: any = '';
  checkInTime: any = '';
  checkInLocation: any = '';
  labourLists: any = [];
  labourRole: any = '';
  labourErr: string = '';
  labourRateErr: string = '';
  checkInLocationErr: string = '';
  checkInErr: string = '';
  workSiteErr: string = '';
  workDateErr: string = '';
  saveMsg: string = '';
  isToastOpen: boolean = false;

  constructor(
    private attSrv: LabourAttendancesService,
    private helperSrv: HelpersService,
    private workSiteSrv: WorkSiteService,
    private userSrv: UserService,
    private rateSrv: LabourRatesService,
    private router: Router
  ) {
    this.emptyErrors();
    this.getWorkSites();
    this.getLabourRole();
  }

  ngOnInit(): void {
    this.getUserDetails();
    this.saveAttendanceFormInit();
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
  getLabourDetails() {
    this.getLabourRates(this.labourID);
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

  getWorkSites() {
    this.workSiteSrv.getAllWorkSites().subscribe(
      (result: any) => {
        this.workSiteLists = result.rows;
      },
      (err: HttpErrorResponse) => {
        console.log(err.error.message);
      }
    );
  }

  saveAttendanceFormInit() {
    this.saveAttendanceForm = new FormGroup({
      labour: new FormControl(''),
      labour_rate: new FormControl(''),
      check_in: new FormControl(),
      check_out: new FormControl(),
      description: new FormControl(),
      work_site: new FormControl(''),
      work_date: new FormControl(''),
      check_in_latitude: new FormControl(''),
      check_in_longitude: new FormControl(''),
      check_in_location: new FormControl(''),
      check_out_latitude: new FormControl(''),
      check_out_longitude: new FormControl(''),
      check_out_location: new FormControl(''),
    });
  }

  setToastOpen(isOpen: boolean) {
    this.isToastOpen = isOpen;
  }

  emptyErrors() {
    this.labourErr = '';
    this.labourRateErr = '';
    this.checkInErr = '';
    this.workSiteErr = '';
    this.checkInLocationErr = '';
  }

  saveAttendance() {
    this.attSrv.manageLabourAttendance(this.saveAttendanceForm.value).subscribe(
      (res: any) => {
        this.emptyErrors();
        this.saveMsg = '';
        this.saveMsg = res.message;
        this.saveAttendanceFormInit();
        this.setToastOpen(true);
        // this.router.navigateByUrl(
        //   '/labour/labour-attendance/manage-attendance'
        // );
      },
      (err: HttpErrorResponse) => {
        this.emptyErrors();
        this.saveMsg = '';
        this.saveMsg = err.error.message;
        this.labourErr = err.error.errors.labour;
        this.labourRateErr = err.error.errors.labour_rate;
        this.workSiteErr = err.error.errors.work_site;
        this.checkInErr = err.error.errors.check_in;
        this.checkInLocationErr = err.error.errors.check_in_location;
        this.setToastOpen(true);
      }
    );
  }
}
