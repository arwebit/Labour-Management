<?php
namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\MachinesTransfer;
use App\Models\Query;
use App\Models\WorkSite;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator as Validator;

class MachineController extends Controller
{
    public function getAllMachines()
    {
        $sortField = "work_site_name";
        $sort      = 'asc';
        $query     = WorkSite::with(["machines" => function ($machine) {
            $machine->with("created_by")->select();
        }])->select("work_site_id", "work_site_name", "work_site_location")->orderBy($sortField, $sort)->get();

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

    public function getMachines(Request $req)
    {
        $condition = $req->input('filter')['condition'] ?? [];
        $start     = $req->input('start_row');
        $records   = $req->input('page_records');
        $sortField = $req->input('sort_field') == "" ? "work_site_id" : $req->input('sort_field');
        $sort      = $req->input('sort') == -1 ? 'desc' : 'asc';
        $query     = WorkSite::with(["machines" => function ($machine) {
            $machine->with("created_by")->select();
        }])->select("work_site_id", "work_site_name", "work_site_location");

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

    public function getTransferMachines(Request $req)
    {
        $condition = $req->input('filter')['condition'] ?? [];
        $start     = $req->input('start_row');
        $records   = $req->input('page_records');
        $sortField = $req->input('sort_field') == "" ? "machine_transfer_id" : $req->input('sort_field');
        $sort      = $req->input('sort') == -1 ? 'desc' : 'asc';
        $query     = MachinesTransfer::with(["source_work_site", "destination_work_site", "transfered_by"])->select();

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

    public function saveMachines(Request $req)
    {
        $rules = [
            'work_site'               => 'required',
            'no_of_cutting_machine'   => 'required|numeric',
            'no_of_grinder_machine'   => 'required|numeric',
            'no_of_polish_machine'    => 'required|numeric',
            'no_of_hand_machine'      => 'required|numeric',
            'no_of_aluminium_channel' => 'required|numeric',
            'no_of_matam'             => 'required|numeric',
            "created_by"              => 'required',
        ];
        $messages = [
            'work_site.required'               => 'Work Site required',
            'no_of_cutting_machine.numeric'    => 'Only numbers allowed',
            'no_of_cutting_machine.required'   => 'No. of cutting machine required',
            'no_of_grinder_machine.numeric'    => 'Only numbers allowed',
            'no_of_grinder_machine.required'   => 'No. of grinder machine required',
            'no_of_polish_machine.numeric'     => 'Only numbers allowed',
            'no_of_polish_machine.required'    => 'No. of polish machine required',
            'no_of_hand_machine.numeric'       => 'Only numbers allowed',
            'no_of_hand_machine.required'      => 'No. of hand machine required',
            'no_of_aluminium_channel.numeric'  => 'Only numbers allowed',
            'no_of_aluminium_channel.required' => 'No. of aluminium channel required',
            'no_of_matam.numeric'              => 'Only numbers allowed',
            'no_of_matam.required'             => 'No. of matam required',
            'created_by.required'              => 'Created by required',
        ];

        $validator = Validator::make($req->all(), $rules, $messages);

        if ($validator->fails()) {
            return response()->json(['statusCode' => 400, 'message' => 'Recorrect errors', 'errors' => $validator->errors()], 400);
        } else {
            $saveMachines = DB::table('machines')->updateOrInsert(
                ['work_site' => $req->input("work_site")],
                [
                    'no_of_cutting_machine'   => $req->input("no_of_cutting_machine"),
                    'no_of_grinder_machine'   => $req->input("no_of_grinder_machine"),
                    'no_of_polish_machine'    => $req->input("no_of_polish_machine"),
                    'no_of_hand_machine'      => $req->input("no_of_hand_machine"),
                    'no_of_aluminium_channel' => $req->input("no_of_aluminium_channel"),
                    'no_of_matam'             => $req->input("no_of_matam"),
                    'created_by'              => $req->input("created_by"),
                    'created_date_time'       => date("Y-m-d H:i:s"),
                ]);

            if ($saveMachines) {
                return response()->json(['statusCode' => 201, 'message' => 'Successfully saved machines'], 201);
            } else {
                return response()->json(['statusCode' => 500, 'message' => 'Internal server error'], 500);
            }
        }
    }

    public function transferMachines(Request $req)
    {
        $rules = [
            'source_work_site'        => 'required|different:destination_work_site',
            'destination_work_site'   => 'required',
            'no_of_cutting_machine'   => 'required|numeric',
            'no_of_grinder_machine'   => 'required|numeric',
            'no_of_polish_machine'    => 'required|numeric',
            'no_of_hand_machine'      => 'required|numeric',
            'no_of_aluminium_channel' => 'required|numeric',
            'no_of_matam'             => 'required|numeric',
            "transfered_by"           => 'required',
        ];
        $messages = [
            'source_work_site.required'        => 'Source Work Site required',
            'source_work_site.different'       => 'Source and Destination Work Site must be different',
            'destination_work_site.required'   => 'Destination Work Site required',
            'no_of_cutting_machine.numeric'    => 'Only numbers allowed',
            'no_of_cutting_machine.required'   => 'No. of cutting machine required',
            'no_of_grinder_machine.numeric'    => 'Only numbers allowed',
            'no_of_grinder_machine.required'   => 'No. of grinder machine required',
            'no_of_polish_machine.numeric'     => 'Only numbers allowed',
            'no_of_polish_machine.required'    => 'No. of polish machine required',
            'no_of_hand_machine.numeric'       => 'Only numbers allowed',
            'no_of_hand_machine.required'      => 'No. of hand machine required',
            'no_of_aluminium_channel.numeric'  => 'Only numbers allowed',
            'no_of_aluminium_channel.required' => 'No. of aluminium channel required',
            'no_of_matam.numeric'              => 'Only numbers allowed',
            'no_of_matam.required'             => 'No. of matam required',
            'transfered_by.required'           => 'Created by required',
        ];

        $validator = Validator::make($req->all(), $rules, $messages);

        if ($validator->fails()) {
            return response()->json(['statusCode' => 400, 'message' => 'Recorrect errors', 'errors' => $validator->errors()], 400);
        } else {
            $sourceSite      = $req->input("source_work_site");
            $destinationSite = $req->input("destination_work_site");

            $transfer = [
                'no_of_polish_machine'    => $req->input("no_of_polish_machine"),
                'no_of_cutting_machine'   => $req->input("no_of_cutting_machine"),
                'no_of_grinder_machine'   => $req->input("no_of_grinder_machine"),
                'no_of_hand_machine'      => $req->input("no_of_hand_machine"),
                'no_of_aluminium_channel' => $req->input("no_of_aluminium_channel"),
                'no_of_matam'             => $req->input("no_of_matam"),
            ];

            $source = DB::table('machines')->where('work_site', $sourceSite)->first();
            if (! $source) {
                return response()->json(['statusCode' => 400, 'message' => 'Source site not found.'], 400);
            }

            foreach ($transfer as $column => $qty) {
                if ($qty > 0 && $source->$column < $qty) {
                    return response()->json(['statusCode' => 400, 'message' => "Not enough {$column} in source site."], 400);
                }
            }

            DB::beginTransaction();
            try {
                foreach ($transfer as $column => $qty) {
                    if ($qty > 0) {
                        DB::table('machines')
                            ->where('work_site', $sourceSite)
                            ->update([$column => DB::raw("$column - $qty")]);
                    }
                }

                foreach ($transfer as $column => $qty) {
                    if ($qty > 0) {
                        DB::table('machines')
                            ->where('work_site', $destinationSite)
                            ->update([$column => DB::raw("$column + $qty")]);
                    }
                }

                DB::commit();

                DB::table("machines_transfer")->insert([
                    'source_work_site'        => $req->input("source_work_site"),
                    'destination_work_site'   => $req->input("destination_work_site"),
                    'no_of_polish_machine'    => $req->input("no_of_polish_machine"),
                    'no_of_cutting_machine'   => $req->input("no_of_cutting_machine"),
                    'no_of_grinder_machine'   => $req->input("no_of_grinder_machine"),
                    'no_of_hand_machine'      => $req->input("no_of_hand_machine"),
                    'no_of_aluminium_channel' => $req->input("no_of_aluminium_channel"),
                    'no_of_matam'             => $req->input("no_of_matam"),
                    'transfered_by'           => $req->input("transfered_by"),
                    'transfered_date_time'    => date("Y-m-d H:i:s"),
                ]);

                return response()->json(['statusCode' => 201, 'message' => 'Machines transfered successfully.'], 201);

            } catch (\Exception $e) {
                DB::rollBack();
                return response()->json(['statusCode' => 500, 'message' => 'Transfer failed.'], 500);
            }
        }
    }

    public function deleteMachines(Request $req)
    {
        $machineID = $req->machine_id;

        $machinesDlt = DB::table('machines')->where('machine_id', '=', $machineID)->delete();

        if ($machinesDlt) {
            return response()->json(['statusCode' => 201, 'message' => 'Successfully deleted machine'], 201);
        } else {
            return response()->json(['statusCode' => 500, 'message' => 'Internal server error'], 500);
        }
    }

}
