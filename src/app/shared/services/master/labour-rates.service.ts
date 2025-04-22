import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, take } from 'rxjs';
import { API_LINKS } from '../../apis';

@Injectable({
  providedIn: 'root',
})
export class LabourRatesService {
  Authorization = `Bearer ${localStorage.getItem('token')}`;

  header = new HttpHeaders({
    Authorization: this.Authorization,
  });
  constructor(private http: HttpClient) {}

  getAllLabourRates(): Observable<any> {
    return this.http
      .get(API_LINKS.LABOUR_RATES_URL, { headers: this.header })
      .pipe(take(1));
  }
  getLabourRates(data: any): Observable<any> {
    return this.http
      .post(API_LINKS.LABOUR_RATES_URL, data, { headers: this.header })
      .pipe(take(1));
  }

  saveLabourRate(data: any): Observable<any> {
    return this.http
      .put(API_LINKS.LABOUR_RATES_URL, data, {
        headers: this.header,
      })
      .pipe(take(1));
  }

  deleteLabourRate(rateID: any): Observable<any> {
    const params = new HttpParams().set('rate_id', rateID);
    return this.http
      .delete(API_LINKS.LABOUR_RATES_URL, {
        params: params,
        headers: this.header,
      })
      .pipe(take(1));
  }
}
