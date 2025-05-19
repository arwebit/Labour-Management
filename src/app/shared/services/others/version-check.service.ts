import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
import { API_LINKS } from '../../apis';

@Injectable({
  providedIn: 'root',
})
export class VersionCheckService {
  versionUpdate: boolean = false;
  updateMessage: string = '';
  updateMandatory: string = '';
  apkFile: string = '';

  constructor(private http: HttpClient) {}

  async getUpdates(): Promise<any> {
    const data = {
      app_name: 'Labour',
    };
    return firstValueFrom(
      this.http.post(API_LINKS.VERSION_URL + '/latest', data)
    );
  }

  async checkUpdate() {
    try {
      const response = await this.getUpdates();
      if (response.rows.release_version !== environment.version) {
        this.versionUpdate = true;
        this.updateMessage = response.rows.release_message;
        this.updateMandatory = response.rows.is_update_mandatory;
        this.apkFile = response.rows.app_file;
      } else {
        this.versionUpdate = false;
      }
    } catch (error) {
      console.error('Error checking version:', error);
    }
  }

  isVersionUpdate() {
    return this.versionUpdate;
  }
}
