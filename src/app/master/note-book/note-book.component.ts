import { HttpErrorResponse } from '@angular/common/module.d-CnjH8Dlt';
import { Component, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { AlertController, InfiniteScrollCustomEvent } from '@ionic/angular';
import { WorkSiteService } from 'src/app/shared/services/master/work-site.service';
import { NoteBookService } from 'src/app/shared/services/others/note-book.service';
import { UserService } from 'src/app/shared/services/users/user.service';

@Component({
  selector: 'app-note-book',
  standalone: false,
  templateUrl: './note-book.component.html',
  styleUrls: ['./note-book.component.scss'],
})
export class NoteBookComponent {
  loggedInUserID: any = localStorage.getItem('user_id');
  userModuleAccess: number[] = [];
  userRole: any = '';
  noteBookID: any = '';
  addNoteBookForm!: FormGroup;
  editNoteBookForm!: FormGroup;
  noteBooksLists: any = [];
  workSites: any = [];
  offset: number = 0;
  limit: number = 10;
  loading: boolean = false;
  loader: boolean = false;
  sortBy: string = 'created_date_time';
  sortType: any = -1;
  condition: any = [];
  saveMsg: string = '';
  isToastOpen: boolean = false;
  noteBookTitleErr: string = '';
  workSiteErr: string = '';
  workDateErr: string = '';
  noteDescriptionErr: string = '';
  statusErr: string = '';

  @ViewChild('createNoteBookModel') createNoteBookModel: any;
  @ViewChild('editNoteBookModel') editNoteBookModel: any;

  constructor(
    private userSrv: UserService,
    private noteBookSrv: NoteBookService,
    private workSiteSrv: WorkSiteService,
    private alertController: AlertController
  ) {
    this.closeModal();
    this.addNoteBookFormInit();
    this.editNoteBookFormInit();
    this.getWorkSites();
  }

  ionViewWillEnter(): void {
    this.getUserDetails();
    this.emptyErrors();
    this.addNoteBookFormInit();
    this.editNoteBookFormInit();
    this.getNoteBooks();
    this.closeModal();
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

  async openModal(str: string, noteBookID: any = '') {
    this.emptyErrors();
    if (str === 'create') {
      const modalElement = this.createNoteBookModel?.el;
      if (modalElement) {
        await modalElement.present();
      }
    } else {
      const modalElement = this.editNoteBookModel?.el;
      if (modalElement) {
        await modalElement.present();
        this.editNoteBookFormInit(noteBookID);
      }
    }
  }
  getWorkSites() {
    const postData = {
      filter: {
        condition: [['is_active', '=', 'yes']],
      },
      start_row: 0,
      page_records: 100000000000000,
      sort_field: 'work_site_id',
      sort: -1,
    };

    this.workSiteSrv.getWorkSites(postData).subscribe(
      (res: any) => {
        this.workSites = res.rows;
      },
      (err: HttpErrorResponse) => {
        console.log(err.error.message);
      }
    );
  }
  async closeModal() {
    const modalElement1 = this.createNoteBookModel?.el;
    const modalElement2 = this.editNoteBookModel?.el;

    if (modalElement1) {
      await modalElement1.dismiss();
    }
    if (modalElement2) {
      await modalElement2.dismiss();
    }
  }

  getNoteBooks() {
    this.loader = true;

    if (this.loading) return;
    this.loading = true;

    const postData = {
      filter: {
        condition: this.condition,
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

  addNoteBookFormInit() {
    this.addNoteBookForm = new FormGroup({
      note_title: new FormControl(''),
      work_site: new FormControl(''),
      work_date: new FormControl(''),
      description: new FormControl(''),
      created_by: new FormControl(this.loggedInUserID),
    });
  }

  editNoteBookFormInit(noteBookID: any = '') {
    this.editNoteBookForm = new FormGroup({
      note_book_id: new FormControl(noteBookID),
      note_title: new FormControl(''),
      work_site: new FormControl(''),
      work_date: new FormControl(''),
      description: new FormControl(''),
      is_active: new FormControl(''),
      updated_by: new FormControl(this.loggedInUserID),
    });
    this.getEditNoteBookForm(noteBookID);
  }

  getEditNoteBookForm(noteBookID: any = '') {
    const postData = {
      filter: {
        condition: [['note_book_id', '=', noteBookID]],
      },
      start: 0,
      page_records: 1,
      sort_field: 'note_book_id',
      sort_type: -1,
    };

    this.noteBookSrv.getNoteBooks(postData).subscribe(
      (res: any) => {
        const [details] = res.rows;
        this.editNoteBookForm = new FormGroup({
          note_book_id: new FormControl(details.note_book_id),
          note_title: new FormControl(details.note_title),
          work_site: new FormControl(details.work_site.work_site_id),
          work_date: new FormControl(details.work_date),
          description: new FormControl(details.description),
          is_active: new FormControl(details.is_active),
          updated_by: new FormControl(this.loggedInUserID),
        });
      },
      (err: HttpErrorResponse) => {
        console.log(err.error.message);
      }
    );
  }

  emptyErrors() {
    this.noteBookTitleErr = '';
    this.workSiteErr = '';
    this.workDateErr = '';
    this.noteDescriptionErr = '';
    this.statusErr = '';
  }

  addNoteBooks() {
    this.noteBookSrv.addNoteBook(this.addNoteBookForm.value).subscribe(
      (res: any) => {
        this.emptyErrors();
        this.saveMsg = res.message;
        this.noteBooksLists = [];
        this.offset = 0;
        this.limit = 10;
        this.getNoteBooks();
        this.addNoteBookFormInit();
        this.setToastOpen(true);
        this.closeModal();
      },
      (err: HttpErrorResponse) => {
        this.emptyErrors();
        this.saveMsg = '';
        this.noteBookTitleErr = err.error.errors.note_title;
        this.workSiteErr = err.error.errors.work_site;
        this.workDateErr = err.error.errors.work_date;
        this.noteDescriptionErr = err.error.errors.description;
        this.saveMsg = err.error.message;
        this.setToastOpen(true);
      }
    );
  }

  updateNoteBooks() {
    this.noteBookSrv
      .updateNoteBook(
        this.editNoteBookForm.value,
        this.editNoteBookForm.value.note_book_id
      )
      .subscribe(
        (res: any) => {
          this.emptyErrors();
          this.saveMsg = res.message;
          this.noteBooksLists = [];
          this.offset = 0;
          this.limit = 10;
          this.getNoteBooks();
          this.setToastOpen(true);
          this.closeModal();
        },
        (err: HttpErrorResponse) => {
          this.emptyErrors();
          this.saveMsg = '';
          this.noteBookTitleErr = err.error.errors.note_title;
          this.workSiteErr = err.error.errors.work_site;
          this.workDateErr = err.error.errors.work_date;
          this.noteDescriptionErr = err.error.errors.description;
          this.statusErr = err.error.errors.is_active;
          this.saveMsg = err.error.message;
          this.setToastOpen(true);
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
