import { HttpErrorResponse } from '@angular/common/module.d-CnjH8Dlt';
import { Component } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { AlertController, InfiniteScrollCustomEvent } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { UserService } from '../shared/services/users/user.service';
import { MachineService } from '../shared/services/machine/machine.service';
import { WorkSiteService } from '../shared/services/master/work-site.service';

@Component({
  selector: 'app-machines',
  standalone: false,
  templateUrl: './machines.page.html',
  styleUrls: ['./machines.page.scss'],
})
export class MachinesPage {
  env: any = environment.module_access;
  loggedInUserID: any = localStorage.getItem('user_id');
  userModuleAccess: number[] = [];
  userRole: any = '';
  machineID: any = '';
  sourceWorkSiteList: any = [];
  destinationWorkSiteList: any = [];
  saveMachineForm!: FormGroup;
  transferForm!: FormGroup;
  machinesLists: any = [];
  offset: number = 0;
  limit: number = 10;
  loading: boolean = false;
  loader: boolean = false;
  sortBy: string = 'work_site_id';
  sortType: any = -1;
  condition: any = [];
  saveMsg: string = '';
  isToastOpen: boolean = false;
  filterWorkSite: string = '';
  sourceWorkSiteErr: string = '';
  destinationWorkSiteErr: string = '';
  cuttingMachineErr: string = '';
  grinderMachineErr: string = '';
  handMachineErr: string = '';
  polishMachineErr: string = '';
  aluminiumChannelErr: string = '';
  matamErr: string = '';

  showLists: boolean = true;
  saveMachineFormDiv: boolean = false;
  transferFormFormDiv: boolean = false;

  constructor(
    private userSrv: UserService,
    private machineSrv: MachineService,
    private workSiteSrv: WorkSiteService,
    private alertController: AlertController
  ) {
    this.saveMachineFormDivInit();
    this.transferMachineFormDivInit();
  }

  ionViewWillEnter(): void {
    this.getUserDetails();
    this.emptyErrors();
    this.getWorkSites();
    this.saveMachineFormDivInit();
    this.transferMachineFormDivInit();
    this.getMachines();
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
    if (str === 'transfer') {
      this.showLists = false;
      this.saveMachineFormDiv = false;
      this.transferFormFormDiv = true;
    } else if (str === 'save') {
      this.showLists = false;
      this.saveMachineFormDiv = true;
      this.transferFormFormDiv = false;
      this.saveMachineFormDivInit(workSiteID);
    } else {
      this.getMachines();
      this.showLists = true;
      this.transferFormFormDiv = false;
      this.saveMachineFormDiv = false;
    }
  }

  getWorkSites() {
    this.workSiteSrv.getAllWorkSites().subscribe(
      (res: any) => {
        this.sourceWorkSiteList = res.rows;
        this.destinationWorkSiteList = res.rows;
      },
      (err: HttpErrorResponse) => {
        console.log('Something went wrong');
      }
    );
  }

  getMachines(condition: any = []) {
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

    this.machineSrv.getMachines(postData).subscribe((result: any) => {
      this.loader = false;
      this.machinesLists = [...this.machinesLists, ...result.rows];
      this.offset += this.limit;
      this.loading = false;
    });
  }

  setToastOpen(isOpen: boolean) {
    this.isToastOpen = isOpen;
  }

  saveMachineFormDivInit(workSiteID: any = '') {
    this.saveMachineForm = new FormGroup({
      work_site_name: new FormControl(''),
      work_site: new FormControl(''),
      no_of_cutting_machine: new FormControl(''),
      no_of_grinder_machine: new FormControl(''),
      no_of_polish_machine: new FormControl(''),
      no_of_hand_machine: new FormControl(''),
      no_of_aluminium_channel: new FormControl(''),
      no_of_matam: new FormControl(''),
      created_by: new FormControl(this.loggedInUserID),
    });
    this.getMachineForm(workSiteID);
  }

  transferMachineFormDivInit() {
    this.transferForm = new FormGroup({
      source_work_site: new FormControl(''),
      destination_work_site: new FormControl(''),
      no_of_cutting_machine: new FormControl('0'),
      no_of_grinder_machine: new FormControl('0'),
      no_of_polish_machine: new FormControl('0'),
      no_of_hand_machine: new FormControl('0'),
      no_of_aluminium_channel: new FormControl('0'),
      no_of_matam: new FormControl('0'),
      transfered_by: new FormControl(this.loggedInUserID),
    });
  }

