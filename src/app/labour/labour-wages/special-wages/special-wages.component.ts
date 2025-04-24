import { HttpErrorResponse } from '@angular/common/module.d-CnjH8Dlt';
import { Component, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { LabourAttendancesService } from 'src/app/shared/services/labour/labour-attendances.service';
import { LabourWagesService } from 'src/app/shared/services/labour/labour-wages.service';
import { LabourRatesService } from 'src/app/shared/services/master/labour-rates.service';
import { HelpersService } from 'src/app/shared/services/others/helpers.service';
import { UserService } from 'src/app/shared/services/users/user.service';

@Component({
  selector: 'app-special-wages',
  standalone: false,
  templateUrl: './special-wages.component.html',
  styleUrls: ['./special-wages.component.scss'],
})
export class SpecialWagesComponent {
  loggedInUserID: any = localStorage.getItem('user_id');
  userModuleAccess: number[] = [];
  userRole: any = '';
  labourName: string = '';
  labourID: string = '';
  labourRole: any = '';
  labourTotalPayment: number = 0;
  receipt: number = 0;
  payment: number = 0;
  currentDate: any = '';
  currentDateTime: any = '';
  addWageForm!: FormGroup;
  editWageForm!: FormGroup;
  labourLists: any = [];
  offset: number = 0;
  limit: number = 10;
  sortBy: string = 'spcl_wage_id';
  wages: boolean = false;
  sortType: any = -1;
  condition: any = [];
  saveMsg: string = '';
  isToastOpen: boolean = false;
  paymentLists: any = [];

  descriptionErr: string = '';
  paymentDateErr: string = '';
  paymentErr: string = '';
  paymentTypeErr: string = '';

  fromDate: any = '';
  toDate: any = '';

  @ViewChild('specialPaymentListModel') specialPaymentListModel: any;
  @ViewChild('editPaymentListModel') editPaymentListModel: any;

  constructor(
    public alertController: AlertController,
    private helperSrv: HelpersService,
    private userSrv: UserService,
    private spclWageSrv: LabourWagesService
  ) {
    this.getLabourRole();
    this.getCurrentDate();
    this.getUserDetails();
    this.emptyErrors();
    this.addWageFormInit();
    this.editWageFormInit();
    this.closeModal();
  }

  checkModalDismiss(event: any) {
    let retVal = false;
    if (event.detail.role === 'backdrop') {
      retVal = true;
    } else if (event.detail.role === 'gesture') {
      event.preventDefault();
      this.editPaymentListModel.setCurrentBreakpoint(1);
      this.specialPaymentListModel.setCurrentBreakpoint(1);
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
        this.getLabours(this.labourRole);
      },
      (err: HttpErrorResponse) => {
        console.log('Something went wrong');
      }
    );
  }
  async openModal(str: string, wagesID: any = '') {
    if (str === 'payment_list') {
      const normalPaymentListElement = this.specialPaymentListModel?.el;
      if (normalPaymentListElement) {
        await normalPaymentListElement.present();
      }
    } else {
      const editPaymentListElement = this.editPaymentListModel?.el;
      if (editPaymentListElement) {
        await editPaymentListElement.present();
        this.editWageFormInit(wagesID);
      }
    }
  }

  async closeModal() {
    const normalPaymentListElement = this.specialPaymentListModel?.el;
    const editPaymentListElement = this.editPaymentListModel?.el;
    if (normalPaymentListElement) {
      await normalPaymentListElement.dismiss();
    }
    if (editPaymentListElement) {
      await editPaymentListElement.dismiss();
    }
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

  duePending(labourTotalPayment: number) {
    let text = '';
    if (labourTotalPayment >= 0) {
      text = `Labour has due &#8377;${Math.abs(labourTotalPayment)}/-`;
    } else {
      text = `Labour has paid extra &#8377;${Math.abs(labourTotalPayment)}/-`;
    }
    return text;
  }

  getLabourName(labourID: any) {
    const postData = {
      filter: {
        condition: [['user_id', '=', labourID]],
      },
      start_row: 0,
      page_records: 1,
      sort_field: 'full_name',
      sort: -1,
    };

    this.userSrv.getUsers(postData).subscribe(
      (result: any) => {
        const [details] = result.rows;
        this.labourName = details.full_name;
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

    this.spclWageSrv.getLabourSpclWages(postData).subscribe(
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
      this.getLabourName(this.labourID);
      this.getLabourTotalPayment(this.labourID);
      this.getLabourPayment(this.labourID);
    } else {
      this.wages = false;
      this.payment = 0;
      this.receipt = 0;
    }
  }

  getLabourTotalPayment(userID: any, fromDate: any = '', toDate: any = '') {
    const postData = {
      labour: userID,
      from_date: fromDate,
      to_date: toDate,
    };

    this.spclWageSrv.getLabourSpecialTotalPayment(postData).subscribe(
      (result: any) => {
        this.labourTotalPayment = result.balance;
        this.payment = result.payment;
        this.receipt = result.receipt;
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
      payment_date: new FormControl(this.currentDate),
      payment: new FormControl(''),
      payment_type: new FormControl('advance'),
      description: new FormControl(''),
      created_by: new FormControl(this.loggedInUserID),
    });
  }

  editWageFormInit(wagesID: any = '') {
    this.editWageForm = new FormGroup({
      wage_id: new FormControl(wagesID),
      labour: new FormControl(this.labourID),
      payment_date: new FormControl(this.currentDate),
      payment: new FormControl(''),
      payment_type: new FormControl('advance'),
      description: new FormControl(''),
      updated_by: new FormControl(this.loggedInUserID),
    });

    const postData = {
      filter: {
        condition: [['spcl_wage_id', '=', wagesID]],
      },
      start: 0,
      page_records: 1,
      sort_field: 'spcl_wage_id',
      sort: -1,
    };
    this.spclWageSrv.getLabourSpclWages(postData).subscribe(
      (res: any) => {
        const [details] = res.rows;
        this.editWageForm = new FormGroup({
          wage_id: new FormControl(wagesID),
          labour: new FormControl(this.labourID),
          payment_date: new FormControl(details.payment_date),
          payment: new FormControl(details.payment),
          payment_type: new FormControl(details.payment_type),
          description: new FormControl(details.description),
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
    this.paymentErr = '';
    this.paymentTypeErr = '';
    this.descriptionErr = '';
  }

  savePayment() {
    this.spclWageSrv.createLabourSpclWage(this.addWageForm.value).subscribe(
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
        this.paymentErr = err.error.errors.payment;
        this.paymentTypeErr = err.error.errors.payment_type;
        this.descriptionErr = err.error.errors.description;
        this.saveMsg = err.error.message;
        this.setToastOpen(true);
      }
    );
  }

  updatePayment() {
    this.spclWageSrv
      .updateLabourSpclWage(
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
        },
        (err: HttpErrorResponse) => {
          this.emptyErrors();
          this.saveMsg = '';
          this.paymentDateErr = err.error.errors.payment_date;
          this.paymentErr = err.error.errors.payment;
          this.paymentTypeErr = err.error.errors.payment_type;
          this.descriptionErr = err.error.errors.description;
          this.saveMsg = err.error.message;
          this.setToastOpen(true);
        }
      );
  }
}
