import { Component, Input, OnInit } from '@angular/core';
import { LabourAttendancesService } from 'src/app/shared/services/labour/labour-attendances.service';

@Component({
  selector: 'app-view-attendances',
  templateUrl: './view-attendances.component.html',
  standalone: false,
  styleUrls: ['./view-attendances.component.scss'],
})
export class ViewAttendancesComponent implements OnInit {
  @Input('currentDateTime') currentDateTime: any = '';
  @Input('currentDate') currentDate = '';

  labourLists: any = [];
  offset: number = 0;
  limit: number = 10;
  loading: boolean = false;
  loader: boolean = false;

  constructor(private attSrv: LabourAttendancesService) {}

  ngOnInit() {
    this.getLabourAttendnaces();
  }
  getLabourAttendnaces() {
    this.loader = true;

    if (this.loading) return;
    this.loading = true;

    const postData = {
      work_date: this.currentDate,
      start_row: this.offset,
      page_records: this.limit,
    };

    this.attSrv
      .getLabourListBasedOnCurrentAAttendance(postData)
      .subscribe((result: any) => {
        this.loader = false;
        this.labourLists = [...this.labourLists, ...result.rows];
        this.offset += this.limit;
        this.loading = false;
      });
  }
}
