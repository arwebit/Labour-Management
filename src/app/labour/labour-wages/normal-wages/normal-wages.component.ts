import { HttpErrorResponse } from '@angular/common/module.d-CnjH8Dlt';
import { Component } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { LabourAttendancesService } from 'src/app/shared/services/labour/labour-attendances.service';
import { LabourWagesService } from 'src/app/shared/services/labour/labour-wages.service';
import { HelpersService } from 'src/app/shared/services/others/helpers.service';
import { UserService } from 'src/app/shared/services/users/user.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-normal-wages',
  standalone: false,
  templateUrl: './normal-wages.component.html',
  styleUrls: ['./normal-wages.component.scss'],
})
export class NormalWagesComponent {
  env: any = environment.module_access;
  loggedInUserID: any = localStorage.getItem('user_id');
  userModuleAccess: number[] = [];
  userRole: any = '';
  editWageForm!: FormGroup;
  currentDate: any = '';
  currentDateTime: any = '';
  labourRate: any = [];
  labourName: string = '';
  labourID: string = '';
  labourRole: any = '';
  labourTotalPayment: number = 0;
  labourTotalAmount: number = 0;
  labourTotalAttendance: number = 0;
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

  paymentDateErr: string = '';
  paidAmountErr: string = '';
  paymentTypeErr: string = '';

  fromDate: any = '';
  toDate: any = '';

  info: string = '';
  addPaymentFormDiv: boolean = true;
  paymentListDiv: boolean = false;
  editPaymentListDiv: boolean = false;

  constructor(
    public alertController: AlertController,
    private helperSrv: HelpersService,
    private userSrv: UserService,
    private wageSrv: LabourWagesService,
    private attSrv: LabourAttendancesService
  ) {
    this.info = 'Payment List';
    this.getCurrentDate();
    this.getUserDetails();
    this.emptyErrors();
    this.getLabourRole();
    this.addWageFormInit();
    this.editWageFormInit();
  }

  toggleDiv(str: string, wagesID = '') {
    if (str === 'Payment List') {
      this.paymentListDiv = true;
      this.addPaymentFormDiv = false;
      this.editPaymentListDiv = false;
      this.info = 'Add Payment';
    } else if (str === 'Add Payment') {
      this.paymentListDiv = false;
      this.addPaymentFormDiv = true;
      this.editPaymentListDiv = false;
      this.info = 'Payment List';
    } else {
      this.paymentListDiv = false;
      this.addPaymentFormDiv = false;
      this.editPaymentListDiv = true;
      this.info = 'Add Payment';
      this.editWageFormInit(wagesID);
    }
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
      )}/-`;
    } else {
      text = `Labour has due of &#8377;${Math.abs(totalPayment - toPay)}/-`;
    }
    return text;
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

  getLabourPayment(userID: any) {
    const postData = {
      filter: {
        condition: [['labour', '=', userID]],
      },
      start_row: 0,
      page_records: 10,
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
      this.getNoOfWagesWithRates(this.labourID);
      this.getLabourTotalPayment(this.labourID);
      this.getLabourPayment(this.labourID);
    } else {
      this.wages = false;
      this.attendances = false;
      this.labourRate = 0;
      this.labourTotalPayment = 0;
      this.labourTotalAmount = 0;
    }
  }

  getNoOfWagesWithRates(userID: any, fromDate: any = '', toDate: any = '') {
    const postData = {
      labour: userID,
      from_date: fromDate,
      to_date: toDate,
    };

    this.attSrv.getNoOfWagesWithRates(postData).subscribe(
      (result: any) => {
        this.labourName = result.labour.full_name;
        this.labourTotalAttendance = result.total_attendance;
        this.labourTotalAmount = result.total_amount;
        this.labourRate = result.rows;
      },
      (err: HttpErrorResponse) => {
        console.log('Something went wrong');
      }
    );
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

  editWageFormInit(wagesID: any = '') {
    this.editWageForm = new FormGroup({
      wage_id: new FormControl(wagesID),
      labour: new FormControl(this.labourID),
      payment_date: new FormControl(''),
      paid_amount: new FormControl(''),
      payment_type: new FormControl('weekly'),
      updated_by: new FormControl(this.loggedInUserID),
    });

    const postData = {
      filter: {
        condition: [['wages_id', '=', wagesID]],
      },
      start: 0,
      page_records: 1,
      sort_field: 'wages_id',
      sort: -1,
    };
    this.wageSrv.getLabourWages(postData).subscribe(
      (res: any) => {
        const [details] = res.rows;
        this.editWageForm = new FormGroup({
          wage_id: new FormControl(wagesID),
          labour: new FormControl(this.labourID),
          payment_date: new FormControl(details.payment_date),
          paid_amount: new FormControl(details.paid_amount),
          payment_type: new FormControl(details.payment_type),
          updated_by: new FormControl(this.loggedInUserID),
        });
      },
      (err: HttpErrorResponse) => {
        console.log('Something went wrong');
      }
    );
  }

  emptyErrors() {
    this.paymentDateErr = '';
    this.paidAmountErr = '';
    this.paymentTypeErr = '';
  }

  savePayment() {
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
        this.paymentListDiv = true;
        this.addPaymentFormDiv = false;
        this.editPaymentListDiv = false;
      },
      (err: HttpErrorResponse) => {
        this.emptyErrors();
        this.saveMsg = '';
        this.paymentDateErr = err.error.errors.payment_date;
        this.paidAmountErr = err.error.errors.paid_amount;
        this.paymentTypeErr = err.error.errors.payment_type;
        this.saveMsg = err.error.message;
        this.setToastOpen(true);
        this.paymentListDiv = false;
        this.addPaymentFormDiv = true;
        this.editPaymentListDiv = false;
      }
    );
  }

  updatePayment() {
    this.wageSrv
      .updateLabourWage(
        this.editWageForm.value,
        this.editWageForm.value.wage_id
      )
      .subscribe(
        (res: any) => {
          this.emptyErrors();
          this.saveMsg = '';
          const data = {
            target: {
              value: this.editWageForm.value.labour,
            },
          } as unknown as Event;
          this.getUserPerformanceDetails(data);
          this.saveMsg = res.message;
          this.setToastOpen(true);
          this.paymentListDiv = true;
          this.addPaymentFormDiv = false;
          this.editPaymentListDiv = false;
        },
        (err: HttpErrorResponse) => {
          this.emptyErrors();
          this.saveMsg = '';
          this.paymentDateErr = err.error.errors.payment_date;
          this.paidAmountErr = err.error.errors.paid_amount;
          this.paymentTypeErr = err.error.errors.payment_type;
          this.saveMsg = err.error.message;
          this.setToastOpen(true);
          this.paymentListDiv = false;
          this.addPaymentFormDiv = false;
          this.editPaymentListDiv = true;
        }
      );
  }
}
