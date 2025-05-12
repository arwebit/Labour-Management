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
  limit: number = 50;
  sortField: string = 'b.full_name';
  sortBy: string = '1';

  attendanceList: any = [];
  resultDiv: boolean = false;
  saveMsg: string = '';
  isToastOpen: boolean = false;

  fromDateErr: string = '';
  toDateErr: string = '';
  startErr: string = '';

  constructor(
    private reportSrv: ReportsService,
    private pdfGenerator: PDFGenerator,
    private platform: Platform
  ) {}

  ionViewWillEnter() {}

  setToastOpen(isOpen: boolean) {
    this.isToastOpen = isOpen;
  }
  emptyErrors() {
    this.fromDateErr = '';
    this.toDateErr = '';
    this.startErr = '';
  }
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
        this.emptyErrors();
        this.resultDiv = false;
        this.fromDateErr = err.error.errors.from_date;
        this.toDateErr = err.error.errors.to_date;
        this.startErr = err.error.errors.start;
        this.saveMsg = err.error.message;
        this.setToastOpen(true);
      }
    );
  }

  async downloadPDF() {
    const contentElement = document.getElementById('pdfContent');
    if (!contentElement) {
      console.error('No content found!');
      return;
    }

    const content = contentElement.innerHTML;
    const styles = `
    <style>
     html, body {
      margin: 0;
      padding: 0;
    }
      .header_color {
        background-color: #cec9c9;
      }
      .print-table {
        width: 100%;
        border-collapse: collapse;
      }
      .print-table th, .print-table td {
        border: 0;
        padding: 8px;
        text-align: left;
        font-size: 12px;
      }
      .body_container {
        width: 100%;
        margin: 0 auto;
      }
      .report_footer {
        background-color: #cec9c9;
        position: fixed;
        bottom: 0;
        width: 100%;
        font-size: 10px;
        text-align: center;
      }
    </style>
  `;

    const html = `
    <html>
      <head>
        ${styles}
      </head>
      <body>
        ${content}
      </body>
    </html>
  `;

    try {
      const options = {
        type: 'share',
        fileName: 'Labour_Attendance.pdf',
        documentSize: 'A4',
        landscape: 'portrait' as const,
      };

      await this.platform.ready();
      const result = await this.pdfGenerator.fromData(html, options);
      console.log('PDF generated:', result);
    } catch (error) {
      console.error('PDF generation error:', error);
    }
  }
}
