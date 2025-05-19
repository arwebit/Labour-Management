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
            $sortField = $req->input('sort_field') == "" ? "a.full_name" : $req->input('sort_field');
            $sort      = $req->input('sort') == -1 ? 'desc' : 'asc';

            $labourID = $this->getLabourID();

            // Fetch raw data
            $query = DB::table('user_details as a')
                ->leftJoin('labour_attendance as b', 'a.user_id', '=', 'b.labour')
                ->select('a.user_id', 'a.full_name as labour_name', 'b.wage_type_desc', DB::raw('COUNT(*) as no_of_attendances'))
                ->where("a.user_role", "=", $labourID)
				->where('a.is_active', '=', 'yes')
                ->whereBetween('b.work_date', [$fromDate, $toDate])
                ->whereNotNull('b.check_in')
                ->whereNotNull('b.check_out')
                ->groupBy('a.user_id', 'a.full_name', 'b.wage_type_desc');

            $rawData = $query->orderBy($sortField, $sort)->get();

            $groupedData = [];

            foreach ($rawData as $row) {
                $userId = $row->user_id;

                if (! isset($groupedData[$userId])) {
                    $groupedData[$userId] = [
                        'user_id'     => $userId,
                        'labour_name' => $row->labour_name,
                        'attendance'  => [
                            'total_attendance' => 0,
                            'attendance_types' => [],
                        ],
                    ];
                }

                $groupedData[$userId]['attendance']['total_attendance'] += $row->no_of_attendances;
                $groupedData[$userId]['attendance']['attendance_types'][] = [
                    'wage_type_desc'    => $row->wage_type_desc,
                    'no_of_attendances' => $row->no_of_attendances,
                ];
            }

            $groupedArray = array_values($groupedData);

            $pagedData = array_slice($groupedArray, $start, $records);
            $totalRows = count($pagedData);

            $response = [
                "statusCode" => 200,
                "message"    => $totalRows > 0 ? "Records found" : "No records found",
                "total_rows" => $totalRows,
                "rows"       => $pagedData,
            ];

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
            return response()->json([
                'statusCode' => 400,
                'message'    => 'Recorrect errors',
                'errors'     => $validator->errors(),
            ], 400);
        } else {
            $fromDate  = $req->input("from_date");
            $toDate    = $req->input("to_date");
            $start     = $req->input("start");
            $records   = $req->input("page_records");
            $sortField = "full_name";
            $sort      = 'asc';

            $labourID = $this->getLabourID();

            $query = DB::table('user_details')->select('user_id', 'full_name')
                ->where('user_id', '>', 1)
				->where('is_active', '=', 'yes')
                ->where('user_role', '=', $labourID)
                ->orderBy($sortField, $sort)
                ->offset($start)
                ->limit($records);

            $usersData    = $query->get();
            $responseRows = [];

            foreach ($usersData as $user) {
                $userID = $user->user_id;

                $obData = DB::table('labour_attendance')
                    ->select(DB::raw('SUM(labour_rate * no_of_wages) as payable_amount'))
                    ->fromSub(function ($query) use ($fromDate) {
                        $query->select('labour', 'labour_rate', DB::raw('COUNT(*) as no_of_wages'))
                            ->from('labour_attendance')
                            ->where('work_date', "<", $fromDate)
                            ->whereNotNull("check_in")
                            ->whereNotNull("check_out")
                            ->groupBy('labour', 'labour_rate');
                    }, 't')
                    ->where('labour', '=', $userID)
                    ->groupBy('labour')
                    ->first();

                $wagesData = DB::table('labour_attendance')
                    ->select("labour_rate", "wage_type_desc", "wage_type_value", DB::raw('COUNT(*) as total_wages'))
                    ->where('labour', '=', $userID)
                    ->whereBetween('work_date', [$fromDate, $toDate])
                    ->whereNotNull("check_in")
                    ->whereNotNull("check_out")
                    ->groupBy("labour_rate", "wage_type_desc", "wage_type_value")
                    ->get();

                $payableAmountData = DB::table('labour_attendance')
                    ->select(DB::raw('SUM(labour_rate * no_of_wages * wage_type_value) as payable_amount'))
                    ->fromSub(function ($query) use ($fromDate, $toDate) {
                        $query->select('labour', 'labour_rate', 'wage_type_value', DB::raw('COUNT(*) as no_of_wages'))
                            ->from('labour_attendance')
                            ->whereBetween('work_date', [$fromDate, $toDate])
                            ->whereNotNull("check_in")
                            ->whereNotNull("check_out")
                            ->groupBy('labour', 'labour_rate', 'wage_type_value');
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

                // Opening balance
                $ob             = $obData ? (float) $obData->payable_amount : 0;
                $prevAmount     = $pwagesAmount ? (float) $pwagesAmount->payable_amount : 0;
                $openingBalance = $ob - $prevAmount;

                // Payable wages
                $payableAmount = $payableAmountData ? (float) $payableAmountData->payable_amount : 0;

                // Total wages count
                $totalWages = 0;
                foreach ($wagesData as $wage) {
                    $totalWages += $wage->total_wages;
                }

                $wages = [
                    'total_payable_amount' => $payableAmount,
                    'total_wages'          => $totalWages,
                    'wage_details'         => $wagesData,
                ];

                $paidAmount     = $wagesAmount ? (float) $wagesAmount->payable_amount : 0;
                $closingBalance = $openingBalance + $payableAmount - $paidAmount;

                $responseRows[] = [
                    'labour_id'       => $userID,
                    'labour_name'     => $user->full_name,
                    "opening_balance" => $openingBalance,
                    'wages'           => $wages,
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
                ->where('user_id', '>', 1)
				->where('is_active', '=', 'yes')
				->where('user_role', '=', $labourID)->orderBy($sortField, $sort)
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
