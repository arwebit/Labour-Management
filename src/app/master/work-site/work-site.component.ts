import { HttpErrorResponse } from '@angular/common/module.d-CnjH8Dlt';
import { Component } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { AlertController, InfiniteScrollCustomEvent } from '@ionic/angular';
import { WorkSiteService } from 'src/app/shared/services/master/work-site.service';
import { UserService } from 'src/app/shared/services/users/user.service';

@Component({
  selector: 'app-work-site',
  standalone: false,
  templateUrl: './work-site.component.html',
  styleUrls: ['./work-site.component.scss'],
})
export class WorkSiteComponent {
  loggedInUserID: any = localStorage.getItem('user_id');
  userModuleAccess: number[] = [];
  userRole: any = '';
  workSiteID: any = '';
  addWorkSiteForm!: FormGroup;
  editWorkSiteForm!: FormGroup;
  workSitesLists: any = [];
  offset: number = 0;
  limit: number = 10;
  loading: boolean = false;
  loader: boolean = false;
  sortBy: string = 'work_site_id';
  sortType: any = -1;
  condition: any = [];
  saveMsg: string = '';
  isToastOpen: boolean = false;
  workSiteNameErr: string = '';
  workSiteLocationErr: string = '';
  statusErr: string = '';

  showLists: boolean = true;
  entryForm: boolean = false;
  editForm: boolean = false;

  constructor(
    private userSrv: UserService,
    private workSiteSrv: WorkSiteService,
    private alertController: AlertController
  ) {
    this.addWorkSiteFormInit();
    this.editWorkSiteFormInit();
  }

  ionViewWillEnter(): void {
    this.getUserDetails();
    this.emptyErrors();
    this.addWorkSiteFormInit();
    this.editWorkSiteFormInit();
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

  toggleFormDiv(str: string, workSiteID: any = '') {
    this.emptyErrors();
    if (str === 'create') {
      this.showLists = false;
      this.entryForm = true;
      this.editForm = false;
    } else if (str === 'edit') {
      this.showLists = false;
      this.entryForm = false;
      this.editForm = true;
      this.getEditWorkSiteForm(workSiteID);
    } else {
      this.getWorkSites();
      this.showLists = true;
      this.entryForm = false;
      this.editForm = false;
    }
  }

  getWorkSites() {
    this.loader = true;

    if (this.loading) return;
    this.loading = true;

    const postData = {
      filter: {
        condition: this.condition,
      },
      start_row: this.offset,
      page_records: this.limit,
      sort_field: this.sortBy,
      sort: this.sortType,
    };

    this.workSiteSrv.getWorkSites(postData).subscribe((result: any) => {
      this.loader = false;
      this.workSitesLists = [...this.workSitesLists, ...result.rows];
      this.offset += this.limit;
      this.loading = false;
    });
  }

  sort(value: any) {
    this.loading = false;
    this.workSitesLists = [];
    switch (value) {
      case '1':
        this.sortBy = 'work_site_name';
        this.sortType = -1;
        this.limit = 10;
        this.offset = 0;
        break;
      case '2':
        this.sortBy = 'work_site_name';
        this.sortType = 1;
        this.limit = 10;
        this.offset = 0;
        break;
      default:
        this.sortBy = 'work_site_name';
        this.sortType = -1;
        this.limit = 10;
        this.offset = 0;
        break;
    }
    this.getWorkSites();
  }

  setToastOpen(isOpen: boolean) {
    this.isToastOpen = isOpen;
  }

  addWorkSiteFormInit() {
    this.addWorkSiteForm = new FormGroup({
      work_site_name: new FormControl(''),
      work_site_location: new FormControl(''),
      created_by: new FormControl(this.loggedInUserID),
    });
  }

  editWorkSiteFormInit(workSiteID: any = '') {
    this.editWorkSiteForm = new FormGroup({
      work_site_id: new FormControl(''),
      work_site_name: new FormControl(''),
      work_site_location: new FormControl(''),
      is_active: new FormControl(''),
      updated_by: new FormControl(this.loggedInUserID),
    });
    this.getEditWorkSiteForm(workSiteID);
  }

  getEditWorkSiteForm(workSiteID: any = '') {
    const postData = {
      filter: {
        condition: [['work_site_id', '=', workSiteID]],
      },
      start: 0,
      page_records: 1,
      sort_field: 'work_site_id',
      sort_type: -1,
    };

    this.workSiteSrv.getWorkSites(postData).subscribe(
      (res: any) => {
        const [details] = res.rows;
        this.editWorkSiteForm = new FormGroup({
          work_site_id: new FormControl(details.work_site_id),
          work_site_name: new FormControl(details.work_site_name),
          work_site_location: new FormControl(details.work_site_location),
          is_active: new FormControl(details.is_active),
          updated_by: new FormControl(this.loggedInUserID),
        });
      },
      (err: HttpErrorResponse) => {
        console.log(err.error.message);
      }
    );
  }

  emptyErrors() {
    this.workSiteNameErr = '';
    this.workSiteLocationErr = '';
    this.statusErr = '';
  }

  addWorkSites() {
    this.workSiteSrv.addWorkSite(this.addWorkSiteForm.value).subscribe(
      (res: any) => {
        this.emptyErrors();
        this.saveMsg = res.message;
        this.workSitesLists = [];
        this.offset = 0;
        this.limit = 10;
        this.getWorkSites();
        this.addWorkSiteFormInit();
        this.setToastOpen(true);
        this.showLists = true;
        this.entryForm = false;
        this.editForm = false;
      },
      (err: HttpErrorResponse) => {
        this.emptyErrors();
        this.saveMsg = '';
        this.workSiteNameErr = err.error.errors.work_site_name;
        this.workSiteLocationErr = err.error.errors.work_site_location;
        this.saveMsg = err.error.message;
        this.setToastOpen(true);
        this.showLists = false;
        this.entryForm = true;
        this.editForm = false;
      }
    );
  }

  updateWorkSites() {
    this.workSiteSrv
      .updateWorkSite(
        this.editWorkSiteForm.value,
        this.editWorkSiteForm.value.work_site_id
      )
      .subscribe(
        (res: any) => {
          this.emptyErrors();
          this.saveMsg = res.message;
          this.workSitesLists = [];
          this.offset = 0;
          this.limit = 10;
          this.getWorkSites();
          this.setToastOpen(true);
          this.entryForm = false;
          this.showLists = true;
          this.editForm = false;
        },
        (err: HttpErrorResponse) => {
          this.emptyErrors();
          this.saveMsg = '';
          this.workSiteNameErr = err.error.errors.work_site_name;
          this.workSiteLocationErr = err.error.errors.work_site_location;
          this.statusErr = err.error.errors.is_active;
          this.saveMsg = err.error.message;
          this.setToastOpen(true);
          this.entryForm = false;
          this.editForm == true;
          this.showLists = false;
        }
      );
  }

  infiniteScroll(ev: any) {
    this.getWorkSites();

    setTimeout(() => {
      (ev as InfiniteScrollCustomEvent).target.complete();
    }, 500);
  }
}
