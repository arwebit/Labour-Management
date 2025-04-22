import { HttpErrorResponse } from '@angular/common/module.d-CnjH8Dlt';
import { Component, ViewChild } from '@angular/core';
import { AlertController, InfiniteScrollCustomEvent } from '@ionic/angular';
import { UserService } from '../shared/services/users/user.service';
import { MasterService } from '../shared/services/others/master.service';
import { environment } from 'src/environments/environment';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-users',
  standalone: false,
  templateUrl: './users.page.html',
  styleUrls: ['./users.page.scss'],
})
export class UsersPage {
  addUserForm!: FormGroup;
  editUserForm!: FormGroup;
  userModuleAccess: number[] = [];
  loggedInUserID: any = localStorage.getItem('user_id');
  imageURL: string = '';
  defaultImageURL: string = '';
  userRole: any = '';
  userLists: any = [];
  offset: number = 0;
  limit: number = 10;
  loading: boolean = false;
  sortBy: string = 'full_name';
  sortType: any = -1;
  condition: any = [];
  filter: any = [];

  roleList: any = [];
  roleErr: string = '';
  nameErr: string = '';
  fullNameErr: string = '';
  userNameErr: string = '';
  mobileErr: string = '';
  emailErr: string = '';
  aadharNoErr: string = '';
  passwordErr: string = '';
  panNoErr: string = '';
  statusErr: string = '';
  profilePicErr: string = '';
  profilePic!: File;
  saveMsg: string = '';
  createProfileImage: string = '';
  editProfileImage: string = '';
  isToastOpen: boolean = false;

  @ViewChild('createUserModal') createUserModal: any;
  @ViewChild('editUserModal') editUserModal: any;

  constructor(
    private userSrv: UserService,
    private masterSrv: MasterService,
    public alertController: AlertController
  ) {
    this.getRoles();
  }

