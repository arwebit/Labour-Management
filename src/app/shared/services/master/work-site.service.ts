import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, take } from 'rxjs';
import { API_LINKS } from '../../apis';

@Injectable({
  providedIn: 'root',
})
export class WorkSiteService {
  Authorization = `Bearer ${localStorage.getItem('token')}`;

  header = new HttpHeaders({
    Authorization: this.Authorization,
  });
  constructor(private http: HttpClient) {}

  getAllWorkSites(): Observable<any> {
    return this.http
      .get(API_LINKS.WORK_SITE_URL, { headers: this.header })
      .pipe(take(1));
  }
  getWorkSites(data: any): Observable<any> {
    return this.http
      .post(API_LINKS.WORK_SITE_URL, data, { headers: this.header })
      .pipe(take(1));
  }
  addWorkSite(data: any): Observable<any> {
    return this.http
      .post(API_LINKS.WORK_SITE_URL + '/add', data, { headers: this.header })
      .pipe(take(1));
  }

  updateWorkSite(data: any, workSiteID: any): Observable<any> {
    const params = new HttpParams().set('work_site_id', workSiteID);
    return this.http
      .put(API_LINKS.WORK_SITE_URL, data, {
        params: params,
        headers: this.header,
      })
      .pipe(take(1));
  }

  deleteWorkSite(workSiteID: any): Observable<any> {
    const params = new HttpParams().set('work_site_id', workSiteID);
    return this.http
      .delete(API_LINKS.WORK_SITE_URL, { params: params, headers: this.header })
      .pipe(take(1));
  }
}
