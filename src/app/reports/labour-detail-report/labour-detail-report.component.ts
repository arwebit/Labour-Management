import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { HelpersService } from 'src/app/shared/services/others/helpers.service';
import { ReportsService } from 'src/app/shared/services/reports.service';
import { UserService } from 'src/app/shared/services/users/user.service';
import { PDFGenerator } from '@ionic-native/pdf-generator/ngx';
import { Platform } from '@ionic/angular';
@Component({
  selector: 'app-labour-detail-report',
  templateUrl: './labour-detail-report.component.html',
  standalone: false,
  styleUrls: ['./labour-detail-report.component.scss'],
})
export class LabourDetailReportComponent {
  labourRole: any = '';
  fromDate: any = '';
  toDate: any = '';
  start: number = 0;
  limit: number = 10;
  sortField: string = 'b.full_name';
  sortBy: string = '1';
  labourLists: any = [];
  isLoading: boolean = false;
  fullName: string = '';
  panNo: string = '';
  aadharNo: string = '';
  mobile: string = '';
  email: string = '';
  labourRate: string = '';
  totalNoOfWages: number = 0;

  labourAttendanceDetails: any = [];
  labourNormalWageDetails: any = [];
  labourSpecialWageDetails: any = [];
  resultDiv: boolean = false;

  constructor(
    private reportSrv: ReportsService,
    private helperSrv: HelpersService,
    private userSrv: UserService,
    private pdfGenerator: PDFGenerator,
    private platform: Platform
  ) {
    this.getLabourRole();
  }

  ionViewWillEnter() {}

  getLabourRole() {
    this.helperSrv.getAllUserRoles().subscribe(
      (res: any) => {
        const roles = res.rows;
        this.labourRole = roles.find(
          (role: any) => role.role_name === 'Labour'
        )?.role_id;
        this.getLabours(this.labourRole);
      },
      (err: HttpErrorResponse) => {
        console.log('Something went wrong');
      }
    );
  }
  getLabours(labourRole: any) {
    this.isLoading = true;
    const postData = {
      filter: {
        condition: [['user_role', '=', labourRole]],
      },
      start_row: 0,
      page_records: 1000000,
      sort_field: 'full_name',
      sort: -1,
    };

    this.userSrv.getUsers(postData).subscribe(
      (result: any) => {
        this.isLoading = false;
        this.labourLists = result.rows;
      },
      (err: HttpErrorResponse) => {
        this.isLoading = false;
        console.log('Something went wrong');
      }
    );
  }

  getLabourDetails(event: Event) {
    const labourID = (<HTMLInputElement>event.target).value;
    if (labourID) {
      this.reportSrv.getLabourDetails(labourID).subscribe(
        (res: any) => {
          this.resultDiv = true;
          const details = res.row;
          this.fullName = details.full_name;
          this.aadharNo = details.aadhar_no;
          this.panNo = details.pan_no;
          this.email = details.email;
          this.mobile = details.mobile;
          this.labourRate = details.labour_rate.labour_rate;
          this.labourAttendanceDetails = details.labour_attendance;
          this.labourNormalWageDetails = details.labour_normal_payment;
          this.labourSpecialWageDetails = details.labour_special_payment;
          this.totalNoOfWages = this.labourAttendanceDetails.filter(
            (item: any) => item.check_out !== null && item.check_out !== ''
          ).length;
        },
        (err: HttpErrorResponse) => {
          this.resultDiv = false;
          console.log('Something went wrong');
        }
      );
    } else {
      this.resultDiv = false;
    }
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
        fileName: 'Labour Detailed Report.pdf',
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
