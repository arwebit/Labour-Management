import { HttpErrorResponse } from '@angular/common/module.d-CnjH8Dlt';
import { Component } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { AlertController, InfiniteScrollCustomEvent } from '@ionic/angular';
import { LabourAttendancesService } from 'src/app/shared/services/labour/labour-attendances.service';
import { UserService } from 'src/app/shared/services/users/user.service';
import { Geolocation } from '@capacitor/geolocation';
import { WorkSiteService } from 'src/app/shared/services/master/work-site.service';
import { environment } from 'src/environments/environment';
import { LabourRatesService } from 'src/app/shared/services/master/labour-rates.service';

interface WorkSite {
  WorkSiteID: string;
  WorkSiteName: string;
  WorkSiteLocation: string;
  Attendance: {
    AttendanceID: string;
    LabourRate: string;
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
  env: any = environment;
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
  labourErr: string = '';
  labourRateErr: string = '';
  workSiteErr: string = '';
  workDateErr: string = '';
  locationErr: string = '';
  checkInErr: string = '';
  checkOutErr: string = '';
  errorDiv: boolean = false;
  saveMsg: string = '';
  isToastOpen: boolean = false;
  hasPresent: boolean = false;
  labourRate: any = '';
  siteName: string = '';
  attendanceList: any = [];
  currentLocation: any = '';
  currentLatitude: any = '';
  currentLongitude: any = '';

  showLists: boolean = true;
  checkInFormDiv: boolean = false;
  checkOutFormDiv: boolean = false;

  checkBtn: boolean = true;

  constructor(
    private userSrv: UserService,
    private ratesSrv: LabourRatesService,
    private workSiteSrv: WorkSiteService,
    private attendanceSrv: LabourAttendancesService,
    public alertController: AlertController
  ) {
    this.checkInFormInit();
    this.checkOutFormInit();
  }

  ionViewWillEnter(): void {
    this.emptyErrors();
    this.getUserDetails();
    this.getLabourRates();
    this.getCurrentDate();
    this.checkInFormInit();
    this.checkOutFormInit();
    this.getWorkSites();
    this.getLocation();
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

  getLabourRates() {
    const postData = {
      filter: {
        condition: [['labour', '=', this.loggedInUserID]],
      },
      start_row: 0,
      page_records: 1,
      sort_field: 'rate_id',
      sort: -1,
    };

    this.ratesSrv.getLabourRates(postData).subscribe((result: any) => {
      const [details] = result.rows;
      this.labourRate = details.labour_rate;
    });
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

  toggleFormDiv(str: string, attendanceID: any = '', workSiteID: any = '') {
    if (str === 'check-in') {
      this.showLists = false;
      this.checkInFormDiv = true;
      this.checkOutFormDiv = false;
      this.getLocation();
      this.getCurrentDate();
      this.getParticularWorkSites(workSiteID);
      this.checkInFormInit(workSiteID);
    } else if (str === 'check-out') {
      this.getLocation();
      this.getCurrentDate();
      this.getParticularWorkSites(workSiteID);
      this.checkOutFormInit(attendanceID);
      this.showLists = false;
      this.checkInFormDiv = false;
      this.checkOutFormDiv = true;
    } else {
      this.getWorkSites();
      this.showLists = true;
      this.checkInFormDiv = false;
      this.checkOutFormDiv = false;
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
      const position = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      });
      this.currentLatitude = position.coords.latitude;
      this.currentLongitude = position.coords.longitude;

      if (this.currentLatitude && this.currentLongitude) {
        this.checkBtn = true;
      } else {
        this.checkBtn = false;
      }

      const apiKey = environment.google_api_key;
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${this.currentLatitude},${this.currentLongitude}&key=${apiKey}`
      );
      const data = await response.json();

      if (data.status === 'OK' && data.results.length > 0) {
        this.currentLocation = data.results[0].formatted_address;
        this.checkInForm.patchValue({
          location: this.currentLocation,
          latitude: this.currentLatitude,
          longitude: this.currentLongitude,
        });
        this.checkOutForm.patchValue({
          location: this.currentLocation,
          latitude: this.currentLatitude,
          longitude: this.currentLongitude,
        });
      } else {
        console.warn('No results found or geocoding failed.');
        this.currentLocation = 'Unknown Location';
      }
    } catch (error) {
      console.error('Error getting location or place name:', error);
      this.currentLocation = 'Error fetching location';
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
              LabourRate: sites.attendance?.labour_rate,
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

  emptyErrors() {
    this.descriptionErr = '';
    this.labourErr = '';
    this.labourRateErr = '';
    this.workSiteErr = '';
    this.workDateErr = '';
    this.locationErr = '';
    this.checkInErr = '';
    this.checkOutErr = '';
  }

  checkInFormInit(workSiteID: any = '') {
    this.checkInForm = new FormGroup({
      labour: new FormControl(this.loggedInUserID),
      labour_rate: new FormControl(this.labourRate),
      check_in: new FormControl(this.currentDateTime),
      work_site: new FormControl(workSiteID),
      work_date: new FormControl(this.currentDate),
      location: new FormControl(''),
      latitude: new FormControl(''),
      longitude: new FormControl(''),
    });
  }

  checkOutFormInit(attendanceID: any = '') {
    this.checkOutForm = new FormGroup({
      attendance_id: new FormControl(attendanceID),
      check_out: new FormControl(this.currentDateTime),
      description: new FormControl(''),
      location: new FormControl(''),
      latitude: new FormControl(''),
      longitude: new FormControl(''),
    });
  }

  checkIn() {
    const confirmation = confirm(
      'Are you sure you want to check in? This action cannot be undone.'
    );

    if (confirmation) {
      this.attendanceSrv.checkIn(this.checkInForm.value).subscribe(
        (res: any) => {
          this.emptyErrors();
          this.errorDiv = false;
          this.saveMsg = '';
          this.saveMsg = res.message;
          this.workSitesLists = [];
          this.getWorkSites();
          this.checkInFormInit();
          this.setToastOpen(true);
          this.showLists = true;
          this.checkInFormDiv = false;
          this.checkOutFormDiv = false;
        },
        (err: HttpErrorResponse) => {
          this.emptyErrors();
          this.saveMsg = '';
          this.saveMsg = err.error.message;
          this.labourErr = err.error.errors.labour;
          this.labourRateErr = err.error.errors.labour_rate;
          this.workSiteErr = err.error.errors.work_site;
          this.workDateErr = err.error.errors.work_date;
          this.locationErr = err.error.errors.location;
          this.checkInErr = err.error.errors.check_in;
          if (
            this.labourErr ||
            this.labourRateErr ||
            this.workSiteErr ||
            this.workDateErr ||
            this.locationErr ||
            this.checkInErr
          ) {
            this.errorDiv = true;
          }
          this.setToastOpen(true);
          this.showLists = false;
          this.checkInFormDiv = true;
          this.checkOutFormDiv = false;
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
            this.emptyErrors();
            this.errorDiv = false;
            this.saveMsg = '';
            this.saveMsg = res.message;
            this.workSitesLists = [];
            this.getWorkSites();
            this.checkInFormInit();
            this.setToastOpen(true);
            this.showLists = true;
            this.checkInFormDiv = false;
            this.checkOutFormDiv = false;
          },
          (err: HttpErrorResponse) => {
            this.emptyErrors();

            this.descriptionErr = err.error.errors.description;
            this.checkOutErr = err.error.errors.check_out;
            this.locationErr = err.error.errors.location;

            if (this.checkOutErr || this.locationErr) {
              this.errorDiv = true;
            }
            this.saveMsg = '';
            this.saveMsg = err.error.message;
            this.setToastOpen(true);
            this.showLists = false;
            this.checkInFormDiv = false;
            this.checkOutFormDiv = true;
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
