import { HttpErrorResponse } from '@angular/common/module.d-CnjH8Dlt';
import { Component, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { AlertController, InfiniteScrollCustomEvent } from '@ionic/angular';
import { LabourRatesService } from 'src/app/shared/services/master/labour-rates.service';
import { HelpersService } from 'src/app/shared/services/others/helpers.service';
import { UserService } from 'src/app/shared/services/users/user.service';

@Component({
  selector: 'app-labour-rates',
  standalone: false,
  templateUrl: './labour-rates.component.html',
  styleUrls: ['./labour-rates.component.scss'],
})
export class LabourRatesComponent {
  loggedInUserID: any = localStorage.getItem('user_id');
  userModuleAccess: number[] = [];
  userRole: any = '';

  labourName: string = '';
  labourRole: any = '';
  saveLabourRateForm!: FormGroup;
  labourRateLists: any = [];
  offset: number = 0;
  limit: number = 10;
  loading: boolean = false;
  loader: boolean = false;
  sortBy: string = 'user_details.user_id';
  sortType: any = -1;
  condition: any = [];
  saveMsg: string = '';
  isToastOpen: boolean = false;
  labourErr: string = '';
  labourRateErr: string = '';

  @ViewChild('labourRateModel') labourRateModel: any;

  constructor(
    private userSrv: UserService,
    private helperSrv: HelpersService,
    private labourRateSrv: LabourRatesService,
    private alertController: AlertController
  ) {
    this.closeModal();
    this.saveLabourRateFormInit();
  }

  ionViewWillEnter(): void {
    this.getLabourRole();
    this.getUserDetails();
    this.emptyErrors();
    this.getUserDetails();
    this.emptyErrors();
    this.closeModal();
  }
  checkModalDismiss(event: any) {
    let retVal = false;
    if (event.detail.role === 'backdrop') {
      retVal = true;
    } else if (event.detail.role === 'gesture') {
      event.preventDefault();
      this.labourRateModel.setCurrentBreakpoint(1);
      retVal = false;
    }
    return retVal;
  }
  getLabourRole() {
    this.helperSrv.getAllUserRoles().subscribe(
      (res: any) => {
        const roles = res.rows;
        this.labourRole = roles.find(
          (role: any) => role.role_name === 'Labour'
        )?.role_id;
        this.condition.push(['user_details.user_role', '=', this.labourRole]);
        this.getLabourRates(this.condition);
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

  async openModal(labourID: any = '') {
    this.emptyErrors();
    const modalElement = this.labourRateModel?.el;
    if (modalElement) {
      await modalElement.present();
      this.saveLabourRateFormInit(labourID);
    }
  }

  async closeModal() {
    const modalElement = this.labourRateModel?.el;
    await modalElement.dismiss();
  }

  getLabourRates(condition: any = []) {
    this.loader = true;

    if (this.loading) return;
    this.loading = true;

    const postData = {
      filter: {
        condition: condition,
      },
      start_row: this.offset,
      page_records: this.limit,
      sort_field: this.sortBy,
      sort: this.sortType,
    };

    this.labourRateSrv.getLabourRates(postData).subscribe((result: any) => {
      this.loader = false;
      this.labourRateLists = [...this.labourRateLists, ...result.rows];
      this.offset += this.limit;
      this.loading = false;
    });
  }

  sort(value: any) {
    this.loading = false;
    this.labourRateLists = [];
    switch (value) {
      case '1':
        this.sortBy = 'user_details.full_name';
        this.sortType = -1;
        this.limit = 10;
        this.offset = 0;
        break;
      case '2':
        this.sortBy = 'user_details.full_name';
        this.sortType = 1;
        this.limit = 10;
        this.offset = 0;
        break;
      default:
        this.sortBy = 'user_details.full_name';
        this.sortType = -1;
        this.limit = 10;
        this.offset = 0;
        break;
    }
    this.getLabourRates();
  }

  setToastOpen(isOpen: boolean) {
    this.isToastOpen = isOpen;
  }

  saveLabourRateFormInit(labourID: any = '') {
    this.saveLabourRateForm = new FormGroup({
      labour: new FormControl(labourID),
      labour_rate: new FormControl(''),
      created_by: new FormControl(this.loggedInUserID),
    });
    this.getLabourRateForm(labourID);
  }

  getLabourRateForm(labourID: any = '') {
    const postData = {
      filter: {
        condition: [['user_details.user_id', '=', labourID]],
      },
      start: 0,
      page_records: 1,
      sort_field: 'user_details.user_id',
      sort_type: -1,
    };

    this.labourRateSrv.getLabourRates(postData).subscribe(
      (res: any) => {
        const [details] = res.rows;
        this.labourName = details.full_name;
        this.saveLabourRateForm = new FormGroup({
          labour: new FormControl(details.labour ?? labourID),
          labour_rate: new FormControl(details.labour_rate),
          created_by: new FormControl(this.loggedInUserID),
        });
      },
      (err: HttpErrorResponse) => {
        console.log(err.error.message);
      }
    );
  }

  emptyErrors() {
    this.labourErr = '';
    this.labourRateErr = '';
  }

  saveLabourRates() {
    this.labourRateSrv.saveLabourRate(this.saveLabourRateForm.value).subscribe(
      (res: any) => {
        this.emptyErrors();
        this.saveMsg = res.message;
        this.labourRateLists = [];
        this.offset = 0;
        this.limit = 10;
        this.getLabourRates();
        this.setToastOpen(true);
        this.closeModal();
      },
      (err: HttpErrorResponse) => {
        this.emptyErrors();
        this.saveMsg = '';
        this.labourErr = err.error.errors.labour;
        this.labourRateErr = err.error.errors.labour_rate;
        this.saveMsg = err.error.message;
        this.setToastOpen(true);
      }
    );
  }

  infiniteScroll(ev: any) {
    this.getLabourRates();

    setTimeout(() => {
      (ev as InfiniteScrollCustomEvent).target.complete();
    }, 500);
  }
}
