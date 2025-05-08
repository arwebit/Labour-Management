<?php
namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\Query;
use App\Models\WorkSite;
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
            'labour'      => 'required',
            'labour_rate' => 'required',
            'check_in'    => 'required',
            'work_site'   => 'required',
            'work_date'   => 'required',
            "location"    => 'required',
        ];
        $messages = [
            'labour.required'    => 'Labour required',
            'labour_rate'        => 'Labour wages required',
            'check_in.required'  => 'Check in required',
            'work_site.required' => 'labour attendance required',
            'work_date.required' => 'Work date required',
            'location.required'  => 'Location required',
        ];

        $validator = Validator::make($req->all(), $rules, $messages);

        if ($validator->fails()) {
            return response()->json(['statusCode' => 400, 'message' => 'Recorrect errors', 'errors' => $validator->errors()], 400);
        } else {

            $saveAttendance = DB::table('labour_attendance')->insert([
                'labour'             => $req->input("labour"),
                'labour_rate'        => $req->input("labour_rate"),
                'check_in'           => $req->input("check_in"),
                'work_site'          => $req->input("work_site"),
                'work_date'          => $req->input("work_date"),
                'check_in_location'  => $req->input("location"),
                'check_in_latitude'  => $req->input("latitude"),
                'check_in_longitude' => $req->input("longitude"),
            ]);

            if ($saveAttendance) {
                return response()->json(['statusCode' => 201, 'message' => 'Successfully checked in'], 201);
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
        ];
        $messages = [
            'description.required' => 'Description required',
            'description.max'      => 'Max: 1000000 characters',
            'check_out.required'   => 'Check out required',
            'location.required'    => 'Location required',
        ];

        $validator = Validator::make($req->all(), $rules, $messages);

        if ($validator->fails()) {
            return response()->json(['statusCode' => 400, 'message' => 'Recorrect errors', 'errors' => $validator->errors()], 400);
        } else {
            DB::table('labour_attendance')->where("attendance_id", "=", $attendanceID)->update([
                'check_out'           => $req->input("check_out"),
                'description'         => $req->input("description"),
                'check_out_location'  => $req->input("location"),
                'check_out_latitude'  => $req->input("latitude"),
                'check_out_longitude' => $req->input("longitude"),
            ]);

            return response()->json(['statusCode' => 201, 'message' => 'Successfully checked out'], 201);
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

    public function getWorkSiteWithAttendance(Request $req)
    {
        $rules = [
            'labour'    => 'required',
            'work_date' => 'required',
        ];
        $messages = [
            'labour.required'    => 'Labour required',
            'work_date.required' => 'Work Date required',
        ];

        $validator = Validator::make($req->all(), $rules, $messages);

        if ($validator->fails()) {
            return response()->json([
                'statusCode' => 400,
                'message'    => 'Recorrect errors',
                'errors'     => $validator->errors(),
            ], 400);
        }

        $labour   = $req->input("labour");
        $workDate = $req->input("work_date");

        $userQuery = DB::table('user_details')
            ->select('full_name', 'user_id')
            ->where("user_id", $labour)
            ->first();

        $query = WorkSite::with(["attendance" => function ($q) use ($labour, $workDate) {
            $q->where("labour", $labour)
                ->where("work_date", $workDate);
        }])->select("work_site_id", "work_site_name", "work_site_location")->where("is_active", 'yes');

        if ($req->input("work_site")) {
            $condition = [["work_site_id", "=", $req->input("work_site")]];
            $query     = Query::filters($query, $condition);
        }

        $rows                 = $query->get();
        $hasOngoingAttendance = false;

        foreach ($rows as $row) {
            if (! empty($row->attendance)) {
                if (! empty($row->attendance->check_out)) {
                    $row->attendance_status = 'check-out';
                } else {
                    $row->attendance_status = 'present';
                    $hasOngoingAttendance   = true; // only count actual present
                }
            } else {
                $row->attendance_status = 'absent';
            }
        }

        $overallStatus = $hasOngoingAttendance ? 'present' : 'absent';

        return response()->json([
            "statusCode"        => 200,
            "message"           => "Records found",
            "labour"            => [
                "user_id"   => $userQuery->user_id ?? null,
                "full_name" => $userQuery->full_name ?? null,
            ],
            "attendance_status" => $overallStatus, // ⬅️ Add this
            "rows"              => $rows,
        ], 200);
    }

    public function getNoOfWagesRate(Request $req)
    {
        $labour   = $req->input("labour");
        $fromDate = $req->input("from_date");
        $toDate   = $req->input("to_date");

        $userQuery = DB::table('user_details')
            ->select('full_name', "user_id")
            ->where("user_id", "=", $labour)
            ->first();

        $query = DB::table('labour_attendance')
            ->select('labour_rate', DB::raw('COUNT(*) as no_of_wages'))
            ->where("labour", "=", $labour);

        if ($fromDate && $toDate) {
            $query->whereBetween('work_date', [$fromDate, $toDate]);
        }

        $query->whereNotNull('check_in')
            ->whereNotNull('check_out');

        $query->groupBy('labour_rate');

        $rows = $query->get();

        $totalDays  = $rows->sum('no_of_wages');
        $totalWages = $rows->sum(function ($row) {
            return $row->labour_rate * $row->no_of_wages;
        });

        $response = [
            "statusCode"  => 200,
            "message"     => $rows->count() > 0 ? "Records found" : "No records found",
            "total_days"  => $totalDays,
            "total_wages" => $totalWages,
            "labour"      => [
                "user_id"   => $userQuery->user_id ?? null,
                "full_name" => $userQuery->full_name ?? null,
            ],
            "rows"        => $rows,
        ];

        return response()->json($response, 200);
    }

    public function getListOfLabours(Request $req)
    {
        $rules = [
            'work_date' => 'required',
        ];
        $messages = [
            'work_date.required' => 'Work date required',
        ];

        $validator = Validator::make($req->all(), $rules, $messages);

        if ($validator->fails()) {
            return response()->json(['statusCode' => 400, 'message' => 'Recorrect errors', 'errors' => $validator->errors()], 400);
        } else {
            $labourID    = $this->getLabourID();
            $workDate    = $req->input("work_date");
            $start       = $req->input("start") ?? 0;
            $pageRecords = $req->input("page_records") ?? 10;

            $userData = DB::table('user_details as a')
                ->leftJoin('labour_attendance as b', function ($join) use ($workDate) {
                    $join->on('a.user_id', '=', 'b.labour');

                    if ($workDate) {
                        $join->where('b.work_date', '=', $workDate);
                    }
                })
                ->leftJoin('mm_work_site as c', 'c.work_site_id', '=', 'b.work_site')
                ->select(
                    'a.user_id',
                    'a.full_name',
                    'b.work_date',
                    'b.check_in',
                    'b.check_out',
                    'b.description',
                    'b.work_site',
                    'c.work_site_name',
                    'c.work_site_location'
                )
                ->where('a.user_role', $labourID)->orderBy("a.full_name", "asc")->offset($start)->limit($pageRecords)->get()->map(function ($item) {
                if (is_null($item->check_in) && is_null($item->check_out)) {
                    $item->attendance_status = 'Absent';
                } elseif (! is_null($item->check_in) && is_null($item->check_out)) {
                    $item->attendance_status = 'Present';
                } elseif (! is_null($item->check_in) && ! is_null($item->check_out)) {
                    $item->attendance_status = 'Checked Out';
                } else {
                    $item->attendance_status = 'Unknown';
                }
                return $item;
            });

            $response = ['statusCode' => 200, 'message' => 'Records Found', 'rows' => $userData];
            return response()->json($response, 200);
        }
    }

    private function getLabourID()
    {
        $labourID = "";
        $query    = DB::table("master_role")->select()->where("role_name", "=", "Labour")->first();
        $labourID = $query->role_id;
        return $labourID;
    }
}
