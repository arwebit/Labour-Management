<?php
namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Machines;
use App\Models\MachinesTransfer;
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
            $sortField = "full_name";
            $sort      = 'asc';

            $labourID = $this->getLabourID();

            $query = DB::table('user_details')->select('user_id', 'full_name')
                ->where('user_id', '>', 1)->where('user_role', '=', $labourID)->orderBy($sortField, $sort)
                ->offset($start)
                ->limit($records);

            $usersData    = $query->get();
            $responseRows = [];

            foreach ($usersData as $user) {
                $userID = $user->user_id;

                $obData = DB::table('labour_attendance')
                    ->select(DB::raw('SUM(labour_rate * no_of_wages) as payable_amount'))
                    ->fromSub(function ($query) use ($fromDate, $toDate) {
                        $query->select('labour', 'labour_rate', DB::raw('COUNT(*) as no_of_wages'))
                            ->from('labour_attendance')
                            ->where('work_date', "<", $fromDate)
                            ->groupBy('labour', 'labour_rate');
                    }, 't')
                    ->where('labour', '=', $userID)
                    ->groupBy('labour')
                    ->first();

                $payableAmountData = DB::table('labour_attendance')
                    ->select(DB::raw('SUM(labour_rate * no_of_wages) as payable_amount'))
                    ->fromSub(function ($query) use ($fromDate, $toDate) {
                        $query->select('labour', 'labour_rate', DB::raw('COUNT(*) as no_of_wages'))
                            ->from('labour_attendance')
                            ->whereBetween('work_date', [$fromDate, $toDate])
                            ->groupBy('labour', 'labour_rate');
                    }, 't')
                    ->where('labour', '=', $userID)
                    ->groupBy('labour')
                    ->first();

                $pwagesAmount = DB::table('labour_wages')
                    ->select(DB::raw('SUM(paid_amount) as payable_amount'))
                    ->where('labour', '=', $userID)
                    ->where('payment_date', '<', $fromDate)
                    ->groupBy('labour')
                    ->first();

                $wagesAmount = DB::table('labour_wages')
                    ->select(DB::raw('SUM(paid_amount) as payable_amount'))
                    ->where('labour', '=', $userID)
                    ->whereBetween('payment_date', [$fromDate, $toDate])
                    ->groupBy('labour')
                    ->first();

                $ob             = $obData ? (float) $obData->payable_amount : 0;
                $prevAmount     = $pwagesAmount ? (float) $pwagesAmount->payable_amount : 0;
                $openingBalance = $ob - $prevAmount;
                $payableAmount  = $payableAmountData ? (float) $payableAmountData->payable_amount : 0;
                $paidAmount     = $wagesAmount ? (float) $wagesAmount->payable_amount : 0;
                $closingBalance = $openingBalance + $payableAmount - $paidAmount;

                $responseRows[] = [
                    'labour_id'       => $userID,
                    'labour_name'     => $user->full_name,
                    "opening_balance" => $openingBalance,
                    'payable_amount'  => $payableAmount,
                    "paid_amount"     => $paidAmount,
                    "closing_balance" => $closingBalance,
                ];
            }

            $response = [
                "statusCode" => 200,
                "message"    => "Records found",
                "rows"       => $responseRows,
            ];

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
            $sortField = "full_name";
            $sort      = 'asc';

            $labourID = $this->getLabourID();

            $query = DB::table('user_details')->select('user_id', 'full_name')
                ->where('user_id', '>', 1)->where('user_role', '=', $labourID)->orderBy($sortField, $sort)
                ->offset($start)
                ->limit($records);

            $usersData = $query->get();

            foreach ($usersData as $user) {
                $userID         = $user->user_id;
                $openingBalance = 0;
                $advanceAmount  = 0;
                $receiveAmount  = 0;
                $closingBalance = 0;

                $obData = DB::table('labour_special_wages')
                    ->select('payment_type', DB::raw('SUM(payment) as total_payment'))
                    ->where('labour', "=", $userID)
                    ->where('payment_date', '<', $fromDate)
                    ->groupBy('payment_type')
                    ->get();

                $currData = DB::table('labour_special_wages')
                    ->select('payment_type', DB::raw('SUM(payment) as total_payment'))
                    ->where('labour', "=", $userID)
                    ->whereBetween('payment_date', [$fromDate, $toDate])
                    ->groupBy('payment_type')
                    ->get();

                $padvance = 0;
                $precieve = 0;

                foreach ($obData as $obRow) {
                    if ($obRow->payment_type == 'advance') {
                        $padvance = $obRow->total_payment;
                    } else if ($obRow->payment_type == 'receive') {
                        $precieve = $obRow->total_payment;
                    }
                }

                foreach ($currData as $currRow) {
                    if ($currRow->payment_type == 'advance') {
                        $advanceAmount = $currRow->total_payment;
                    } else if ($currRow->payment_type == 'receive') {
                        $receiveAmount = $currRow->total_payment;
                    }
                }

                $openingBalance = $padvance - $precieve;
                $closingBalance = $openingBalance + $advanceAmount - $receiveAmount;

                $responseRows[] = [
                    'labour_id'       => $userID,
                    'labour_name'     => $user->full_name,
                    "opening_balance" => $openingBalance,
                    'advance'         => $advanceAmount,
                    "receive"         => $receiveAmount,
                    "closing_balance" => $closingBalance,
                ];
            }
            $response = [
                "statusCode" => 200,
                "message"    => "Records found",
                "rows"       => $responseRows,
            ];
            return response()->json($response, 200);
        }
    }

    public function getNOOfMachines()
    {

        $sortField = 'machine_id';
        $sort      = 'asc';

        $query = Machines::with(["work_site", "created_by"]);

        $totalRows = $query->count();
        $db        = $query->orderBy($sortField, $sort)->get();

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

    public function getNOOfMachinesTransfered(Request $req)
    {
        $rules = [
            'from_date' => 'required',
            'to_date'   => 'required',

        ];
        $messages = [
            'from_date.required' => 'From Date required',
            'to_date.required'   => 'To Date required',
        ];

        $validator = Validator::make($req->all(), $rules, $messages);

        if ($validator->fails()) {
            return response()->json(['statusCode' => 400, 'message' => 'Recorrect errors', 'errors' => $validator->errors()], 400);
        } else {
            $fromDate  = $req->input("from_date");
            $toDate    = $req->input("to_date");
            $sortField = 'transfered_date_time';
            $sort      = 'asc';

            $query = MachinesTransfer::with(["source_work_site", "destination_work_site", "transfered_by"])->where("transfered_date_time", ">=", $fromDate . " 00:00:00")->where("transfered_date_time", "<=", $toDate . " 23:59:59")->select();

            $totalRows = $query->count();
            $db        = $query->orderBy($sortField, $sort)->get();

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
        }
        return response()->json($response, 200);

    }

    private function getLabourID()
    {
        $labourID = "";
        $query    = DB::table("master_role")->select()->where("role_name", "=", "Labour")->first();
        $labourID = $query->role_id;
        return $labourID;
    }
}
