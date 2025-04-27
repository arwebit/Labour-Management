import { HttpErrorResponse } from '@angular/common/module.d-CnjH8Dlt';
import { Component } from '@angular/core';
import { ReportsService } from 'src/app/shared/services/reports.service';
import { PDFGenerator } from '@ionic-native/pdf-generator/ngx';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-labour-normal-wages-reports',
  standalone: false,
  templateUrl: './labour-normal-wages-reports.component.html',
  styleUrls: ['./labour-normal-wages-reports.component.scss'],
})
export class LabourNormalWagesReportsComponent {
  fromDate: any = '';
  toDate: any = '';
  start: number = 0;
  limit: number = 50;
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
      text = `Labour has due of &#8377;${Math.abs(labourTotalPayment)}/-`;
    } else {
      text = `Labour has taken a advance of &#8377;${Math.abs(
        labourTotalPayment
      )}/-`;
    }
    return text;
  }

  setToastOpen(isOpen: boolean) {
    this.isToastOpen = isOpen;
  }
  getNormalWagesList() {
    const postData = {
      from_date: this.fromDate,
      to_date: this.toDate,
      start: this.start,
      page_records: this.limit,
    };
    this.reportSrv.getLabourNormalWages(postData).subscribe(
      (res: any) => {
        this.emptyErrors();
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

  async downloadPDF() {
    const content = document.getElementById('pdfContent')?.innerHTML;

    if (!content) {
      console.error('No content found!');
      return;
    }

    try {
      const options = {
        type: 'share',
        fileName: 'Normal Wages.pdf',
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
