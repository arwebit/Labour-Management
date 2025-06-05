import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { InfiniteScrollCustomEvent } from '@ionic/angular';
import { LabourAttendancesService } from 'src/app/shared/services/labour/labour-attendances.service';
import { UserService } from 'src/app/shared/services/users/user.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-view-manage-attendance',
  standalone: false,
  templateUrl: './view-manage-attendance.component.html',
  styleUrls: ['./view-manage-attendance.component.scss'],
})
export class ViewManageAttendanceComponent implements OnInit {
  @Input('workDate') workDate: string = '';
  @Output('attendanceID') attendanceID: any = new EventEmitter<any>();
  env: any = environment.module_access;
  loggedInUserID: any = localStorage.getItem('user_id');
  userRole: any = '';
  userModuleAccess: number[] = [];
  labourLists: any = [];
  offset: number = 0;
  limit: number = 10;
  loading: boolean = false;
  loader: boolean = false;
  saveMsg: string = '';
  isToastOpen: boolean = false;

  constructor(
    private attSrv: LabourAttendancesService,
    private userSrv: UserService
  ) {}

  ngOnInit() {
    this.getUserDetails();
    this.getLabourAttendnaces();
  }
  loadAttendances() {
    this.offset = 0;
    this.labourLists = [];
    this.getLabourAttendnaces();
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

  getLabourAttendnaces() {
    this.loader = true;

    if (this.loading) return;
    this.loading = true;

    const postData = {
      work_date: this.workDate,
      start: this.offset,
      page_records: this.limit,
    };

    this.attSrv
      .getLabourListBasedOnCurrentAttendance(postData)
      .subscribe((result: any) => {
        this.loader = false;
        this.labourLists = [...this.labourLists, ...result.rows];
        this.offset += this.limit;
        this.loading = false;
      });
  }

  setToastOpen(isOpen: boolean) {
    this.isToastOpen = isOpen;
  }

  getUpdateAtttendanceID(attendanceID: any) {
    this.attendanceID.emit(attendanceID);
  }

  deleteAttendance(attendanceID: number) {
    const confirmDelete = confirm(
      'Are you sure you want to delete ? This cannot be un-done'
    );
    if (confirmDelete) {
      this.attSrv.deleteLabourAttendance(attendanceID).subscribe(
        (res: any) => {
          this.offset = 0;
          this.limit = 10;
          this.labourLists = [];
          this.saveMsg = '';
          this.saveMsg = res.message;
          this.setToastOpen(true);
          this.getLabourAttendnaces();
        },
        (err: HttpErrorResponse) => {
          alert('Cannot delete');
        }
      );
    }
  }

  infiniteScroll(ev: any) {
    this.getLabourAttendnaces();
    setTimeout(() => {
      (ev as InfiniteScrollCustomEvent).target.complete();
    }, 500);
  }
}
