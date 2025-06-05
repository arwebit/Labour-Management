import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { LabourAttendancesService } from 'src/app/shared/services/labour/labour-attendances.service';
import { LabourRatesService } from 'src/app/shared/services/master/labour-rates.service';
import { WorkSiteService } from 'src/app/shared/services/master/work-site.service';
import { HelpersService } from 'src/app/shared/services/others/helpers.service';
import { UserService } from 'src/app/shared/services/users/user.service';

@Component({
  selector: 'app-update-attendance',
  standalone: false,
  templateUrl: './update-attendance.component.html',
  styleUrls: ['./update-attendance.component.scss'],
})
export class UpdateAttendanceComponent implements OnInit {
  @Input('workDate') workDate = '';
  @Input('attendanceID') attendanceID = '';

  loggedInUserID: any = localStorage.getItem('user_id');
  saveAttendanceForm!: FormGroup;
  workSiteLists: any = [];
  workSiteAttendanceList: any = [];
  labourLists: any = [];
  labourNane: string = '';
  labourRole: any = '';
  labourErr: string = '';
  labourRateErr: string = '';
  checkInLocationErr: string = '';
  checkOutLocationErr: string = '';
  checkInErr: string = '';
  checkOutErr: string = '';
  workSiteErr: string = '';
  workDateErr: string = '';
  descriptionErr: string = '';
  saveMsg: string = '';
  isToastOpen: boolean = false;
  hasPresent: boolean = false;
  checkOutDiv: boolean = false;
  deleteBtn: boolean = false;

  constructor(
    private attSrv: LabourAttendancesService,
    private helperSrv: HelpersService,
    private workSiteSrv: WorkSiteService,
    private userSrv: UserService
  ) {
    this.emptyErrors();
    this.getWorkSites();
    this.getLabourRole();
  }

  ngOnInit(): void {
    this.saveAttendanceFormInit();
    this.getLabourAttendance();
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

  getLabourAttendance() {
    const data = {
      filter: {
        condition: [['attendance_id', '=', this.attendanceID]],
      },
      start: 0,
      page_records: 1,
      sort_field: 'attendance_id',
      sort: -1,
    };

    this.attSrv.getLabourAttendances(data).subscribe(
      (result: any) => {
        const [details] = result.rows;
        this.labourNane = details.labour.full_name;

        this.saveAttendanceForm = new FormGroup({
          labour: new FormControl(details.labour.user_id),
          labour_rate: new FormControl(details.labour_rate),
          check_in: new FormControl(details.check_in),
          check_out: new FormControl(details.check_out),
          description: new FormControl(details.description),
          work_site: new FormControl(details.work_site.work_site_id),
          work_date: new FormControl(details.work_date),
          check_in_latitude: new FormControl(details.check_in_latitude),
          check_in_longitude: new FormControl(details.check_in_longitude),
          check_in_location: new FormControl(details.check_in_location),
          check_out_latitude: new FormControl(details.check_out_latitude),
          check_out_longitude: new FormControl(details.check_out_longitude),
          check_out_location: new FormControl(details.check_out_location),
        });
      },
      (err: HttpErrorResponse) => {
        console.log('Something went wrong');
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
    this.checkOutErr = '';
    this.workSiteErr = '';
    this.checkInLocationErr = '';
    this.checkOutLocationErr = '';
    this.descriptionErr = '';
  }

  saveAttendance() {
    this.attSrv
      .manageLabourAttendance(this.saveAttendanceForm.value, this.attendanceID)
      .subscribe(
        (res: any) => {
          this.emptyErrors();
          this.saveMsg = '';
          this.saveMsg = res.message;
          this.setToastOpen(true);
        },
        (err: HttpErrorResponse) => {
          this.emptyErrors();
          this.saveMsg = '';
          this.saveMsg = err.error.message;
          this.labourErr = err.error.errors.labour;
          this.labourRateErr = err.error.errors.labour_rate;
          this.workSiteErr = err.error.errors.work_site;
          this.checkInErr = err.error.errors.check_in;
          this.checkOutErr = err.error.errors.check_out;
          this.descriptionErr = err.error.errors.description;
          this.checkInLocationErr = err.error.errors.check_in_location;
          this.checkOutLocationErr = err.error.errors.check_out_location;
          this.setToastOpen(true);
        }
      );
  }
}
