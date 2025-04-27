import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { Injectable } from '@angular/core';
import { Observable, take } from 'rxjs';
import { API_LINKS } from '../apis';

@Injectable({
  providedIn: 'root',
})
export class ReportsService {
  Authorization = `Bearer ${localStorage.getItem('token')}`;

  header = new HttpHeaders({
    Authorization: this.Authorization,
  });
  constructor(private http: HttpClient) {}

  getLabourDetails(labourID: any): Observable<any> {
    const params = new HttpParams().set('labour', labourID);
    return this.http
      .get(API_LINKS.LABOUR_DETAILS_REPORT_URL, {
        params: params,
        headers: this.header,
      })
      .pipe(take(1));
  }

  getLabourAttendance(data: any): Observable<any> {
    return this.http
      .post(API_LINKS.LABOUR_ATTENDANCE_REPORT_URL, data, {
        headers: this.header,
      })
      .pipe(take(1));
  }

  getLabourNormalWages(data: any): Observable<any> {
    return this.http
      .post(API_LINKS.LABOUR_NORMAL_WAGES_REPORT_URL, data, {
        headers: this.header,
      })
      .pipe(take(1));
  }

  getLabourSpecialWages(data: any): Observable<any> {
    return this.http
      .post(API_LINKS.LABOUR_SPECIAL_WAGES_REPORT_URL, data, {
        headers: this.header,
      })
      .pipe(take(1));
  }
}
