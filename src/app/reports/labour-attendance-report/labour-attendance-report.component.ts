import { HttpErrorResponse } from '@angular/common/module.d-CnjH8Dlt';
import { Component } from '@angular/core';
import { ReportsService } from 'src/app/shared/services/reports.service';
import { PDFGenerator } from '@ionic-native/pdf-generator/ngx';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-labour-attendance-report',
  templateUrl: './labour-attendance-report.component.html',
  styleUrls: ['./labour-attendance-report.component.scss'],
  standalone: false,
})
export class LabourAttendanceReportComponent {
  fromDate: any = '';
  toDate: any = '';
  start: number = 0;
  limit: number = 5000;
  sortField: string = 'b.full_name';
  sortBy: string = '1';

  attendanceList: any = [];
  resultDiv: boolean = false;

  constructor(
    private reportSrv: ReportsService,
    private pdfGenerator: PDFGenerator,
    private platform: Platform
  ) {}

  ionViewWillEnter() {}

  getAttendanceList() {
    const postData = {
      from_date: this.fromDate,
      to_date: this.toDate,
      start: this.start,
      page_records: this.limit,
      sort_field: this.sortField,
      sort: this.sortBy,
    };
    this.reportSrv.getLabourAttendance(postData).subscribe(
      (res: any) => {
        this.resultDiv = true;
        this.attendanceList = res.rows;
      },
      (err: HttpErrorResponse) => {
        this.resultDiv = false;
        console.log('Something went wrong');
      }
    );
  }

  async downloadPDF() {
    const content = document.getElementById('pdfContent')?.innerHTML;

    if (!content) {
      console.error('No content found!');
      return;
    }

    try {
      const options = {
        type: 'share',
        fileName: 'Labour Attendance.pdf',
        documentSize: 'A4',
        landscape: 'portrait' as const,
      };
      await this.platform.ready();
      const result = await this.pdfGenerator.fromData(
        `<html><body>${content}</body></html>`,
        options
      );
      console.log('PDF generated:', result);
    } catch (error) {
      console.error('PDF generation error:', error);
    }
  }
}
