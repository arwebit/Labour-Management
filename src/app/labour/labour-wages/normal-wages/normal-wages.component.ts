import { HttpErrorResponse } from '@angular/common/module.d-CnjH8Dlt';
import { Component, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { LabourAttendancesService } from 'src/app/shared/services/labour/labour-attendances.service';
import { LabourWagesService } from 'src/app/shared/services/labour/labour-wages.service';
import { LabourRatesService } from 'src/app/shared/services/master/labour-rates.service';
import { UserService } from 'src/app/shared/services/users/user.service';

@Component({
  selector: 'app-normal-wages',
  standalone: false,
  templateUrl: './normal-wages.component.html',
  styleUrls: ['./normal-wages.component.scss'],
})
export class NormalWagesComponent {
  loggedInUserID: any = localStorage.getItem('user_id');
  userModuleAccess: number[] = [];
  userRole: any = '';
  currentDate: any = '';
  currentDateTime: any = '';
  labourName: string = '';
  labourID: string = '';
  labourRole: any = 2;
  labourRate: number = 0;
  labourTotalPayment: number = 0;
  labourTotalWages: number = 0;
  addWageForm!: FormGroup;
  labourLists: any = [];
  offset: number = 0;
  limit: number = 10;
  sortBy: string = 'wages_id';
  wages: boolean = false;
  attendances: boolean = false;
  sortType: any = -1;
  condition: any = [];
  saveMsg: string = '';
  isToastOpen: boolean = false;
  attTable: boolean = false;
  attWagesLists: any = [];
  paymentLists: any = [];
  totalWages: number = 0;
  paymentDateErr: string = '';
  paidAmountErr: string = '';
  paymentTypeErr: string = '';

  fromDate: any = '';
  toDate: any = '';

  @ViewChild('normalPaymentListModel') normalPaymentListModel: any;

  constructor(
    public alertController: AlertController,
    private userSrv: UserService,
    private wageSrv: LabourWagesService,
    private attSrv: LabourAttendancesService,
    private rateSrv: LabourRatesService
  ) {
    this.labourRole = 2;

    this.getCurrentDate();
    this.getUserDetails();
    this.emptyErrors();
    this.getLabours();
    this.addWageFormInit();
    this.closeModal();
  }

  async openModal() {
    const normalPaymentListElement = this.normalPaymentListModel?.el;
    if (normalPaymentListElement) {
      await normalPaymentListElement.present();
    }
  }

  async closeModal() {
    const normalPaymentListElement = this.normalPaymentListModel?.el;
    if (normalPaymentListElement) {
      await normalPaymentListElement.dismiss();
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

  duePending(totalPayment: number, toPay: number) {
    let text = '';
    if (totalPayment > toPay) {
      text = `Labour has taken a advance of &#8377;${Math.abs(
        totalPayment - toPay
      )}`;
    } else {
      text = `Labour has due of &#8377;${Math.abs(totalPayment - toPay)}`;
    }
    return text;
  }

  getLabours() {
    const postData = {
      filter: {
        condition: [['user_role', '=', this.labourRole]],
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

  getLabourPayment(userID: any) {
    const postData = {
      filter: {
        condition: [['labour', '=', userID]],
      },
      start_row: 0,
      page_records: 1000000,
      sort_field: 'payment_date',
      sort: -1,
    };

    this.wageSrv.getLabourWages(postData).subscribe(
      (result: any) => {
        this.paymentLists = result.rows;
      },
      (err: HttpErrorResponse) => {
        console.log('Something went wrong');
      }
    );
  }

  getUserPerformanceDetails(event: Event) {
    this.labourID = (<HTMLInputElement>event.target).value;
    if (this.labourID) {
      this.wages = true;
      this.attendances = true;
      this.getLabourRates(this.labourID);
      this.getLabourAttendances(this.labourID);
      this.getLabourTotalPayment(this.labourID);
      this.getLabourPayment(this.labourID);
    } else {
      this.wages = false;
      this.attendances = false;
      this.labourRate = 0;
      this.labourTotalPayment = 0;
      this.labourTotalWages = 0;
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

  getLabourTotalPayment(
    loggedInUserID: any,
    fromDate: any = '',
    toDate: any = ''
  ) {
    const postData = {
      labour: loggedInUserID,
      from_date: fromDate,
      to_date: toDate,
    };

    this.wageSrv.getLabourNormalTotalPayment(postData).subscribe(
      (result: any) => {
        this.labourTotalPayment = result.total_payment;
      },
      (err: HttpErrorResponse) => {
        console.log('Something went wrong');
      }
    );
  }
  getLabourAttendances(
    loggedInUserID: any,
    fromDate: any = '',
    toDate: any = ''
  ) {
    const postData = {
      labour: loggedInUserID,
      from_date: fromDate,
      to_date: toDate,
    };

    this.attSrv.getNoOfWages(postData).subscribe(
      (result: any) => {
        this.labourTotalWages = result.total_wages;
      },
      (err: HttpErrorResponse) => {
        console.log('Something went wrong');
      }
    );
  }

  getLabourRates(loggedInUserID: any) {
    const postData = {
      filter: {
        condition: [['user_details.user_id', '=', loggedInUserID]],
      },
      start_row: 0,
      page_records: 1,
      sort_field: 'full_name',
      sort: -1,
    };

    this.rateSrv.getLabourRates(postData).subscribe(
      (result: any) => {
        const [details] = result.rows;
        this.labourRate = details.labour_rate;
        this.labourName = details.full_name;
      },
      (err: HttpErrorResponse) => {
        console.log('Something went wrong');
      }
    );
  }

  setToastOpen(isOpen: boolean) {
    this.isToastOpen = isOpen;
  }

  addWageFormInit() {
    this.addWageForm = new FormGroup({
      labour: new FormControl(this.labourID),
      payment_date: new FormControl(''),
      paid_amount: new FormControl(''),
      payment_type: new FormControl('weekly'),
      created_by: new FormControl(this.loggedInUserID),
    });
  }

  emptyErrors() {
    this.paymentDateErr = '';
    this.paidAmountErr = '';
    this.paymentTypeErr = '';
  }

  save() {
    this.wageSrv.createLabourWage(this.addWageForm.value).subscribe(
      (res: any) => {
        this.emptyErrors();
        this.saveMsg = '';
        const data = {
          target: {
            value: this.addWageForm.value.labour,
          },
        } as unknown as Event;
        this.getUserPerformanceDetails(data);
        this.addWageFormInit();
        this.saveMsg = res.message;
        this.setToastOpen(true);
      },
      (err: HttpErrorResponse) => {
        this.emptyErrors();
        this.saveMsg = '';
        this.paymentDateErr = err.error.errors.payment_date;
        this.paidAmountErr = err.error.errors.paid_amount;
        this.paymentTypeErr = err.error.errors.payment_type;
        this.saveMsg = err.error.message;
        this.setToastOpen(true);
      }
    );
  }
}
