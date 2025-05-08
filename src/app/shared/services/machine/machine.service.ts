import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, take } from 'rxjs';
import { API_LINKS } from '../../apis';

@Injectable({
  providedIn: 'root',
})
export class MachineService {
  Authorization = `Bearer ${localStorage.getItem('token')}`;

  header = new HttpHeaders({
    Authorization: this.Authorization,
  });
  constructor(private http: HttpClient) {}

  getAllMachines(): Observable<any> {
    return this.http
      .get(API_LINKS.MACHINE_URL, { headers: this.header })
      .pipe(take(1));
  }
  getMachines(data: any): Observable<any> {
    return this.http
      .post(API_LINKS.MACHINE_URL, data, { headers: this.header })
      .pipe(take(1));
  }
  getMachinesTransfered(data: any): Observable<any> {
    return this.http
      .post(API_LINKS.MACHINE_TRANSFER_URL, data, { headers: this.header })
      .pipe(take(1));
  }

  saveMachine(data: any): Observable<any> {
    return this.http
      .put(API_LINKS.MACHINE_URL, data, {
        headers: this.header,
      })
      .pipe(take(1));
  }
  transferMachine(data: any): Observable<any> {
    return this.http
      .put(API_LINKS.MACHINE_TRANSFER_URL, data, {
        headers: this.header,
      })
      .pipe(take(1));
  }
  deleteMachine(rateID: any): Observable<any> {
    const params = new HttpParams().set('rate_id', rateID);
    return this.http
      .delete(API_LINKS.MACHINE_URL, {
        params: params,
        headers: this.header,
      })
      .pipe(take(1));
  }
}
