<?php

/** @var \Laravel\Lumen\Routing\Router $router */

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It is a breeze. Simply tell Lumen the URIs it should respond to
| and give it the Closure to call when that URI is requested.
|
 */

$router->group(['prefix' => 'api'], function () use ($router) {
    $router->group(['prefix' => 'users'], function () use ($router) {
        $router->post('/login', 'UserController@login');
    });
    $router->group(['prefix' => 'versions'], function () use ($router) {
        $router->get('/', 'VersionController@getAllVersion');
        $router->post('/latest', 'VersionController@getLatestVersion');
        $router->post('/', 'VersionController@getVersion');
        $router->post('/add', 'VersionController@createVersion');
        $router->post('/update', 'VersionController@updateVersion');
        $router->delete('/', 'VersionController@deleteVersion');
    });

    $router->group(['middleware' => ['auth']], function () use ($router) {
        $router->group(['prefix' => 'master'], function () use ($router) {
            $router->get('/user-roles', 'MasterController@getAllUserRoles');
            $router->get('/wages-type', 'MasterController@getWagesType');
            $router->get('/module-access', 'MasterController@getAllModuleAccess');
            $router->post('/group-access', 'MasterController@getGroupAccess');
            $router->put('/group-access', 'MasterController@saveGroupAccess');
        });
        $router->group(['prefix' => 'users'], function () use ($router) {
            $router->get('/', 'UserController@getAllStaffs');
            $router->post('/', 'UserController@getStaffs');
            $router->post('/add', 'UserController@createStaff');
            $router->post('/update', 'UserController@updateStaff');
            $router->put('/change_password', 'UserController@changePassword');
            $router->put('/status_change', 'UserController@statusChange');
            $router->delete('/', 'UserController@deleteStaff');
            $router->put('/remove_pro_pic', 'UserController@removeProfilePicture');
        });

        $router->group(['prefix' => 'work-site'], function () use ($router) {
            $router->get('/', 'WorkSiteController@getAllWorkSites');
            $router->post('/', 'WorkSiteController@getWorkSites');
            $router->post('/add', 'WorkSiteController@createWorkSite');
            $router->put('/', 'WorkSiteController@updateWorkSite');
            $router->delete('/', 'WorkSiteController@deleteWorkSite');
        });

        $router->group(['prefix' => 'note-book'], function () use ($router) {
            $router->get('/', 'NoteBookController@getAllNoteBooks');
            $router->post('/', 'NoteBookController@getNoteBooks');
            $router->post('/add', 'NoteBookController@createNoteBook');
            $router->put('/', 'NoteBookController@updateNoteBook');
            $router->delete('/', 'NoteBookController@deleteNoteBook');
            $router->put('/checked', 'NoteBookController@checkedNoteBook');
        });

        $router->group(['prefix' => 'labour-attendance'], function () use ($router) {
            $router->get('/', 'AttendanceController@getAllAttendance');
            $router->post('/', 'AttendanceController@getAttendance');
            $router->post('/no-of-wages', 'AttendanceController@getNoOfWages');
            $router->post('/no-of-wages-rate', 'AttendanceController@getNoOfWagesRate');
            $router->post('/add', 'AttendanceController@checkIn');
            $router->put('/', 'AttendanceController@checkOut');
            $router->post('/labour-list', 'AttendanceController@getListOfLabours');
            $router->post('/current-attendance', 'AttendanceController@getWorkSiteWithAttendance');

            /* ********************************** MANAGE ATTENDANCE ********************************** */

            $router->group(['prefix' => 'manage'], function () use ($router) {
                $router->post('/', 'AttendanceController@manageAttendance');
                $router->delete('/', 'AttendanceController@deleteAttendance');
            });

            /* ********************************** MANAGE ATTENDANCE ********************************** */
        });

        $router->group(['prefix' => 'labour-rates'], function () use ($router) {
            $router->get('/', 'LabourRatesController@getAllLabourRates');
            $router->post('/', 'LabourRatesController@getLabourRates');
            $router->put('/', 'LabourRatesController@saveLabourRates');
            $router->delete('/', 'LabourRatesController@deleteLabourRates');
        });

        $router->group(['prefix' => 'labour-wages'], function () use ($router) {
            $router->get('/', 'LabourWagesController@getAllLabourWages');
            $router->post('/', 'LabourWagesController@getLabourWages');
            $router->post('/total-payment', 'LabourWagesController@getTotalPayment');
            $router->post('/add', 'LabourWagesController@createLabourWages');
            $router->put('/', 'LabourWagesController@updateLabourWages');
            $router->delete('/', 'LabourWagesController@deleteLabourWages');
        });

        $router->group(['prefix' => 'labour-spcl-wages'], function () use ($router) {
            $router->get('/', 'LabourSpclWagesController@getAllLabourSpclWages');
            $router->post('/', 'LabourSpclWagesController@getLabourSpclWages');
            $router->post('/total-payment', 'LabourSpclWagesController@getTotalPayment');
            $router->post('/add', 'LabourSpclWagesController@createLabourSpclWages');
            $router->put('/', 'LabourSpclWagesController@updateLabourSpclWages');
            $router->delete('/', 'LabourSpclWagesController@deleteLabourSpclWages');
        });

        $router->group(['prefix' => 'machines'], function () use ($router) {
            $router->get('/', 'MachineController@getAllMachines');
            $router->post('/', 'MachineController@getMachines');
            $router->put('/', 'MachineController@saveMachines');
            $router->post('/transfer', 'MachineController@getTransferMachines');
            $router->put('/transfer', 'MachineController@transferMachines');
            $router->delete('/', 'MachineController@deleteMachines');
        });

        $router->group(['prefix' => 'reports'], function () use ($router) {
            $router->get('/labour-details', 'ReportsController@getLabourDetails');
            $router->post('/labour-attendance', 'ReportsController@getLabourAttendance');
            $router->post('/labour-normal-wages', 'ReportsController@getLabourNormalWages');
            $router->post('/labour-special-wages', 'ReportsController@getLabourSpecialWages');
            $router->get('/no-of-machines', 'ReportsController@getNOOfMachines');
            $router->post('/no-of-machines-transfered', 'ReportsController@getNOOfMachinesTransfered');
        });
    });
});
