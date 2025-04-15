<?php
namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\Query;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator as Validator;

class AttendanceController extends Controller
{
    public function getAllAttendance()
    {
        $sortField = "attendance_id";
        $sort      = 'asc';
        $query     = Attendance::with(["labour" => function ($q1) {
            $q1->select("user_id", "full_name");
        }, "work_site"])->select()
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

    public function getAttendance(Request $req)
    {
        $condition = $req->input('filter')['condition'] ?? [];
        $start     = $req->input('start_row');
        $records   = $req->input('page_records');
        $sortField = $req->input('sort_field') == "" ? "attendance_id" : $req->input('sort_field');
        $sort      = $req->input('sort') == -1 ? 'desc' : 'asc';
        $query     = Attendance::with(["labour" => function ($q1) {
            $q1->select("user_id", "full_name");
        }, "work_site"])->select();

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

    public function checkIn(Request $req)
    {
        $rules = [
            'labour'    => 'required',
            'check_in'  => 'required',
            'work_site' => 'required',
            'work_date' => 'required',
            "location"  => 'required',
            "latitude"  => 'required',
            "longitude" => 'required',
        ];
        $messages = [
            'labour.required'    => 'Labour required',
            'check_in.required'  => 'Check in required',
            'work_site.required' => 'labour attendance required',
            'work_date.required' => 'Work date required',
            'location.required'  => 'Location required',
            'latitude.required'  => 'Latitude required',
            'longitude.required' => 'Longitude required',
        ];

        $validator = Validator::make($req->all(), $rules, $messages);

        if ($validator->fails()) {
            return response()->json(['statusCode' => 400, 'message' => 'Recorrect errors', 'errors' => $validator->errors()], 400);
        } else {

            $saveAttendance = DB::table('labour_attendance')->insert([
                'labour'    => $req->input("labour"),
                'check_in'  => $req->input("check_in"),
                'work_site' => $req->input("work_site"),
                'work_date' => $req->input("work_date"),
                'location'  => $req->input("location"),
                'latitude'  => $req->input("latitude"),
                'longitude' => $req->input("longitude"),
            ]);

            if ($saveAttendance) {
                return response()->json(['statusCode' => 201, 'message' => 'Successfully created labour attendance'], 201);
            } else {
                return response()->json(['statusCode' => 500, 'message' => 'Internal server error'], 500);
            }
        }
    }

    public function checkOut(Request $req)
    {
        $attendanceID = $req->attendance_id;

        $rules = [
            'check_out'   => 'required',
            'description' => 'required|max:1000000',
            "location"    => 'required',
            "latitude"    => 'required',
            "longitude"   => 'required',
        ];
        $messages = [
            'description.required' => 'Description required',
            'description.max'      => 'Max: 1000000 characters',
            'check_out.required'   => 'Check out required',
            'location.required'    => 'Location required',
            'latitude.required'    => 'Latitude required',
            'longitude.required'   => 'Longitude required',
        ];

        $validator = Validator::make($req->all(), $rules, $messages);

        if ($validator->fails()) {
            return response()->json(['statusCode' => 400, 'message' => 'Recorrect errors', 'errors' => $validator->errors()], 400);
        } else {
            DB::table('labour_attendance')->where("attendance_id", "=", $attendanceID)->update([
                'check_out'   => $req->input("check_out"),
                'description' => $req->input("description"),
                'location'    => $req->input("location"),
                'latitude'    => $req->input("latitude"),
                'longitude'   => $req->input("longitude"),
            ]);

            return response()->json(['statusCode' => 201, 'message' => 'Successfully updated labour attendance'], 201);
        }
    }

    public function deleteAttendance(Request $req)
    {
        $attendanceID = $req->attendance_id;

        $AttendanceDlt = DB::table('labour_attendance')->where('attendance_id', '=', $attendanceID)->delete();

        if ($AttendanceDlt) {
            DB::table('note_books')->where('work_site', '=', $attendanceID)->delete();
            return response()->json(['statusCode' => 201, 'message' => 'Successfully deleted labour attendance'], 201);
        } else {
            return response()->json(['statusCode' => 500, 'message' => 'Internal server error'], 500);
        }
    }

    public function getNoOfWages(Request $req)
    {
        $labour   = $req->input("labour");
        $fromDate = $req->input("from_date");
        $toDate   = $req->input("to_date");

        $query = DB::table('labour_attendance')
            ->select('work_date', DB::raw('COUNT(*) as no_of_wages'))
            ->where("labour", "=", $labour);

        if ($fromDate && $toDate) {
            $condition = [
                ["work_date", "between", [$fromDate, $toDate]],
            ];
        } else {
            $condition = [];
        }

        $condition = [["check_in", "not null"],
            ["check_out", "not null"]];

        $query = Query::filters($query, $condition)
            ->groupBy('work_date');

        $rows = $query->get();

        $totalWages = $rows->sum('no_of_wages');
        $totalRows  = $rows->count();

        if ($totalRows > 0) {
            $response = [
                "statusCode"  => 200,
                "message"     => "Records found",
                "total_wages" => $totalWages,
                "rows"        => $rows,
            ];
        } else {
            $response = [
                "statusCode"  => 200,
                "message"     => "No records found",
                "total_wages" => 0,
                "rows"        => [],
            ];
        }

        return response()->json($response, 200);
    }

}
