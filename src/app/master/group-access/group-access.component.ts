import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { HelpersService } from 'src/app/shared/services/others/helpers.service';
import { UserService } from 'src/app/shared/services/users/user.service';

@Component({
  selector: 'app-group-access',
  standalone: false,
  templateUrl: './group-access.component.html',
  styleUrls: ['./group-access.component.scss'],
})
export class GroupAccessComponent {
  groupAccessForm!: FormGroup;
  userModuleAccess: number[] = [];
  loggedInUserID: any = localStorage.getItem('user_id');
  userRole: any = '';
  roleList: any = [];
  saveMsg: string = '';
  isToastOpen: boolean = false;
  groupAccessTable: boolean = false;
  moduleVal: any = [];
  groupModules: any = [];
  roleErr: string = '';
  modulesErr: string = '';
  roleID: any = '';

  constructor(
    private userSrv: UserService,
    private helperSrv: HelpersService,
    public alertController: AlertController
  ) {
    this.getRoles();
    this.initGroupAccessForm();
  }

  ionViewWillEnter(): void {
    this.getUserDetails();
    this.getRoles();
    this.initGroupAccessForm();
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

  getModules() {
    this.helperSrv.getAllModuleAccess().subscribe(
      (res: any) => {
        this.groupModules = res.rows;
      },
      (err: HttpErrorResponse) => {
        console.log(err.error.message);
      }
    );
  }

  getRoles() {
    this.helperSrv.getAllUserRoles().subscribe(
      (result: any) => {
        this.roleList = result.rows.filter((role: any) => role.role_id !== -1);
      },
      (err: HttpErrorResponse) => {
        console.log(err.error.message);
      }
    );
  }

  roleChange(event: Event) {
    const val = (<HTMLInputElement>event.target).value;

    if (val) {
      this.groupAccessTable = true;
      this.initGroupAccessForm(val);
      this.getGroupAccess(val);
      this.getModules();
    } else {
      this.groupAccessTable = false;
      this.moduleVal = [];
    }
  }
  getGroupAccess(roleID: any) {
    const data = {
      filter: {
        condition: [['role_id', '=', roleID]],
      },
    };
    this.helperSrv.getAllGroupAccess(data).subscribe(
      (res: any) => {
        const [details] = res.rows;
        this.moduleVal = details.module_access
          ? details.module_access.map((access: any) => access.module_access_id)
          : [];
      },
      (err: HttpErrorResponse) => {
        console.log(err.error.message);
      }
    );
  }
  getRows(modules: any[], columns: number) {
    return modules.reduce((acc, cur, i) => {
      if (i % columns === 0) acc.push([]);
      acc[acc.length - 1].push(cur);
      return acc;
    }, []);
  }

  toggleModule(module: any) {
    const index = this.moduleVal.indexOf(module.module_access_id);
    if (index === -1) {
      this.moduleVal.push(module.module_access_id);
    } else {
      this.moduleVal.splice(index, 1);
    }
  }

  getModuleValue(event: Event) {
    const val = (<HTMLInputElement>event.target).value;
    if ((<HTMLInputElement>event.target).checked) {
      this.moduleVal.push(val);
    } else {
      this.moduleVal = this.moduleVal.filter((module: any) => module !== val);
    }
  }

  setToastOpen(isOpen: boolean) {
    this.isToastOpen = isOpen;
  }

  initGroupAccessForm(roleID: any = '') {
    this.groupAccessForm = new FormGroup({
      role_id: new FormControl(roleID),
      updated_by: new FormControl(this.loggedInUserID),
    });
  }

  emptyErrors() {
    this.roleErr = '';
    this.modulesErr = '';
  }

  save() {
    this.groupAccessForm.value.module_access_id = this.moduleVal;

    this.helperSrv.saveGroupAccess(this.groupAccessForm.value).subscribe(
      (result: any) => {
        this.emptyErrors();
        this.saveMsg = result.message;
        this.setToastOpen(true);
      },
      (err: HttpErrorResponse) => {
        this.saveMsg = '';
        this.emptyErrors();
        this.roleErr = err.error.errors.role_id;
        this.modulesErr = err.error.errors.module_access_id;
        this.saveMsg = err.error.message;
        this.setToastOpen(true);
      }
    );
  }
}
