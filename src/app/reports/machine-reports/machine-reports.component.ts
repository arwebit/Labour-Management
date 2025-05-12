import { HttpErrorResponse } from '@angular/common/module.d-CnjH8Dlt';
import { Component } from '@angular/core';
import { PDFGenerator } from '@ionic-native/pdf-generator/ngx';
import { Platform } from '@ionic/angular';
import { ReportsService } from 'src/app/shared/services/reports.service';

@Component({
  selector: 'app-machine-reports',
  standalone: false,
  templateUrl: './machine-reports.component.html',
  styleUrls: ['./machine-reports.component.scss'],
})
export class MachineReportsComponent {
  machineList: any = [];

  constructor(
    private reportSrv: ReportsService,
    private pdfGenerator: PDFGenerator,
    private platform: Platform
  ) {
    this.getMachineList();
  }

  ionViewWillEnter() {
    this.getMachineList();
  }

  getMachineList() {
    this.reportSrv.getNoOfMachines().subscribe(
      (res: any) => {
        this.machineList = res.rows;
      },
      (err: HttpErrorResponse) => {
        console.log(err.error.message);
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
        fileName: 'Machine.pdf',
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
