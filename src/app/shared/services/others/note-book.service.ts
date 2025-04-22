import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, take } from 'rxjs';
import { API_LINKS } from '../../apis';

@Injectable({
  providedIn: 'root',
})
export class NoteBookService {
  Authorization = `Bearer ${localStorage.getItem('token')}`;

  header = new HttpHeaders({
    Authorization: this.Authorization,
  });
  constructor(private http: HttpClient) {}

  getAllNoteBooks(data: any): Observable<any> {
    return this.http
      .post(API_LINKS.NOTE_BOOK_URL, data, { headers: this.header })
      .pipe(take(1));
  }
  getNoteBooks(data: any): Observable<any> {
    return this.http
      .post(API_LINKS.NOTE_BOOK_URL, data, { headers: this.header })
      .pipe(take(1));
  }
  addNoteBook(data: any): Observable<any> {
    return this.http
      .post(API_LINKS.NOTE_BOOK_URL + '/add', data, { headers: this.header })
      .pipe(take(1));
  }

  updateNoteBook(data: any, noteBookID: any): Observable<any> {
    const params = new HttpParams().set('note_book_id', noteBookID);
    return this.http
      .put(API_LINKS.NOTE_BOOK_URL, data, {
        params: params,
        headers: this.header,
      })
      .pipe(take(1));
  }

  deleteNoteBook(noteBookID: any): Observable<any> {
    const params = new HttpParams().set('note_book_id', noteBookID);
    return this.http
      .delete(API_LINKS.NOTE_BOOK_URL, { params: params, headers: this.header })
      .pipe(take(1));
  }

  checkNoteBook(noteBookID: any, data: any): Observable<any> {
    const params = new HttpParams().set('note_book_id', noteBookID);
    return this.http
      .put(API_LINKS.NOTE_BOOK_URL + '/checked', data, {
        params: params,
        headers: this.header,
      })
      .pipe(take(1));
  }
}
