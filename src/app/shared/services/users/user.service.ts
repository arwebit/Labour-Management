import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, take } from 'rxjs';
import { API_LINKS } from '../../apis';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  Authorization = `Bearer ${localStorage.getItem('token')}`;

  header = new HttpHeaders({
    Authorization: this.Authorization,
  });
  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<any> {
    return this.http
      .get(API_LINKS.USERS_URL, { headers: this.header })
      .pipe(take(1));
  }
  getUsers(data: any): Observable<any> {
    return this.http
      .post(API_LINKS.USERS_URL, data, { headers: this.header })
      .pipe(take(1));
  }
  addUser(data: any): Observable<any> {
    return this.http
      .post(API_LINKS.USERS_URL + '/add', data, { headers: this.header })
      .pipe(take(1));
  }

  updateUser(data: any, userID: any): Observable<any> {
    const params = new HttpParams().set('user_id', userID);
    return this.http
      .post(API_LINKS.USERS_URL + '/update', data, {
        params: params,
        headers: this.header,
      })
      .pipe(take(1));
  }
  changePassword(data: any, userID: any): Observable<any> {
    const params = new HttpParams().set('user_id', userID);
    return this.http
      .put(API_LINKS.USERS_URL + '/change_password', data, {
        params: params,
        headers: this.header,
      })
      .pipe(take(1));
  }
  deleteUser(userID: any): Observable<any> {
    const params = new HttpParams().set('user_id', userID);
    return this.http
      .delete(API_LINKS.USERS_URL, { params: params, headers: this.header })
      .pipe(take(1));
  }

  /*************** USER ACCESS ************************* */

  getUserDetails(userID: any): Promise<any> {
    const postData = {
      filter: {
        condition: [['user_id', '=', userID]],
      },
      start_row: 0,
      page_records: 1,
      sort_field: 'user_id',
      sort: 1,
    };

    return this.getUsers(postData).pipe(take(1)).toPromise();
  }
}
