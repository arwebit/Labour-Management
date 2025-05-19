<?php
namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\ModuleAccess;
use App\Models\Query;
use App\Models\UserRole;
use App\Models\WagesType;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator as Validator;

class MasterController extends Controller
{
    public function getAllUserRoles()
    {
        $sortField = "role_id";
        $sort      = 'asc';
        $query     = UserRole::select()->orderBy($sortField, $sort)->get();

        $totalRows = $query->count();

        if ($totalRows > 0) {
            $response = [
                "statusCode" => 200,
                "message"    => "Records found",
                "total_rows" => $totalRows,
                "rows"       => $query,
            ];
        } else {
            $response = [
                "statusCode" => 200,
                "message"    => "No records found",
                "total_rows" => 0,
                "rows"       => [],
            ];
        }

        return response()->json($response, 200);
    }
    public function getAllModuleAccess()
    {
        $sortField = "module_access_id";
        $sort      = 'asc';
        $query     = ModuleAccess::select()->orderBy($sortField, $sort)->get();

        $totalRows = $query->count();

        if ($totalRows > 0) {
            $response = [
                "statusCode" => 200,
                "message"    => "Records found",
                "total_rows" => $totalRows,
                "rows"       => $query,
            ];
        } else {
            $response = [
                "statusCode" => 200,
                "message"    => "No records found",
                "total_rows" => 0,
                "rows"       => [],
            ];
        }

        return response()->json($response, 200);
    }

    public function getWagesType()
    {
        $sortField = "wages_type_id";
        $sort      = 'asc';
        $query     = WagesType::select()->orderBy($sortField, $sort)->get();

        $totalRows = $query->count();

        if ($totalRows > 0) {
            $response = [
                "statusCode" => 200,
                "message"    => "Records found",
                "total_rows" => $totalRows,
                "rows"       => $query,
            ];
        } else {
            $response = [
                "statusCode" => 200,
                "message"    => "No records found",
                "total_rows" => 0,
                "rows"       => [],
            ];
        }

        return response()->json($response, 200);
    }

    public function getGroupAccess(Request $req)
    {
        $condition = $req->input('filter')['condition'] ?? [];
        $sortField = "role_id";
        $sort      = 'asc';

        $query = UserRole::with(["module_access" => function ($q1) {
            $q1->join("master_module_access", "group_access.module_access_id", "=", "master_module_access.module_access_id")
                ->select(
                    "group_access.role_id",
                    "group_access.module_access_id",
                    "master_module_access.module_access_desc"
                );
        }])->select();

        $query = Query::filters($query, $condition);

        $totalRows = $query->count();

        $db = $query->orderBy($sortField, $sort)->get();

        if ($totalRows > 0) {
            $response = [
                "statusCode" => 200,
                "message"    => "Records found",
                "total_rows" => $totalRows,
                "rows"       => $db,
            ];
        } else {
            $response = [
                "statusCode" => 200,
                "message"    => "No records found",
                "total_rows" => 0,
                "rows"       => [],
            ];
        }

        return response()->json($response, 200);

    }

    public function saveGroupAccess(Request $req)
    {
        $rules = [
            'role_id'            => 'required|integer',
            'module_access_id'   => 'required|array',
            'module_access_id.*' => 'integer',
            'updated_by'         => 'required|integer',
        ];
        $messages = [
            'role_id.required'           => 'Role ID is required',
            'role_id.integer'            => 'Role ID must be an integer',
            'module_access_id.required'  => 'Module Access ID is required',
            'module_access_id.array'     => 'Module Access ID must be an array',
            'module_access_id.*.integer' => 'Each Module Access ID must be an integer',
            'updated_by.required'        => 'Updated by is required',
            'updated_by.integer'         => 'Updated by must be an integer',
        ];

        $validator = Validator::make($req->all(), $rules, $messages);

        if ($validator->fails()) {
            return response()->json(['statusCode' => 400, 'message' => 'Recorrect errors', 'errors' => $validator->errors()], 400);
        }

        $role_id           = $req->role_id;
        $module_access_ids = $req->module_access_id;
        $updated_by        = $req->updated_by;
        $updated_datetime  = date("Y-m-d H:i:s");

        DB::table('group_access')
            ->where('role_id', $role_id)
            ->whereNotIn('module_access_id', $module_access_ids)
            ->delete();

        foreach ($module_access_ids as $module_id) {
            DB::table('group_access')->updateOrInsert(
                [
                    'role_id'          => $role_id,
                    'module_access_id' => $module_id,
                ],
                [
                    'updated_by'       => $updated_by,
                    'updated_datetime' => $updated_datetime,
                ]
            );
        }

        return response()->json(['statusCode' => 201, 'message' => 'Successfully updated group access'], 201);
    }

}
