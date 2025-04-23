import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, take } from 'rxjs';
import { API_LINKS } from '../../apis';

@Injectable({
  providedIn: 'root',
})
export class LabourWagesService {
  Authorization = `Bearer ${localStorage.getItem('token')}`;

  header = new HttpHeaders({
    Authorization: this.Authorization,
  });

  constructor(private http: HttpClient) {}

  /******************************* LABOUR NORMAL WAGES *******************************/

  getAllLabourWages(): Observable<any> {
    return this.http
      .get(API_LINKS.LABOUR_WAGES_URL, { headers: this.header })
      .pipe(take(1));
  }
  getLabourWages(data: any): Observable<any> {
    return this.http
      .post(API_LINKS.LABOUR_WAGES_URL, data, { headers: this.header })
      .pipe(take(1));
  }
  getLabourNormalTotalPayment(data: any): Observable<any> {
    return this.http
      .post(API_LINKS.LABOUR_WAGES_URL + '/total-payment', data, {
        headers: this.header,
      })
      .pipe(take(1));
  }
  createLabourWage(data: any): Observable<any> {
    return this.http
      .post(API_LINKS.LABOUR_WAGES_URL + '/add', data, {
        headers: this.header,
      })
      .pipe(take(1));
  }

  updateLabourWage(data: any, wageID: any): Observable<any> {
    const params = new HttpParams().set('wages_id', wageID);
    return this.http
      .put(API_LINKS.LABOUR_WAGES_URL, data, {
        headers: this.header,
        params: params,
      })
      .pipe(take(1));
  }

  acceptLabourWage(data: any, wageID: any): Observable<any> {
    const params = new HttpParams().set('wages_id', wageID);
    return this.http
      .put(API_LINKS.LABOUR_WAGES_URL + '/accept', data, {
        headers: this.header,
        params: params,
      })
      .pipe(take(1));
  }

  deleteLabourWage(wageID: any): Observable<any> {
    const params = new HttpParams().set('wages_id', wageID);
    return this.http
      .delete(API_LINKS.LABOUR_WAGES_URL, {
        params: params,
        headers: this.header,
      })
      .pipe(take(1));
  }

  /******************************* LABOUR NORMAL WAGES *******************************/

  /******************************* LABOUR SPECIAL WAGES *******************************/

  getAllLabourSpclWages(): Observable<any> {
    return this.http
      .get(API_LINKS.LABOUR_SPCL_WAGES_URL, { headers: this.header })
      .pipe(take(1));
  }
  getLabourSpclWages(data: any): Observable<any> {
    return this.http
      .post(API_LINKS.LABOUR_SPCL_WAGES_URL, data, { headers: this.header })
      .pipe(take(1));
  }
  getLabourSpecialTotalPayment(data: any): Observable<any> {
    return this.http
      .post(API_LINKS.LABOUR_SPCL_WAGES_URL + '/total-payment', data, {
        headers: this.header,
      })
      .pipe(take(1));
  }
  createLabourSpclWage(data: any): Observable<any> {
    return this.http
      .post(API_LINKS.LABOUR_SPCL_WAGES_URL + '/add', data, {
        headers: this.header,
      })
      .pipe(take(1));
  }

  updateLabourSpclWage(data: any, wageID: any): Observable<any> {
    const params = new HttpParams().set('spcl_wage_id', wageID);
    return this.http
      .put(API_LINKS.LABOUR_SPCL_WAGES_URL, data, {
        headers: this.header,
        params: params,
      })
      .pipe(take(1));
  }

  deleteLabourSpclWage(wageID: any): Observable<any> {
    const params = new HttpParams().set('spcl_wage_id', wageID);
    return this.http
      .delete(API_LINKS.LABOUR_SPCL_WAGES_URL, {
        params: params,
        headers: this.header,
      })
      .pipe(take(1));
  }
  /******************************* LABOUR SPECIAL WAGES *******************************/
}