  ionViewWillEnter(): void {
    this.imageURL = environment.imageURL;
    this.defaultImageURL = '../../assets/images/avatar.png';
    this.getUserDetails();
    this.getProfileData();
    this.getUser(this.condition);
    this.addUserFormInit();
    this.editUserFormInit();
    this.closeModal();
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

  async openModal(str: string, userID: any = '') {
    this.emptyErrors();
    if (str === 'create') {
      const modalElement = this.createUserModal?.el;
      if (modalElement) {
        await modalElement.present();
      }
    } else {
      const modalElement = this.editUserModal?.el;
      if (modalElement) {
        await modalElement.present();
        this.editUserFormInit(userID);
      }
    }
  }

  async closeModal() {
    const modalElement1 = this.createUserModal?.el;
    const modalElement2 = this.editUserModal?.el;

    if (modalElement1) {
      await modalElement1.dismiss();
    }
    if (modalElement2) {
      await modalElement2.dismiss();
    }
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

  getRoles() {
    this.masterSrv.getAllUserRoles().subscribe(
      (result: any) => {
        this.filter = result.rows;
        this.roleList = result.rows;
      },
      (err: HttpErrorResponse) => {
        console.log(err.error.message);
      }
    );
  }

  filterRecords(value: any) {
    this.loading = false;
    this.userLists = [];
    this.condition = [];
    this.offset = 0;
    if (value) {
      this.condition.push(['user_role', '=', value]);
    } else {
      this.condition = [];
    }

    this.getUser(this.condition);
  }

  sort(value: any) {
    this.loading = false;
    this.userLists = [];
    switch (value) {
      case '1':
        this.sortBy = 'full_name';
        this.sortType = -1;
        this.limit = 10;
        this.offset = 0;
        break;
      case '2':
        this.sortBy = 'full_name';
        this.sortType = 1;
        this.limit = 10;
        this.offset = 0;
        break;
      default:
        this.sortBy = 'full_name';
        this.sortType = -1;
        this.limit = 10;
        this.offset = 0;
        break;
    }
    this.getUser(this.condition);
  }

  getUser(condition: any = []) {
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

    this.userSrv.getUsers(postData).subscribe(
      (result: any) => {
        this.userLists = [...this.userLists, ...result.rows];
        this.offset += this.limit;
        this.loading = false;
      },
      (err: HttpErrorResponse) => {
        console.log(err.error.message);
      }
    );
  }

  setToastOpen(isOpen: boolean) {
    this.isToastOpen = isOpen;
  }

  createUploadProfilePic(event: any) {
    const propicFile = event.target.files ? event.target.files[0] : '';
    this.profilePic = propicFile;
    var proPicReader = new FileReader();
    proPicReader.onload = function (e: any) {
      var createProfileImage: any =
        document.getElementById('createProfileImage');
      createProfileImage.src = e.target.result;
    };
    proPicReader.readAsDataURL(event.target.files[0]);
  }

  editUploadProfilePic(event: any) {
    const propicFile = event.target.files ? event.target.files[0] : '';
    this.profilePic = propicFile;
    var proPicReader = new FileReader();
    proPicReader.onload = function (e: any) {
      var editProfileImage: any = document.getElementById('editProfileImage');
      editProfileImage.src = e.target.result;
    };
    proPicReader.readAsDataURL(event.target.files[0]);
  }

  addUserFormInit() {
    this.addUserForm = new FormGroup({
      full_name: new FormControl(''),
      email: new FormControl(''),
      username: new FormControl(''),
      mobile: new FormControl(''),
      aadhar_no: new FormControl(''),
      pan_no: new FormControl(''),
      password: new FormControl(''),
      created_by: new FormControl(this.loggedInUserID),
      user_role: new FormControl(''),
    });
  }

  editUserFormInit(userID: any = '') {
    this.editUserForm = new FormGroup({
      user_id: new FormControl(userID),
      full_name: new FormControl(''),
      email: new FormControl(''),
      username: new FormControl(''),
      mobile: new FormControl(''),
      aadhar_no: new FormControl(''),
      pan_no: new FormControl(''),
      is_active: new FormControl(''),
      updated_by: new FormControl(this.loggedInUserID),
      user_role: new FormControl(''),
    });
    this.getProfileData(userID);
  }

  getProfileData(userID: any = '') {
    const data = {
      filter: {
        condition: [['user_id', '=', userID]],
      },
      start: 0,
      page_records: 1,
      sort_field: 'user_id',
      sort_type: -1,
    };
    this.userSrv.getUsers(data).subscribe(
      (res: any) => {
        const [details] = res.rows;

        if (details.profile_pic) {
          this.editProfileImage = `${environment.imageURL}/${details.profile_pic}`;
        } else {
          this.editProfileImage = '../../assets/images/avatar.png';
        }

        this.editUserForm = new FormGroup({
          user_id: new FormControl(userID),
          full_name: new FormControl(details.full_name),
          email: new FormControl(details.email),
          username: new FormControl(details.username),
          mobile: new FormControl(details.mobile),
          aadhar_no: new FormControl(details.aadhar_no),
          is_active: new FormControl(details.is_active),
          pan_no: new FormControl(details.pan_no),
          updated_by: new FormControl(this.loggedInUserID),
          user_role: new FormControl(details.user_role.role_id),
        });
      },
      (err: HttpErrorResponse) => {
        console.log(err.error.message);
      }
    );
  }

  emptyErrors() {
    this.roleErr = '';
    this.nameErr = '';
    this.emailErr = '';
    this.mobileErr = '';
    this.panNoErr = '';
    this.passwordErr = '';
    this.profilePicErr = '';
    this.userNameErr = '';
    this.aadharNoErr = '';
  }

  saveUser() {
    var sendData: any = new FormData();
    sendData.append('username', this.addUserForm.value.username);
    sendData.append('email', this.addUserForm.value.email);
    sendData.append('full_name', this.addUserForm.value.full_name);
    sendData.append('mobile', this.addUserForm.value.mobile);
    sendData.append('aadhar_no', this.addUserForm.value.aadhar_no);
    sendData.append('pan_no', this.addUserForm.value.pan_no);
    sendData.append('user_role', this.addUserForm.value.user_role);
    sendData.append('password', this.addUserForm.value.password);
    sendData.append('created_by', this.addUserForm.value.created_by);
    sendData.append('profile_pic', this.profilePic ?? new File([], ''));

    this.userSrv.addUser(sendData).subscribe(
      (result: any) => {
        this.saveMsg = '';
        this.emptyErrors();
        this.offset = 0;
        this.limit = 10;
        this.userLists = [];
        this.saveMsg = result.message;
        this.setToastOpen(true);
        this.addUserForm.reset();
        this.createProfileImage = '';
        this.getUser();
        this.closeModal();
      },
      (err: HttpErrorResponse) => {
        this.saveMsg = '';
        this.emptyErrors();
        this.nameErr = err.error.errors.full_name;
        this.roleErr = err.error.errors.user_role;
        this.emailErr = err.error.errors.email;
        this.userNameErr = err.error.errors.username;
        this.mobileErr = err.error.errors.mobile;
        this.panNoErr = err.error.errors.pan_no;
        this.aadharNoErr = err.error.errors.aadhar_no;
        this.passwordErr = err.error.errors.password;
        this.profilePicErr = err.error.errors.profile_pic;
        this.saveMsg = err.error.message;
        this.setToastOpen(true);
      }
    );
  }

  updateUser() {
    var sendData: any = new FormData();
    sendData.append('username', this.editUserForm.value.username);
    sendData.append('email', this.editUserForm.value.email);
    sendData.append('full_name', this.editUserForm.value.full_name);
    sendData.append('mobile', this.editUserForm.value.mobile);
    sendData.append('aadhar_no', this.editUserForm.value.aadhar_no);
    sendData.append('pan_no', this.editUserForm.value.pan_no);
    sendData.append('user_role', this.editUserForm.value.user_role);
    sendData.append('updated_by', this.editUserForm.value.updated_by);
    sendData.append('is_active', this.editUserForm.value.is_active);
    sendData.append('profile_pic', this.profilePic ?? new File([], ''));

    this.userSrv
      .updateUser(sendData, this.editUserForm.value.user_id)
      .subscribe(
        (result: any) => {
          this.saveMsg = '';
          this.emptyErrors();
          this.offset = 0;
          this.limit = 10;
          this.userLists = [];
          this.editProfileImage = '';
          this.saveMsg = result.message;
          this.setToastOpen(true);
          this.getUser();
          this.closeModal();
        },
        (err: HttpErrorResponse) => {
          this.saveMsg = '';
          this.emptyErrors();
          this.userNameErr = err.error.errors.username;
          this.nameErr = err.error.errors.full_name;
          this.emailErr = err.error.errors.email;
          this.mobileErr = err.error.errors.mobile;
          this.panNoErr = err.error.errors.pan_no;
          this.statusErr = err.error.errors.is_active;
          this.aadharNoErr = err.error.errors.aadhar_no;
          this.profilePicErr = err.error.errors.profile_pic;
          this.saveMsg = err.error.message;
          this.setToastOpen(true);
        }
      );
  }
  infiniteScroll(ev: any) {
    this.getUser();
    setTimeout(() => {
      (ev as InfiniteScrollCustomEvent).target.complete();
    }, 500);
  }
}
