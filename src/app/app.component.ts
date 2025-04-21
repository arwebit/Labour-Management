import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { App } from '@capacitor/app';
import { Platform, AlertController } from '@ionic/angular';
import { Location } from '@angular/common';
import { environment } from 'src/environments/environment';
import { VersionCheckService } from './shared/services/others/version-check.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {
  versionCheck: boolean = false;
  updateMessage: string = '';
  apkFile: string = '';
  @ViewChild('updateNotification') updateNotification: any;

  constructor(
    private versionCheckSrv: VersionCheckService,
    private platform: Platform,
    public alertController: AlertController,
    private router: Router,
    private _location: Location
  ) {
    this.initializeApp();
  }

  ngOnInit(): void {
    this.checkUpdate();
    this.notificationCheck();
  }

  notificationCheck() {
    App.addListener('appStateChange', (state) => {
      if (state.isActive) {
        this.checkUpdate();
      }
    });
  }

  async checkUpdate() {
    await this.versionCheckSrv.checkUpdate();
    if (this.versionCheckSrv.isVersionUpdate()) {
      this.updateMessage = this.versionCheckSrv.updateMessage;
      this.apkFile = this.versionCheckSrv.apkFile;
      this.versionCheck = true;
      if (this.versionCheck) {
        this.openModal();
      }
    }
  }
  async openModal() {
    const modalElement = this.updateNotification?.el;
    if (modalElement) {
      await modalElement.present();
    }
  }

  async closeModal() {
    const modalElement = this.updateNotification?.el;

    if (modalElement) {
      await modalElement.dismiss();
    }
  }
  update() {
    const link = `${environment.appLink}${this.apkFile}`;
    const anchor = document.createElement('a');
    anchor.href = link;
    anchor.download = this.apkFile;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  }

  close() {
    this.versionCheck = false;
    this.closeModal();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.backButton();
      if (environment.stayLogin) {
        this.checkLoginStatus();
      }
    });
  }

  backButton() {
    this.platform.backButton.subscribeWithPriority(10, () => {
      if (this._location.isCurrentPathEqualTo('/dashboard')) {
        this.showExitConfirm();
      } else {
        this._location.back();
      }
    });
  }

  async checkLoginStatus() {
    const token = localStorage.getItem('token');
    const userID = localStorage.getItem('user_id');

    let url: any = '/dashboard';

    if (token && userID) {
      this.router.navigateByUrl(url);
    } else {
      this.router.navigateByUrl('');
    }
  }

  async showExitConfirm() {
    const alert = await this.alertController.create({
      header: 'App termination',
      message: 'Do you want to logout?',
      backdropDismiss: false,
      buttons: [
        {
          text: 'No',
          role: 'cancel',
        },

        {
          text: 'Yes',
          handler: () => {
            localStorage.clear();
            this.router.navigate(['']);
          },
        },
      ],
    });
    await alert.present();
  }
}
