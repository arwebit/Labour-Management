import { HttpErrorResponse } from '@angular/common/module.d-CnjH8Dlt';
import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AlertController, InfiniteScrollCustomEvent } from '@ionic/angular';
import { NoteBookService } from 'src/app/shared/services/others/note-book.service';
import { UserService } from 'src/app/shared/services/users/user.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-note-book-notification',
  standalone: false,
  templateUrl: './note-book-notification.component.html',
  styleUrls: ['./note-book-notification.component.scss'],
})
export class NoteBookNotificationComponent {
  env: any = environment.module_access;
  loggedInUserID: any = localStorage.getItem('user_id');
  userModuleAccess: number[] = [];
  userRole: any = '';
  noteBookID: any = '';
  checkNoteBookForm!: FormGroup;
  noteBooksLists: any = [];
  offset: number = 0;
  limit: number = 10;
  loading: boolean = false;
  loader: boolean = false;
  sortBy: string = 'created_date_time';
  sortType: any = -1;
  saveMsg: string = '';
  isToastOpen: boolean = false;
  checkErr: string = '';
  checkByErr: string = '';
  checkNoteErr: string = '';

  showLists: boolean = true;
  noteBookCheckForm: boolean = false;

  constructor(
    private userSrv: UserService,
    private noteBookSrv: NoteBookService,
    private alertController: AlertController
  ) {
    this.checkNoteBookFormInit();
  }

  toggleFormDiv(str: string, noteBookID: any = '') {
    this.emptyErrors();
    if (str === 'save_form') {
      this.showLists = false;
      this.noteBookCheckForm = true;
      this.checkNoteBookFormInit(noteBookID);
    } else {
      this.getNoteBooks();
      this.showLists = true;
      this.noteBookCheckForm = false;
    }
  }

  ionViewWillEnter(): void {
    this.getUserDetails();
    this.emptyErrors();
    this.checkNoteBookFormInit();
    this.getNoteBooks();
  }

  async getUserDetails() {
    this.userModuleAccess = [];
    const data = await this.userSrv.getUserDetails(this.loggedInUserID);
    const [details] = data.rows;
    this.userRole = details.user_role.role_id;
    this.userModuleAccess = details.user_role.module_access.map(
      (access: any) => access.module_access_id
    );
  }

  hasAccess(id: number, userRole: number): boolean {
    let bool: boolean = false;
    if (userRole == -1) {
      bool = true;
    } else {
      bool = this.userModuleAccess.includes(id);
    }
    return bool;
  }

  async denyAccess(header: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      backdropDismiss: false,
      buttons: [
        {
          text: 'Ok',
          role: 'cancel',
        },
      ],
    });
    await alert.present();
  }

  doRefresh(event: any) {
    setTimeout(() => {
      this.ionViewWillEnter();
      event.target.complete();
    }, 3000);
  }

  async checkedAlready() {
    const alert = await this.alertController.create({
      header: 'Note Book Checked',
      message: 'This is already checked',
      backdropDismiss: false,
      buttons: [
        {
          text: 'Ok',
          role: 'cancel',
        },
      ],
    });
    await alert.present();
  }

  getNoteBooks() {
    this.loader = true;

    if (this.loading) return;
    this.loading = true;

    const postData = {
      filter: {
        condition: [['checked', '=', 'no']],
      },
      start_row: this.offset,
      page_records: this.limit,
      sort_field: this.sortBy,
      sort: this.sortType,
    };

    this.noteBookSrv.getNoteBooks(postData).subscribe((result: any) => {
      this.loader = false;
      this.noteBooksLists = [...this.noteBooksLists, ...result.rows];
      this.offset += this.limit;
      this.loading = false;
    });
  }

  sort(value: any) {
    this.loading = false;
    this.noteBooksLists = [];
    switch (value) {
      case '1':
        this.sortBy = 'work_date';
        this.sortType = -1;
        this.limit = 10;
        this.offset = 0;
        break;
      case '2':
        this.sortBy = 'work_date';
        this.sortType = 1;
        this.limit = 10;
        this.offset = 0;
        break;
      default:
        this.sortBy = 'work_date';
        this.sortType = -1;
        this.limit = 10;
        this.offset = 0;
        break;
    }
    this.getNoteBooks();
  }

  setToastOpen(isOpen: boolean) {
    this.isToastOpen = isOpen;
  }

  checkNoteBookFormInit(noteBookID: any = '') {
    this.checkNoteBookForm = new FormGroup({
      note_book_id: new FormControl(noteBookID),
      checked: new FormControl('yes'),
      checked_by: new FormControl(this.loggedInUserID),
      check_note: new FormControl(''),
    });
  }

  emptyErrors() {
    this.checkByErr = '';
    this.checkErr = '';
    this.checkNoteErr = '';
  }

  checkNoteBook() {
    this.noteBookSrv
      .checkNoteBook(
        this.checkNoteBookForm.value.note_book_id,
        this.checkNoteBookForm.value
      )
      .subscribe(
        (res: any) => {
          this.emptyErrors();
          this.saveMsg = res.message;
          this.noteBooksLists = [];
          this.offset = 0;
          this.limit = 10;
          this.getNoteBooks();
          this.checkNoteBookFormInit();
          this.setToastOpen(true);
          this.showLists = true;
          this.noteBookCheckForm = false;
        },
        (err: HttpErrorResponse) => {
          this.emptyErrors();
          this.saveMsg = '';
          this.checkByErr = err.error.errors.checked_by;
          this.checkErr = err.error.errors.checked;
          this.checkNoteErr = err.error.errors.check_note;
          this.saveMsg = err.error.message;
          this.setToastOpen(true);
          this.showLists = false;
          this.noteBookCheckForm = true;
        }
      );
  }

  infiniteScroll(ev: any) {
    this.getNoteBooks();

    setTimeout(() => {
      (ev as InfiniteScrollCustomEvent).target.complete();
    }, 500);
  }
}
