<?php
namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator as Validator;

class ReportsController extends Controller
{
    public function getLabourDetails(Request $req)
    {
        $labourID = $req->labour;

        $query = User::with(["labour_rate", "labour_attendance" => function ($attendance) {
            $attendance->with(["work_site" => function ($workSite) {
                $workSite->select("work_site_id", "work_site_name", "work_site_location");
            }])->orderBy("work_date", "desc");
        }, "labour_normal_payment" => function ($wages) {
            $wages->orderBy("payment_date", "desc");
        }, "labour_special_payment" => function ($spclWages) {
            $spclWages->orderBy("payment_date", "desc");
        }])
            ->select("user_id", "full_name", "aadhar_no", "pan_no", "mobile", "email")
            ->where("user_id", "=", $labourID);

        $totalRows = $query->count();

        $response = [
            "statusCode" => 200,
            "message"    => "Records found",
            "row"        => $query->first(),
        ];

        return response()->json($response, 200);

    }
    public function getLabourAttendance(Request $req)
    {
        $rules = [
            'from_date'    => 'required',
            'to_date'      => 'required',
            'start'        => 'required',
            'page_records' => 'required',

        ];
        $messages = [
            'from_date.required'    => 'From Date required',
            'to_date.required'      => 'To Date required',
            'start.required'        => 'Start required',
            'page_records.required' => 'Limit required',
        ];

        $validator = Validator::make($req->all(), $rules, $messages);

        if ($validator->fails()) {
            return response()->json(['statusCode' => 400, 'message' => 'Recorrect errors', 'errors' => $validator->errors()], 400);
        } else {
            $fromDate  = $req->input("from_date");
            $toDate    = $req->input("to_date");
            $start     = $req->input("start");
            $records   = $req->input("page_records");
            $sortField = $req->input('sort_field') == "" ? "b.full_name" : $req->input('sort_field');
            $sort      = $req->input('sort') == -1 ? 'desc' : 'asc';

            $query = DB::table('labour_attendance as a')
                ->join('user_details as b', 'a.labour', '=', 'b.user_id')
                ->select('b.full_name as labour_name', DB::raw('COUNT(*) as no_of_attendances'))
                ->whereBetween('a.work_date', [$fromDate, $toDate])
                ->whereNotNull('a.check_in')
                ->whereNotNull('a.check_out')
                ->groupBy('b.full_name');

            $totalRows         = $query->count();
            $noOfRequiredPages = ceil($totalRows / $records);
            $db                = $query->orderBy($sortField, $sort)->offset($start)->limit($records)->get();

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

    }

    public function getLabourNormalWages(Request $req)
    {
        $rules = [
            'from_date'    => 'required',
            'to_date'      => 'required',
            'start'        => 'required',
            'page_records' => 'required',

        ];
        $messages = [
            'from_date.required'    => 'From Date required',
            'to_date.required'      => 'To Date required',
            'start.required'        => 'Start required',
            'page_records.required' => 'Limit required',
        ];

        $validator = Validator::make($req->all(), $rules, $messages);

        if ($validator->fails()) {
            return response()->json(['statusCode' => 400, 'message' => 'Recorrect errors', 'errors' => $validator->errors()], 400);
        } else {
            $fromDate  = $req->input("from_date");
            $toDate    = $req->input("to_date");
            $start     = $req->input("start");
            $records   = $req->input("page_records");
            $sortField = $req->input('sort_field') == "" ? "b.full_name" : $req->input('sort_field');
            $sort      = $req->input('sort') == -1 ? 'desc' : 'asc';

            $query = DB::table('labour_wages as a')
                ->join('user_details as b', 'a.labour', '=', 'b.user_id')
                ->select('b.full_name as labour_name', DB::raw('SUM(a.paid_amount) as total_payment'))
                ->whereBetween('a.payment_date', [$fromDate, $toDate])
                ->groupBy('b.full_name');

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
    }

    public function getLabourSpecialWages(Request $req)
    {
        $rules = [
            'from_date'    => 'required',
            'to_date'      => 'required',
            'start'        => 'required',
            'page_records' => 'required',

        ];
        $messages = [
            'from_date.required'    => 'From Date required',
            'to_date.required'      => 'To Date required',
            'start.required'        => 'Start required',
            'page_records.required' => 'Limit required',
        ];

        $validator = Validator::make($req->all(), $rules, $messages);

        if ($validator->fails()) {
            return response()->json(['statusCode' => 400, 'message' => 'Recorrect errors', 'errors' => $validator->errors()], 400);
        } else {
            $fromDate  = $req->input("from_date");
            $toDate    = $req->input("to_date");
            $start     = $req->input("start");
            $records   = $req->input("page_records");
            $sortField = $req->input('sort_field') == "" ? "b.full_name" : $req->input('sort_field');
            $sort      = $req->input('sort') == -1 ? 'desc' : 'asc';

            $query = DB::table('labour_special_wages as a')
                ->join('user_details as b', 'a.labour', '=', 'b.user_id')
                ->select('b.full_name as labour_name', 'a.payment_type', DB::raw('SUM(a.payment) as total_payment'))
                ->whereBetween('a.payment_date', [$fromDate, $toDate])
                ->groupBy('b.full_name', 'a.payment_type');

            $totalRows         = $query->count();
            $noOfRequiredPages = ceil($totalRows / $records);
            $db                = $query->offset($start)->limit($records)->orderBy($sortField, $sort)->get();

            $groupedData = [];
            foreach ($db as $row) {
                $labourName = $row->labour_name;

                if (! isset($groupedData[$labourName])) {
                    $groupedData[$labourName] = [
                        'labour_name' => $labourName,
                    ];
                }

                $groupedData[$labourName][$row->payment_type] = $row->total_payment;
            }

            $groupedData = array_values($groupedData);
            if ($totalRows > 0) {
                $response = [
                    "statusCode"           => 200,
                    "message"              => "Records found",
                    "total_rows"           => $totalRows,
                    "page_rows"            => count($db),
                    "no_of_required_pages" => $noOfRequiredPages,
                    "rows"                 => $groupedData,
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

    }

}
