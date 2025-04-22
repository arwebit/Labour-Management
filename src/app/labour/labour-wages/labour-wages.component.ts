import { HttpErrorResponse } from '@angular/common/module.d-CnjH8Dlt';
import { Component, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { AlertController, InfiniteScrollCustomEvent } from '@ionic/angular';
import { LabourAttendancesService } from 'src/app/shared/services/labour/labour-attendances.service';
import { LabourWagesService } from 'src/app/shared/services/labour/labour-wages.service';
import { LabourRatesService } from 'src/app/shared/services/master/labour-rates.service';
import { WorkSiteService } from 'src/app/shared/services/master/work-site.service';
import { UserService } from 'src/app/shared/services/users/user.service';

@Component({
  selector: 'app-labour-wages',
  standalone: false,
  templateUrl: './labour-wages.component.html',
  styleUrls: ['./labour-wages.component.scss'],
})
export class LabourWagesComponent {
  loggedInUserID: any = localStorage.getItem('user_id');
  userModuleAccess: number[] = [];
  userRole: any = '';

  normalWageBtn: boolean = true;
  specialWageBtn: boolean = false;

  normalWageDiv: boolean = true;
  specialWageDiv: boolean = false;

  @ViewChild('normalPaymentListModel') normalPaymentListModel: any;
  @ViewChild('specialPaymentListModel') specialPaymentListModel: any;

  constructor(
    private userSrv: UserService,
    private alertController: AlertController
  ) {}

  toggleReportList(type: string) {
    if (type === 'normal-wage') {
      this.normalWageBtn = true;
      this.specialWageBtn = false;
      this.normalWageDiv = true;
      this.specialWageDiv = false;
    } else {
      this.normalWageBtn = false;
      this.specialWageBtn = true;
      this.normalWageDiv = false;
      this.specialWageDiv = true;
    }
  }

  ionViewWillEnter(): void {
    this.getUserDetails();
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
}
