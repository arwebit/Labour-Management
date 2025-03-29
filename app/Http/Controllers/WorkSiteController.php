<?php
namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Query;
use App\Models\WorkSite;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator as Validator;

class WorkSiteController extends Controller
{
    public function getAllWorkSites()
    {
        $sortField = "work_site_id";
        $sort      = 'asc';
        $query     = WorkSite::with(["created_by" => function ($q1) {
            $q1->select("user_id", "full_name");
        }, "updated_by" => function ($q2) {
            $q2->select("user_id", "full_name");
        }])->select("*")
            ->orderBy($sortField, $sort)
            ->get();

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

    public function getWorkSites(Request $req)
    {
        $condition = $req->input('filter')['condition'] ?? [];
        $start     = $req->input('start_row');
        $records   = $req->input('page_records');
        $sortField = $req->input('sort_field') == "" ? "work_site_id" : $req->input('sort_field');
        $sort      = $req->input('sort') == -1 ? 'desc' : 'asc';
        $query     = WorkSite::with(["created_by" => function ($q1) {
            $q1->select("user_id", "full_name");
        }, "updated_by" => function ($q2) {
            $q2->select("user_id", "full_name");
        }])->select();

        $query = Query::filters($query, $condition);

        $totalRows         = $query->count();
        $noOfRequiredPages = ceil($totalRows / $records);
        $db                = $query->offset($start)->limit($records)->orderBy($sortField, $sort)->get();

        if ($totalRows > 0) {
            $response = [
                "statusCode"           => 200,
                "message"              => "Records found",
                "total_rows"           => $totalRows,
                "page_rows"            => count($db),
                "no_of_required_pages" => $noOfRequiredPages,
                "rows"                 => $db,
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

    public function createWorkSite(Request $req)
    {
        $rules = [
            'work_site_name'     => 'required|max:255',
            'work_site_location' => 'required|max:255',
            "created_by"         => 'required',
        ];
        $messages = [
            'work_site_name.required'     => 'Work site name required',
            'work_site_name.max'          => 'Max: 255 characters',
            'work_site_location.required' => 'Work site location required',
            'work_site_location.max'      => 'Max: 255 characters',
            'created_by.required'         => 'Created by required',
        ];

        $validator = Validator::make($req->all(), $rules, $messages);

        if ($validator->fails()) {
            return response()->json(['statusCode' => 400, 'message' => 'Recorrect errors', 'errors' => $validator->errors()], 400);
        } else {

            $saveWorkSite = DB::table('mm_work_site')->insert([
                'work_site_name'     => $req->input("work_site_name"),
                'work_site_location' => $req->input("work_site_location"),
                'is_active'          => 'yes',
                'created_by'         => $req->input("created_by"),
                'created_date_time'  => date("Y-m-d H:i:s"),
            ]);

            if ($saveWorkSite) {
                return response()->json(['statusCode' => 201, 'message' => 'Successfully created work site'], 201);
            } else {
                return response()->json(['statusCode' => 500, 'message' => 'Internal server error'], 500);
            }
        }
    }

    public function updateWorkSite(Request $req)
    {
        $workSiteID = $req->work_site_id;

        $rules = [
            'work_site_name'     => 'required|max:255',
            'work_site_location' => 'required|max:255',
            'is_active'          => 'required',
            "updated_by"         => 'required',
        ];
        $messages = [
            'work_site_name.required'     => 'Work site name required',
            'work_site_name.max'          => 'Max: 255 characters',
            'work_site_location.required' => 'Work site location required',
            'work_site_location.max'      => 'Max: 255 characters',
            'is_active.required'          => 'Status required',
            'updated_by.required'         => 'Created by required',
        ];

        $validator = Validator::make($req->all(), $rules, $messages);

        if ($validator->fails()) {
            return response()->json(['statusCode' => 400, 'message' => 'Recorrect errors', 'errors' => $validator->errors()], 400);
        } else {

            DB::table('mm_work_site')->where("work_site_id", "=", $workSiteID)->update([
                'work_site_name'     => $req->input("work_site_name"),
                'work_site_location' => $req->input("work_site_location"),
                'is_active'          => $req->input("is_active"),
                'updated_by'         => $req->input("updated_by"),
                'updated_date_time'  => date("Y-m-d H:i:s"),
            ]);

            return response()->json(['statusCode' => 201, 'message' => 'Successfully updated work site'], 201);
        }
    }

    public function deleteWorkSite(Request $req)
    {
        $workSiteID = $req->work_site_id;

        $workSiteDlt = DB::table('mm_work_site')->where('work_site_id', '=', $workSiteID)->delete();

        if ($workSiteDlt) {
            DB::table('note_books')->where('work_site', '=', $workSiteID)->delete();
            return response()->json(['statusCode' => 201, 'message' => 'Successfully deleted work site'], 201);
        } else {
            return response()->json(['statusCode' => 500, 'message' => 'Internal server error'], 500);
        }
    }

}
