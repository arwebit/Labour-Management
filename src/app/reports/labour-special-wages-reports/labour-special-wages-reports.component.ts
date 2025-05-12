import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { ReportsService } from 'src/app/shared/services/reports.service';
import { PDFGenerator } from '@ionic-native/pdf-generator/ngx';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-labour-special-wages-reports',
  standalone: false,
  templateUrl: './labour-special-wages-reports.component.html',
  styleUrls: ['./labour-special-wages-reports.component.scss'],
})
export class LabourSpecialWagesReportsComponent {
  fromDate: any = '';
  toDate: any = '';
  start: number = 0;
  limit: number = 50;
  sortField: string = 'b.full_name';
  sortBy: string = '1';

  wagesList: any = [];
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

  emptyErrors() {
    this.fromDateErr = '';
    this.toDateErr = '';
    this.startErr = '';
  }

  duePending(labourTotalPayment: number) {
    let text = '';
    if (labourTotalPayment >= 0) {
      text = `Labour has due &#8377;${Math.abs(labourTotalPayment)}/-`;
    } else {
      text = `Labour has paid extra &#8377;${Math.abs(labourTotalPayment)}/-`;
    }
    return text;
  }
  setToastOpen(isOpen: boolean) {
    this.isToastOpen = isOpen;
  }
  getSpecialWagesList() {
    const postData = {
      from_date: this.fromDate,
      to_date: this.toDate,
      start: this.start,
      page_records: this.limit,
      sort_field: this.sortField,
      sort: this.sortBy,
    };
    this.reportSrv.getLabourSpecialWages(postData).subscribe(
      (res: any) => {
        this.resultDiv = true;
        this.wagesList = res.rows;
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

  /* async downloadPDF() {
    const content = document.getElementById('pdfContent')?.innerHTML;

    if (!content) {
      console.error('No content found!');
      return;
    }

    try {
      const options = {
        type: 'share',
        fileName: 'Special_Wages.pdf',
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
  }*/

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
        fileName: 'Special_Wages.pdf',
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
