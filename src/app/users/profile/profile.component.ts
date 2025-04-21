import { HttpErrorResponse } from '@angular/common/module.d-CnjH8Dlt';
import { Component } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/shared/services/users/user.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-profile',
  standalone: false,
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent {
  profileUpdateForm!: FormGroup;
  changePasswordForm!: FormGroup;
  userID: any = localStorage.getItem('user_id');
  nameErr: string = '';
  fullNameErr: string = '';
  userNameErr: string = '';
  mobileErr: string = '';
  emailErr: string = '';
  aadharNoErr: string = '';
  panNoErr: string = '';
  profilePicErr: string = '';
  profilePic!: File;
  saveMsg: string = '';
  oldPassErr: string = '';
  newPassErr: string = '';
  confirmPassErr: string = '';
  profileImg: string = '';
  isToastOpen: boolean = false;

  constructor(private userSrv: UserService, private router: Router) {
    this.initProfileForm();
    this.changePasswordFormInit();
    this.getProfileData();
  }

  getProfileData() {
    const data = {
      filter: {
        condition: [['user_id', '=', this.userID]],
      },
      start: 0,
      page_records: 5,
      sort_field: 'user_id',
      sort_type: -1,
    };
    this.userSrv.getUsers(data).subscribe(
      (res: any) => {
        const [details] = res.rows;
        if (details.profile_pic) {
          this.profileImg = `${environment.imageURL}/${details.profile_pic}`;
        } else {
          this.profileImg = '../../../assets/images/avatar.png';
        }

        this.profileUpdateForm = new FormGroup({
          full_name: new FormControl(details.full_name),
          email: new FormControl(details.email),
          username: new FormControl(details.username),
          mobile: new FormControl(details.mobile),
          aadhar_no: new FormControl(details.aadhar_no),
          is_active: new FormControl(details.is_active),
          pan_no: new FormControl(details.pan_no),
          updated_by: new FormControl(this.userID),
          user_role: new FormControl(details.user_role.role_id),
        });
      },
      (err: HttpErrorResponse) => {
        console.log(err.error.message);
      }
    );
  }

  uploadProfilePicture(event: any) {
    const propicFile = event.target.files ? event.target.files[0] : '';
    this.profilePic = propicFile;
    var proPicReader = new FileReader();
    proPicReader.onload = function (e: any) {
      var profileImg: any = document.getElementById('profileImg');
      profileImg.src = e.target.result;
    };
    proPicReader.readAsDataURL(event.target.files[0]);
  }

  initProfileForm() {
    this.profileUpdateForm = new FormGroup({
      full_name: new FormControl(''),
      email: new FormControl(''),
      username: new FormControl(''),
      mobile: new FormControl(''),
      aadhar_no: new FormControl(''),
      pan_no: new FormControl(''),
      is_active: new FormControl(''),
      updated_by: new FormControl(this.userID),
      user_role: new FormControl(''),
    });
  }

  changePasswordFormInit() {
    this.changePasswordForm = new FormGroup({
      old_password: new FormControl(''),
      new_password: new FormControl(''),
      confirm_password: new FormControl(''),
    });
  }
  setToastOpen(isOpen: boolean) {
    this.isToastOpen = isOpen;
  }

  emptyErrors() {
    this.nameErr = '';
    this.emailErr = '';
    this.mobileErr = '';
    this.panNoErr = '';
    this.userNameErr = '';
    this.profilePicErr = '';
    this.aadharNoErr = '';
  }
  emptyPassErrors() {
    this.oldPassErr = '';
    this.newPassErr = '';
    this.confirmPassErr = '';
  }

  save() {
    var sendData: any = new FormData();
    sendData.append('username', this.profileUpdateForm.value.username);
    sendData.append('email', this.profileUpdateForm.value.email);
    sendData.append('full_name', this.profileUpdateForm.value.full_name);
    sendData.append('mobile', this.profileUpdateForm.value.mobile);
    sendData.append('aadhar_no', this.profileUpdateForm.value.aadhar_no);
    sendData.append('pan_no', this.profileUpdateForm.value.pan_no);
    sendData.append('user_role', this.profileUpdateForm.value.user_role);
    sendData.append('updated_by', this.profileUpdateForm.value.updated_by);
    sendData.append('is_active', this.profileUpdateForm.value.is_active);
    sendData.append('profile_pic', this.profilePic ?? new File([], ''));

    this.userSrv.updateUser(sendData, this.userID).subscribe(
      (result: any) => {
        this.emptyErrors();
        this.saveMsg = 'Profile updated successfully';
        this.setToastOpen(true);
      },
      (err: HttpErrorResponse) => {
        this.saveMsg = '';
        this.emptyErrors();
        this.userNameErr = err.error.errors.username;
        this.nameErr = err.error.errors.full_name;
        this.emailErr = err.error.errors.email;
        this.mobileErr = err.error.errors.mobile;
        this.panNoErr = err.error.errors.pan_no;
        this.aadharNoErr = err.error.errors.aadhar_no;
        this.saveMsg = err.error.message;
        this.setToastOpen(true);
      }
    );
  }

  changePass() {
    this.userSrv
      .changePassword(this.changePasswordForm.value, this.userID)
      .subscribe(
        (result: any) => {
          this.emptyPassErrors();
          this.changePasswordForm.reset();
          this.saveMsg = result.message;
          this.setToastOpen(true);
        },
        (err: HttpErrorResponse) => {
          this.emptyPassErrors();
          this.saveMsg = err.error.message;
          this.setToastOpen(true);
          this.oldPassErr = err.error.errors.old_password;
          this.newPassErr = err.error.errors.new_password;
          this.confirmPassErr = err.error.errors.confirm_password;
        }
      );
  }
}