  getMachineForm(workSiteID: any) {
    const postData = {
      filter: {
        condition: [['work_site_id', '=', workSiteID]],
      },
      start: 0,
      page_records: 1,
      sort_field: 'work_site_id',
      sort_type: -1,
    };

    this.machineSrv.getMachines(postData).subscribe(
      (res: any) => {
        const [details] = res.rows;
        this.saveMachineForm = new FormGroup({
          work_site_name: new FormControl(details?.work_site_name),
          work_site: new FormControl(workSiteID),
          no_of_cutting_machine: new FormControl(
            details.machines?.no_of_cutting_machine ?? 0
          ),
          no_of_grinder_machine: new FormControl(
            details.machines?.no_of_grinder_machine ?? 0
          ),
          no_of_polish_machine: new FormControl(
            details.machines?.no_of_polish_machine ?? 0
          ),
          no_of_hand_machine: new FormControl(
            details.machines?.no_of_hand_machine ?? 0
          ),
          no_of_aluminium_channel: new FormControl(
            details.machines?.no_of_aluminium_channel ?? 0
          ),
          no_of_matam: new FormControl(details.machines?.no_of_matam ?? 0),
          created_by: new FormControl(this.loggedInUserID),
        });
      },
      (err: HttpErrorResponse) => {
        console.log(err.error.message);
      }
    );
  }

  emptyErrors() {
    this.sourceWorkSiteErr = '';
    this.destinationWorkSiteErr = '';
    this.cuttingMachineErr = '';
    this.grinderMachineErr = '';
    this.handMachineErr = '';
    this.polishMachineErr = '';
    this.aluminiumChannelErr = '';
    this.matamErr = '';
  }

  saveMachine() {
    this.machineSrv.saveMachine(this.saveMachineForm.value).subscribe(
      (res: any) => {
        this.emptyErrors();
        this.saveMsg = res.message;
        this.machinesLists = [];
        this.offset = 0;
        this.limit = 10;
        this.getMachines();
        this.setToastOpen(true);
        this.showLists = true;
        this.saveMachineFormDiv = false;
        this.transferFormFormDiv = false;
      },
      (err: HttpErrorResponse) => {
        this.emptyErrors();
        this.saveMsg = '';

        this.sourceWorkSiteErr = err.error.errors.work_site_name;
        this.cuttingMachineErr = err.error.errors.no_of_cutting_machine;
        this.grinderMachineErr = err.error.errors.no_of_grinder_machine;
        this.polishMachineErr = err.error.errors.no_of_polish_machine;
        this.handMachineErr = err.error.errors.no_of_hand_machine;
        this.aluminiumChannelErr = err.error.errors.no_of_aluminium_channel;
        this.matamErr = err.error.errors.no_of_matam;

        this.saveMsg = err.error.message;
        this.setToastOpen(true);
        this.showLists = false;
        this.saveMachineFormDiv = true;
        this.transferFormFormDiv = false;
      }
    );
  }

  transferMachine() {
    const promt = confirm(
      'Are you sure you want to transfer? This cannot be undone'
    );
    if (promt) {
      this.machineSrv.transferMachine(this.transferForm.value).subscribe(
        (res: any) => {
          this.emptyErrors();
          this.saveMsg = res.message;
          this.machinesLists = [];
          this.offset = 0;
          this.limit = 10;
          this.getMachines();
          this.setToastOpen(true);
          this.showLists = true;
          this.saveMachineFormDiv = false;
          this.transferFormFormDiv = false;
        },
        (err: HttpErrorResponse) => {
          this.emptyErrors();
          this.saveMsg = '';

          this.sourceWorkSiteErr = err.error.errors.source_work_site;
          this.destinationWorkSiteErr = err.error.errors.destination_work_site;
          this.cuttingMachineErr = err.error.errors.no_of_cutting_machine;
          this.grinderMachineErr = err.error.errors.no_of_grinder_machine;
          this.polishMachineErr = err.error.errors.no_of_polish_machine;
          this.handMachineErr = err.error.errors.no_of_hand_machine;
          this.aluminiumChannelErr = err.error.errors.no_of_aluminium_channel;
          this.matamErr = err.error.errors.no_of_matam;

          this.saveMsg = err.error.message;
          this.setToastOpen(true);
          this.showLists = false;
          this.saveMachineFormDiv = false;
          this.transferFormFormDiv = true;
        }
      );
    }
  }
  infiniteScroll(ev: any) {
    this.getMachines(this.condition);

    setTimeout(() => {
      (ev as InfiniteScrollCustomEvent).target.complete();
    }, 500);
  }
}
