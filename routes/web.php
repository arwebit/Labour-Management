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

    $router->group(['middleware' => ['auth']], function () use ($router) {
        $router->group(['prefix' => 'master'], function () use ($router) {
            $router->get('/user-roles', 'MasterController@getAllUserRoles');
            $router->get('/module-access', 'MasterController@getAllModuleAccess');
            $router->post('/get-group-access', 'MasterController@getGroupAccess');
            $router->put('/save-group-access', 'MasterController@saveGroupAccess');
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
    });
});
