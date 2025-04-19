<?php
namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\LabourSpclWages;
use App\Models\Query;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator as Validator;

class LabourSpclWagesController extends Controller
{
    public function getAllLabourSpclWages()
    {
        $sortField = "spcl_wage_id";
        $sort      = 'asc';
        $query     = LabourSpclWages::with(["labour" => function ($q1) {
            $q1->select("user_id", "full_name");
        }, "updated_by" => function ($q4) {
            $q4->select("user_id", "full_name");
        }]);

        $totalRows = $query->count();
        $payments  = DB::table('labour_special_wages')
            ->select('payment_type', DB::raw('SUM(payment) as payment'))->groupBy('payment_type')->get();

        if ($totalRows > 0) {
            $response = [
                "statusCode"     => 200,
                "message"        => "Records found",
                "total_rows"     => $totalRows,
                "total_payments" => $payments,
                "rows"           => $query->orderBy($sortField, $sort)->get(),
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

    public function getLabourSpclWages(Request $req)
    {
        $condition = $req->input('filter')['condition'] ?? [];
        $start     = $req->input('start_row');
        $records   = $req->input('page_records');
        $sortField = $req->input('sort_field') == "" ? "spcl_wage_id" : $req->input('sort_field');
        $sort      = $req->input('sort') == -1 ? 'desc' : 'asc';
        $query     = LabourSpclWages::with(["labour" => function ($q1) {
            $q1->select("user_id", "full_name");
        }, "updated_by" => function ($q4) {
            $q4->select("user_id", "full_name");
        }]);

        $query = Query::filters($query, $condition);

        $totalRows         = $query->count();
        $noOfRequiredPages = ceil($totalRows / $records);
        $db                = $query->offset($start)->limit($records)->orderBy($sortField, $sort)->get();

        $payments = DB::table('labour_special_wages')
            ->select('payment_type', DB::raw('SUM(payment) as payment'));

        $payments = Query::filters($payments, $condition)->groupBy('payment_type')->get();

        if ($totalRows > 0) {
            $response = [
                "statusCode"           => 200,
                "message"              => "Records found",
                "total_payments"       => $payments,
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

    public function createLabourSpclWages(Request $req)
    {
        $rules = [
            'labour'       => 'required',
            'payment_date' => 'required',
            'payment'      => 'required|numeric',
            'payment_type' => 'required',
            'description'  => 'max:255',
            "created_by"   => 'required',
        ];
        $messages = [
            'labour.required'       => 'Labour required',
            'payment_date.required' => 'Payment Date required',
            'payment.required'      => 'Payment required',
            'payment.numeric'       => 'Payment must be numeric',
            'payment_type.required' => 'Payment type required',
            'description.max'       => 'Maximum : 255 characters',
            'created_by.required'   => 'Updated by required',
        ];

        $validator = Validator::make($req->all(), $rules, $messages);

        if ($validator->fails()) {
            return response()->json(['statusCode' => 400, 'message' => 'Recorrect errors', 'errors' => $validator->errors()], 400);
        } else {
            $saveLabourSpclWages = DB::table('labour_special_wages')->insert(
                [
                    'labour'            => $req->input("labour"),
                    'payment_date'      => $req->input("payment_date"),
                    'payment'           => $req->input("payment"),
                    'payment_type'      => $req->input("payment_type"),
                    'description'       => $req->input("description"),
                    'created_by'        => $req->input("created_by"),
                    'created_date_time' => date("Y-m-d H:i:s"),
                ]);

            if ($saveLabourSpclWages) {
                return response()->json(['statusCode' => 201, 'message' => 'Successfully saved labour special wage'], 201);
            } else {
                return response()->json(['statusCode' => 500, 'message' => 'Internal server error'], 500);
            }
        }
    }

    public function updateLabourSpclWages(Request $req)
    {
        $spclWageID = $req->spcl_wage_id;

        $rules = [
            'labour'       => 'required',
            'payment_date' => 'required',
            'payment'      => 'required|numeric',
            'payment_type' => 'required',
            'description'  => 'max:255',
            "updated_by"   => 'required',
        ];
        $messages = [
            'labour.required'       => 'Labour required',
            'payment_date.required' => 'Payment Date required',
            'payment.required'      => 'Payment required',
            'payment.numeric'       => 'Payment must be numeric',
            'payment_type.required' => 'Payment type required',
            'description.max'       => 'Maximum : 255 characters',
            'updated_by.required'   => 'Updated by required',
        ];

        $validator = Validator::make($req->all(), $rules, $messages);

        if ($validator->fails()) {
            return response()->json(['statusCode' => 400, 'message' => 'Recorrect errors', 'errors' => $validator->errors()], 400);
        } else {
            $saveLabourSpclWages = DB::table('labour_special_wages')->where('spcl_wage_id', '=', $spclWageID)->update(
                [
                    'labour'            => $req->input("labour"),
                    'payment_date'      => $req->input("payment_date"),
                    'payment'           => $req->input("payment"),
                    'payment_type'      => $req->input("payment_type"),
                    'description'       => $req->input("description"),
                    'updated_by'        => $req->input("updated_by"),
                    'updated_date_time' => date("Y-m-d H:i:s"),
                ]);

            if ($saveLabourSpclWages) {
                return response()->json(['statusCode' => 201, 'message' => 'Successfully saved labour special wage'], 201);
            } else {
                return response()->json(['statusCode' => 500, 'message' => 'Internal server error'], 500);
            }
        }
    }

    public function deleteLabourSpclWages(Request $req)
    {
        $spclWageID = $req->spcl_wage_id;

        $wageDlt = DB::table('labour_special_wages')->where('spcl_wage_id', '=', $spclWageID)->delete();

        if ($wageDlt) {
            return response()->json(['statusCode' => 201, 'message' => 'Successfully deleted labour special wage'], 201);
        } else {
            return response()->json(['statusCode' => 500, 'message' => 'Internal server error'], 500);
        }
    }

    public function getTotalPayment(Request $req)
    {
        $labour   = $req->input("labour");
        $fromDate = $req->input("from_date");
        $toDate   = $req->input("to_date");

        $query = DB::table('labour_special_wages')
            ->select('payment_type', DB::raw('SUM(payment) as payment'))
            ->where("labour", "=", $labour);

        if ($fromDate && $toDate) {
            $condition = [
                ["payment_date", ">=", $fromDate],
                ["payment_date", "<=", $toDate],
            ];
        } else {
            $condition = [];
        }

        $query = Query::filters($query, $condition)
            ->groupBy('payment_type');

        $rows = $query->get();

        $receipt = 0;
        $payment = 0;

        foreach ($rows as $row) {
            if ($row->payment_type === 'receipt') {
                $receipt = $row->payment;
            } elseif ($row->payment_type === 'payment') {
                $payment = $row->payment;
            }
        }

        $balance = $payment - $receipt;

        $response = [
            "statusCode" => 200,
            "message"    => (count($rows) > 0) ? "Records found" : "No records found",
            "balance"    => $balance,
            "payment"    => $payment,
            "receipt"    => $receipt,
        ];

        return response()->json($response, 200);
    }

}
