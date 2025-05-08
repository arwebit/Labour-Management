import { environment } from 'src/environments/environment';

export class API_LINKS {
  public static VERSION_URL: string = environment.baseURL + '/api/versions';

  public static LOGIN_URL: string = environment.baseURL + '/api/users/login';

  /******************************* HELPER APIS *******************************/

  public static DASHBOARD_URL: string = environment.baseURL + '/api/dashboard';

  /******************************* HELPER APIS *******************************/

  /******************************* MASTER APIS *******************************/

  public static MASTER_ROLES_URL: string =
    environment.baseURL + '/api/master/user-roles';

  public static MASTER_MODULES_ACCESS_URL: string =
    environment.baseURL + '/api/master/module-access';

  public static MASTER_GROUP_ACCESS_URL: string =
    environment.baseURL + '/api/master/group-access';

  /******************************* MASTER APIS *******************************/

  /******************************* USER APIS *******************************/

  public static USERS_URL: string = environment.baseURL + '/api/users';

  /******************************* USER APIS *******************************/

  /******************************* WORK SITE APIS *******************************/

  public static WORK_SITE_URL: string = environment.baseURL + '/api/work-site';

  /******************************* WORK SITE APIS *******************************/

  /******************************* NOTE BOOK APIS *******************************/

  public static NOTE_BOOK_URL: string = environment.baseURL + '/api/note-book';

  /******************************* NOTE BOOK APIS *******************************/

  /******************************* LABOUR APIS *******************************/

  public static LABOUR_ATTENDANCE_URL: string =
    environment.baseURL + '/api/labour-attendance';

  public static LABOUR_RATES_URL: string =
    environment.baseURL + '/api/labour-rates';

  public static LABOUR_WAGES_URL: string =
    environment.baseURL + '/api/labour-wages';

  public static LABOUR_SPCL_WAGES_URL: string =
    environment.baseURL + '/api/labour-spcl-wages';

  /******************************* LABOUR APIS *******************************/

  /******************************* MACHINE APIS *******************************/

  public static MACHINE_URL: string = environment.baseURL + '/api/machines';

  public static MACHINE_TRANSFER_URL: string =
    environment.baseURL + '/api/machines/transfer';

  /******************************* MACHINE APIS *******************************/

  /******************************* REPORT APIS *******************************/

  public static LABOUR_DETAILS_REPORT_URL: string =
    environment.baseURL + '/api/reports/labour-details';

  public static LABOUR_ATTENDANCE_REPORT_URL: string =
    environment.baseURL + '/api/reports/labour-attendance';

  public static LABOUR_NORMAL_WAGES_REPORT_URL: string =
    environment.baseURL + '/api/reports/labour-normal-wages';

  public static LABOUR_SPECIAL_WAGES_REPORT_URL: string =
    environment.baseURL + '/api/reports/labour-special-wages';

  public static MACHINE_REPORT_URL: string =
    environment.baseURL + '/api/reports/no-of-machines';

  public static MACHINE_TRANSFERED_REPORT_URL: string =
    environment.baseURL + '/api/reports/no-of-machines-transfered';

  /******************************* REPORT APIS *******************************/
}
