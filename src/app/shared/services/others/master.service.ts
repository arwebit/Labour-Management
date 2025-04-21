import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, take } from 'rxjs';
import { API_LINKS } from '../../apis';

@Injectable({
  providedIn: 'root',
})
export class MasterService {
  Authorization = `Bearer ${localStorage.getItem('token')}`;

  header = new HttpHeaders({
    Authorization: this.Authorization,
  });
  constructor(private http: HttpClient) {}

  getAllUserRoles(): Observable<any> {
    return this.http
      .get(API_LINKS.MASTER_ROLES_URL, { headers: this.header })
      .pipe(take(1));
  }

  getAllModuleAccess(): Observable<any> {
    return this.http
      .get(API_LINKS.MASTER_MODULES_ACCESS_URL, { headers: this.header })
      .pipe(take(1));
  }

  getAllGroupAccess(data: any): Observable<any> {
    return this.http
      .post(API_LINKS.MASTER_GROUP_ACCESS_URL, data, { headers: this.header })
      .pipe(take(1));
  }

  saveGroupAccess(data: any): Observable<any> {
    return this.http
      .put(API_LINKS.MASTER_GROUP_ACCESS_URL, data, { headers: this.header })
      .pipe(take(1));
  }
}
