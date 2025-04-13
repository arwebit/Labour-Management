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
            $router->post('/add', 'AttendanceController@checkIn');
            $router->put('/', 'AttendanceController@checkOut');
            $router->delete('/', 'AttendanceController@deleteAttendance');
        });
    });
});
