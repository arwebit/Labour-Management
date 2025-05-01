<?php
namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\LabourWages;
use App\Models\Query;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator as Validator;

class LabourWagesController extends Controller
{
    public function getAllLabourWages()
    {
        $sortField = "wages_id";
        $sort      = 'asc';
        $query     = LabourWages::with(["labour" => function ($q1) {
            $q1->select("user_id", "full_name");
        }, "created_by" => function ($q2) {
            $q2->select("user_id", "full_name");
        }, "updated_by" => function ($q3) {
            $q3->select("user_id", "full_name");
        }]);

        $totalRows = $query->count();

        if ($totalRows > 0) {
            $response = [
                "statusCode" => 200,
                "message"    => "Records found",
                "total_rows" => $totalRows,
                "rows"       => $query->orderBy($sortField, $sort)->get(),
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

    public function getLabourWages(Request $req)
    {
        $condition = $req->input('filter')['condition'] ?? [];
        $start     = $req->input('start_row');
        $records   = $req->input('page_records');
        $sortField = $req->input('sort_field') == "" ? "wages_id" : $req->input('sort_field');
        $sort      = $req->input('sort') == -1 ? 'desc' : 'asc';
        $query     = LabourWages::with(["labour" => function ($q1) {
            $q1->select("user_id", "full_name");
        }, "created_by" => function ($q2) {
            $q2->select("user_id", "full_name");
        }, "updated_by" => function ($q3) {
            $q3->select("user_id", "full_name");
        }]);

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

    public function createLabourWages(Request $req)
    {
        $rules = [
            'labour'       => 'required',
            'payment_date' => 'required',
            'paid_amount'  => 'required|numeric',
            'payment_type' => 'required',
            "created_by"   => 'required',
        ];
        $messages = [
            'labour.required'       => 'Labour required',
            'payment_date.required' => 'Payment Date required',
            'paid_amount.required'  => 'Paid amount required',
            'paid_amount.numeric'   => 'Paid amount must be numeric',
            'payment_type.required' => 'Payment type required',
            'created_by.required'   => 'Updated by required',
        ];

        $validator = Validator::make($req->all(), $rules, $messages);

        if ($validator->fails()) {
            return response()->json(['statusCode' => 400, 'message' => 'Recorrect errors', 'errors' => $validator->errors()], 400);
        } else {
            $saveLabourWages = DB::table('labour_wages')->insert(
                [
                    'labour'            => $req->input("labour"),
                    'payment_date'      => $req->input("payment_date"),
                    'paid_amount'       => $req->input("paid_amount"),
                    'payment_type'      => $req->input("payment_type"),
                    'created_by'        => $req->input("created_by"),
                    'created_date_time' => date("Y-m-d H:i:s"),
                ]);

            if ($saveLabourWages) {
                return response()->json(['statusCode' => 201, 'message' => 'Successfully saved labour wages'], 201);
            } else {
                return response()->json(['statusCode' => 500, 'message' => 'Internal server error'], 500);
            }
        }
    }

    public function updateLabourWages(Request $req)
    {
        $wagesID = $req->wages_id;

        $rules = [
            'labour'       => 'required',
            'payment_date' => 'required',
            'paid_amount'  => 'required|numeric',
            'payment_type' => 'required',
            "updated_by"   => 'required',
        ];
        $messages = [
            'labour.required'       => 'Labour required',
            'payment_date.required' => 'Payment Date required',
            'paid_amount.required'  => 'Paid amount required',
            'paid_amount.numeric'   => 'Paid amount must be numeric',
            'payment_type.required' => 'Payment type required',
            'updated_by.required'   => 'Updated by required',
        ];

        $validator = Validator::make($req->all(), $rules, $messages);

        if ($validator->fails()) {
            return response()->json(['statusCode' => 400, 'message' => 'Recorrect errors', 'errors' => $validator->errors()], 400);
        } else {
            DB::table('labour_wages')->where('wages_id', '=', $wagesID)->update(
                [
                    'labour'            => $req->input("labour"),
                    'payment_date'      => $req->input("payment_date"),
                    'paid_amount'       => $req->input("paid_amount"),
                    'payment_type'      => $req->input("payment_type"),
                    'updated_by'        => $req->input("updated_by"),
                    'updated_date_time' => date("Y-m-d H:i:s"),
                ]);

            return response()->json(['statusCode' => 201, 'message' => 'Successfully saved labour wages'], 201);
        }
    }

    public function deleteLabourWages(Request $req)
    {
        $wagesID = $req->wages_id;

        $wageDlt = DB::table('labour_wages')->where('wages_id', '=', $wagesID)->delete();

        if ($wageDlt) {
            return response()->json(['statusCode' => 201, 'message' => 'Successfully deleted labour wage'], 201);
        } else {
            return response()->json(['statusCode' => 500, 'message' => 'Internal server error'], 500);
        }
    }

    public function getTotalPayment(Request $req)
    {
        $labour   = $req->input("labour");
        $fromDate = $req->input("from_date");
        $toDate   = $req->input("to_date");

        $query = DB::table('labour_wages')
            ->select('payment_type', DB::raw('SUM(paid_amount) as payment'))
            ->where("labour", "=", $labour);

        if ($fromDate && $toDate) {
            $condition = [
                ["payment_date", "between", [$fromDate, $toDate]],
            ];
        } else {
            $condition = [];
        }

        $query = Query::filters($query, $condition)
            ->groupBy('payment_type');

        $rows = $query->get();

        $totalWages = $rows->sum('payment');
        $totalRows  = $rows->count();

        if ($totalRows > 0) {
            $response = [
                "statusCode"    => 200,
                "message"       => "Records found",
                "total_payment" => $totalWages,
                "rows"          => $rows,
            ];
        } else {
            $response = [
                "statusCode"    => 200,
                "message"       => "No records found",
                "total_payment" => 0,
                "rows"          => [],
            ];
        }

        return response()->json($response, 200);
    }

}
