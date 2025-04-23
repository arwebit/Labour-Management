import { HttpErrorResponse } from '@angular/common/module.d-CnjH8Dlt';
import { Component, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { AlertController, InfiniteScrollCustomEvent } from '@ionic/angular';
import { LabourAttendancesService } from 'src/app/shared/services/labour/labour-attendances.service';
import { UserService } from 'src/app/shared/services/users/user.service';
import { Geolocation } from '@capacitor/geolocation';
import { WorkSiteService } from 'src/app/shared/services/master/work-site.service';

interface WorkSite {
  WorkSiteID: string;
  WorkSiteName: string;
  WorkSiteLocation: string;
  Attendance: {
    AttendanceID: string;
    CheckIn: string;
    CheckOut: string;
    WorkDate: string;
    Description: string;
    Status: string;
  };
}

@Component({
  selector: 'app-labour-attendances',
  standalone: false,
  templateUrl: './labour-attendances.component.html',
  styleUrls: ['./labour-attendances.component.scss'],
})
export class LabourAttendancesComponent {
  loggedInUserID: any = localStorage.getItem('user_id');
  userModuleAccess: number[] = [];
  userRole: any = '';
  currentDate: any = '';
  currentDateTime: any = '';
  workSiteID: any = '';
  checkInForm!: FormGroup;
  checkOutForm!: FormGroup;
  workSitesLists: WorkSite[] = [];
  offset: number = 0;
  limit: number = 10;
  loading: boolean = false;
  loader: boolean = false;
  sortBy: string = 'work_site_id';
  sortType: any = -1;
  condition: any = [];
  descriptionErr: string = '';
  saveMsg: string = '';
  isToastOpen: boolean = false;
  hasPresent: boolean = false;
  siteName: string = '';
  liveLocationErr: string = '';
  attendanceList: any = [];
  currentLocation: any = '';
  currentLatitude: any = '';
  currentLongitude: any = '';

  @ViewChild('checkInModel') checkInModel: any;
  @ViewChild('checkOutModel') checkOutModel: any;

  constructor(
    private userSrv: UserService,
    private workSiteSrv: WorkSiteService,
    private attendanceSrv: LabourAttendancesService,
    public alertController: AlertController
  ) {
    this.closeModal();
    this.checkInFormInit();
    this.checkOutFormInit();
  }

  ionViewWillEnter(): void {
    this.getLocation();
    this.getCurrentDate();
    this.getUserDetails();
    this.checkInFormInit();
    this.checkOutFormInit();
    this.closeModal();
    this.getWorkSites();
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

  async denyAccess(header: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
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

  doRefresh(event: any) {
    setTimeout(() => {
      this.ionViewWillEnter();
      event.target.complete();
    }, 3000);
  }

  async openModal(str: string, attendanceID: any = '', workSiteID: any = '') {
    if (str === 'check-in') {
      const modalElement = this.checkInModel?.el;
      if (modalElement) {
        await modalElement.present();
        this.getLocation();
        this.getCurrentDate();
        this.getParticularWorkSites(workSiteID);
        this.checkInFormInit(workSiteID);
      }
    } else {
      const modalElement = this.checkOutModel?.el;
      if (modalElement) {
        await modalElement.present();
        this.getLocation();
        this.getCurrentDate();
        this.getParticularWorkSites(workSiteID);
        this.checkOutFormInit(attendanceID);
      }
    }
  }

  async closeModal() {
    const modalElement1 = this.checkInModel?.el;
    const modalElement2 = this.checkOutModel?.el;

    if (modalElement1) {
      await modalElement1.dismiss();
    }
    if (modalElement2) {
      await modalElement2.dismiss();
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

  async getLocation() {
    try {
      const position = await Geolocation.getCurrentPosition();
      this.currentLatitude = position.coords.latitude;
      this.currentLongitude = position.coords.longitude;

      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${this.currentLatitude}&lon=${this.currentLongitude}`
      );
      const data = await response.json();
      this.currentLocation = data.display_name;
    } catch (error) {
      console.error('Error getting location or place name:', error);
    }
  }

  async popup(hdrStr: string, msgStr: string) {
    const alert = await this.alertController.create({
      header: hdrStr,
      message: msgStr,
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

  getParticularWorkSites(workSiteID: any) {
    const postData = {
      filter: {
        condition: [['work_site_id', '=', workSiteID]],
      },
      start_row: 0,
      page_records: 1,
      sort_field: 'work_site_id',
      sort: -1,
    };

    this.workSiteSrv.getWorkSites(postData).subscribe((result: any) => {
      const [details] = result.rows;
      this.siteName = details.work_site_name;
    });
  }

  getWorkSites() {
    const postData = {
      labour: this.loggedInUserID,
      work_date: this.currentDate,
    };
    this.attendanceSrv.getCurrentAttandance(postData).subscribe(
      (result: any) => {
        let items: any = {};
        const details = result.rows;
        for (let sites of details) {
          let status = '';
          if (sites.attendance?.check_in && sites.attendance?.check_out) {
            status = 'Check-out';
          } else if (
            sites.attendance?.check_in &&
            !sites.attendance?.check_out
          ) {
            status = 'Present';
          } else {
            status = 'Absent';
          }
          items = {
            WorkSiteID: sites.work_site_id,
            WorkSiteName: sites.work_site_name,
            WorkSiteLocation: sites.work_site_location,
            Attendance: {
              AttendanceID: sites.attendance?.attendance_id,
              CheckIn: sites.attendance?.check_in,
              CheckOut: sites.attendance?.check_out,
              WorkDate: sites.attendance?.work_date,
              Description: sites.attendance?.description,
              Status: status,
            },
          };
          this.workSitesLists.push(items);
          items = {};
        }
        this.hasPresent = this.workSitesLists.some(
          (site) => site.Attendance.Status === 'Present'
        );
      },
      (err: HttpErrorResponse) => {
        console.log('Something went wrong');
      }
    );
  }

  setToastOpen(isOpen: boolean) {
    this.isToastOpen = isOpen;
  }

  checkInFormInit(workSiteID: any = '') {
    this.checkInForm = new FormGroup({
      labour: new FormControl(this.loggedInUserID),
      check_in: new FormControl(this.currentDateTime),
      work_site: new FormControl(workSiteID),
      work_date: new FormControl(this.currentDate),
      location: new FormControl(this.currentLocation),
      latitude: new FormControl(this.currentLatitude),
      longitude: new FormControl(this.currentLongitude),
    });
  }

  checkOutFormInit(attendanceID: any = '') {
    this.checkOutForm = new FormGroup({
      attendance_id: new FormControl(attendanceID),
      check_out: new FormControl(this.currentDate),
      description: new FormControl(''),
      location: new FormControl(this.currentLocation),
      latitude: new FormControl(this.currentLatitude),
      longitude: new FormControl(this.currentLongitude),
    });
  }

  checkIn() {
    const confirmation = confirm(
      'Are you sure you want to check in? This action cannot be undone.'
    );

    if (confirmation) {
      this.attendanceSrv.checkIn(this.checkInForm.value).subscribe(
        (res: any) => {
          this.saveMsg = '';
          this.saveMsg = res.message;
          this.workSitesLists = [];
          this.getWorkSites();
          this.checkInFormInit();
          this.setToastOpen(true);
          this.closeModal();
        },
        (err: HttpErrorResponse) => {
          this.saveMsg = '';
          this.saveMsg = err.error.message;
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
      this.attendanceSrv
        .checkOut(
          this.checkOutForm.value,
          this.checkOutForm.value.attendance_id
        )
        .subscribe(
          (res: any) => {
            this.saveMsg = '';
            this.saveMsg = res.message;
            this.workSitesLists = [];
            this.getWorkSites();
            this.checkInFormInit();
            this.setToastOpen(true);
            this.closeModal();
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

  infiniteScroll(ev: any) {
    this.getWorkSites();

    setTimeout(() => {
      (ev as InfiniteScrollCustomEvent).target.complete();
    }, 500);
  }
}
