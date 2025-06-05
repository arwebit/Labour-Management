import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, take } from 'rxjs';
import { API_LINKS } from '../../apis';

@Injectable({
  providedIn: 'root',
})
export class LabourAttendancesService {
  Authorization = `Bearer ${localStorage.getItem('token')}`;

  header = new HttpHeaders({
    Authorization: this.Authorization,
  });
  constructor(private http: HttpClient) {}

  getAllLabourAttendances(): Observable<any> {
    return this.http
      .get(API_LINKS.LABOUR_ATTENDANCE_URL, { headers: this.header })
      .pipe(take(1));
  }

  getLabourAttendances(data: any): Observable<any> {
    return this.http
      .post(API_LINKS.LABOUR_ATTENDANCE_URL, data, { headers: this.header })
      .pipe(take(1));
  }

  getNoOfWages(data: any): Observable<any> {
    return this.http
      .post(API_LINKS.LABOUR_ATTENDANCE_URL + '/no-of-wages', data, {
        headers: this.header,
      })
      .pipe(take(1));
  }

  getNoOfWagesWithRates(data: any): Observable<any> {
    return this.http
      .post(API_LINKS.LABOUR_ATTENDANCE_URL + '/no-of-wages-rate', data, {
        headers: this.header,
      })
      .pipe(take(1));
  }

  getLabourListBasedOnCurrentAttendance(data: any): Observable<any> {
    return this.http
      .post(API_LINKS.LABOUR_ATTENDANCE_URL + '/labour-list', data, {
        headers: this.header,
      })
      .pipe(take(1));
  }
  getCurrentAttandance(data: any): Observable<any> {
    return this.http
      .post(API_LINKS.LABOUR_ATTENDANCE_URL + '/current-attendance', data, {
        headers: this.header,
      })
      .pipe(take(1));
  }

  checkIn(data: any): Observable<any> {
    return this.http
      .post(API_LINKS.LABOUR_ATTENDANCE_URL + '/add', data, {
        headers: this.header,
      })
      .pipe(take(1));
  }

  checkOut(data: any, attendanceID: any): Observable<any> {
    const params = new HttpParams().set('attendance_id', attendanceID);
    return this.http
      .put(API_LINKS.LABOUR_ATTENDANCE_URL, data, {
        params: params,
        headers: this.header,
      })
      .pipe(take(1));
  }

  manageLabourAttendance(data: any, attendanceID: any = ''): Observable<any> {
    const params = new HttpParams().set('attendance_id', attendanceID);
    return this.http
      .post(API_LINKS.LABOUR_ATTENDANCE_URL + '/manage', data, {
        params: params,
        headers: this.header,
      })
      .pipe(take(1));
  }

  deleteLabourAttendance(attendanceID: any): Observable<any> {
    const params = new HttpParams().set('attendance_id', attendanceID);
    return this.http
      .delete(API_LINKS.LABOUR_ATTENDANCE_URL + '/manage', {
        params: params,
        headers: this.header,
      })
      .pipe(take(1));
  }
}
