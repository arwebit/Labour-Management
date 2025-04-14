<?php
namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Query;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator as Validator;

class LabourRatesController extends Controller
{
    public function getAllLabourRates()
    {
        $sortField = "user_id";
        $sort      = 'asc';
        $query     = DB::table('user_details')
            ->leftjoin('labour_rates', 'user_details.user_id', '=', 'labour_rates.labour')
            ->leftjoin('user_details as created_by', 'labour_rates.created_by', '=', 'created_by.user_id')
            ->select("user_details.user_id", "user_details.full_name", "labour_rates.rate_id", "labour_rates.labour_rate", "labour_rates.created_date_time", "created_by.full_name as created_by")
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

    public function getLabourRates(Request $req)
    {
        $condition = $req->input('filter')['condition'] ?? [];
        $start     = $req->input('start_row');
        $records   = $req->input('page_records');
        $sortField = $req->input('sort_field') == "" ? "labour_rates.rate_id" : $req->input('sort_field');
        $sort      = $req->input('sort') == -1 ? 'desc' : 'asc';
        $query     = DB::table('user_details')
            ->leftjoin('labour_rates', 'user_details.user_id', '=', 'labour_rates.labour')
            ->leftjoin('user_details as created_by', 'labour_rates.created_by', '=', 'created_by.user_id')
            ->select("user_details.user_id", "user_details.full_name", "labour_rates.rate_id", "labour_rates.labour_rate", "labour_rates.created_date_time", "created_by.full_name as created_by");

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

    public function saveLabourRates(Request $req)
    {
        $rules = [
            'labour'      => 'required|max:255',
            'labour_rate' => 'required|numeric',
            "created_by"  => 'required',
        ];
        $messages = [
            'labour.required'      => 'Labour required',
            'labour_rate.numeric'  => 'Only numbers allowed',
            'labour_rate.required' => 'Labour rate required',
            'created_by.required'  => 'Created by required',
        ];

        $validator = Validator::make($req->all(), $rules, $messages);

        if ($validator->fails()) {
            return response()->json(['statusCode' => 400, 'message' => 'Recorrect errors', 'errors' => $validator->errors()], 400);
        } else {
            $saveLabourRates = DB::table('labour_rates')->updateOrInsert(
                ['labour' => $req->input("labour")],
                [
                    'labour_rate'       => $req->input("labour_rate"),
                    'created_by'        => $req->input("created_by"),
                    'created_date_time' => date("Y-m-d H:i:s"),
                ]);

            if ($saveLabourRates) {
                return response()->json(['statusCode' => 201, 'message' => 'Successfully saved labour rates'], 201);
            } else {
                return response()->json(['statusCode' => 500, 'message' => 'Internal server error'], 500);
            }
        }
    }

    public function deleteLabourRates(Request $req)
    {
        $rateID = $req->rate_id;

        $LabourRatesDlt = DB::table('labour_rates')->where('rate_id', '=', $rateID)->delete();

        if ($LabourRatesDlt) {
            return response()->json(['statusCode' => 201, 'message' => 'Successfully deleted labour rate'], 201);
        } else {
            return response()->json(['statusCode' => 500, 'message' => 'Internal server error'], 500);
        }
    }

}
