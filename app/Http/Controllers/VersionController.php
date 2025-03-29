<?php
namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Query;
use App\Models\Versions;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator as Validator;

class VersionController extends Controller
{

    public function getAllVersion()
    {
        $sortField = "release_id";
        $sort      = -1 ? 'desc' : 'asc';
        $query     = DB::table('release_versions')
            ->select()
            ->orderBy($sortField, $sort)
            ->get();

        $totalRows = count($query);

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
                "rows"       => [],
            ];
        }

        return response()->json($response, 200);
    }

    public function getLatestVersion(Request $req)
    {
        $rules = [
            'app_name' => 'required',
        ];
        $messages = [
            'app_name.required' => 'Required',
        ];

        $validator = Validator::make($req->all(), $rules, $messages);

        if ($validator->fails()) {
            return response()->json(['statusCode' => 400, 'message' => 'Recorrect errors', 'errors' => $validator->errors()], 400);
        } else {
            $query = DB::table('release_versions')
                ->select()
                ->where("app_name", "=", $req->input("app_name"))
                ->where("is_latest", "=", "yes")
                ->orderBy('released_on', 'desc');

            $totalRows = count($query->get());

            if ($totalRows > 0) {
                $response = [
                    "statusCode" => 200,
                    "message"    => "Records found",
                    "rows"       => $query->first(),
                ];
            } else {
                $response = [
                    "statusCode" => 200,
                    "message"    => "No records found",
                    "rows"       => [],

                ];
            }

            return response()->json($response, 200);
        }

    }

    public function getVersion(Request $req)
    {
        $condition = $req->input('filter')['condition'] ?? [];
        $start     = $req->input('start_row');
        $records   = $req->input('page_records');
        $sortField = $req->input('sort_field') == "" ? "release_id" : $req->input('sort_field');
        $sort      = $req->input('sort') == -1 ? 'desc' : 'asc';

        $query = DB::table('release_versions')
            ->select();

        $query     = Query::filters($query, $condition);
        $totalRows = $query->count();

        $db = $query->offset($start)->limit($records)->orderBy($sortField, $sort)->get();

        $noOfRequiredPages = ceil($totalRows / $records);

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
                "rows"       => [],
            ];
        }
        return response()->json($response, 200);
    }

    public function createVersion(Request $req)
    {
        $rules = [
            'app_name'            => 'required|max:255',
            'release_version'     => [
                'required',
                'max:20',
                function ($attribute, $value, $fail) use ($req) {
                    $existingVersion = DB::table('release_versions')
                        ->where('release_version', '=', $value)
                        ->where('app_name', '=', $req->app_name)
                        ->first();

                    if ($existingVersion) {
                        $fail('Already exists');
                    }
                },
            ],
            'release_message'     => 'required|max:255',
            'is_update_mandatory' => 'required',
            'released_on'         => 'required',
            'app_file'            => 'required|mimes:zip|max:1000000',
        ];
        $messages = [
            'app_name.required'            => 'Required',
            'app_name.max'                 => 'Max: 255 characters',
            'release_version.required'     => 'Required',
            'release_version.max'          => 'Max: 20 characters',
            'release_version.unique'       => 'Already exists',
            'release_message.required'     => 'Required',
            'release_message.max'          => 'Must be 255 characters',
            'is_update_mandatory.required' => 'Required',
            'released_on.required'         => 'Required',
            'app_file.required'            => 'Required',
            'app_file.mimes'               => 'Upload only APK files',
            'app_file.max'                 => 'Max file size 1 GB',
        ];

        $validator = Validator::make($req->all(), $rules, $messages);

        if ($validator->fails()) {
            return response()->json(['statusCode' => 400, 'message' => 'Recorrect errors', 'errors' => $validator->errors()], 400);
        } else {
            $appFile = "";

            if ($req->hasFile('app_file')) {
                $appName          = str_replace(" ", "_", strtolower($req->input("app_name")));
                $getfileExtension = $req->file('app_file')->getClientOriginalExtension();
                $fileName         = $appName . '_' . str_replace(".", "-", strtolower($req->input("release_version"))) . "." . $getfileExtension;
                $req->app_file->move(base_path("./public/apk_files"), $fileName);
                $appFile = "apk_files/" . $fileName;

            }

            $releasedID = DB::table('release_versions')->insertGetId([
                'app_name'            => $req->input("app_name"),
                'release_version'     => $req->input("release_version"),
                'release_message'     => $req->input("release_message"),
                'is_update_mandatory' => $req->input("is_update_mandatory"),
                'released_on'         => $req->input("released_on"),
                'app_file'            => $appFile,
                'is_latest'           => "yes",
            ]);

            if ($releasedID) {
                DB::table('release_versions')->where("app_name", "=", $req->input("app_name"))->where("is_latest", "=", "yes")->where("release_id", "!=", $releasedID)->update(["is_latest" => "no"]);

                $releaseTable = Versions::where("app_name", "=", $req->input("app_name"))
                    ->orderBy('release_id', 'desc')
                    ->offset(2)->limit(10)->get();

                if ($releaseTable) {
                    foreach ($releaseTable as $releaseTables) {
                        $appFile    = $releaseTables->app_file;
                        $actualPath = base_path('./public/' . $appFile);
                        if (file_exists($actualPath)) {
                            unlink($actualPath);
                        }
                    }
                }

                return response()->json(['statusCode' => 201, 'message' => 'Successfully released version : ' . $req->input("release_version")], 201);
            } else {
                return response()->json(['statusCode' => 500, 'message' => 'Internal server error'], 500);
            }
        }
    }

    public function updateVersion(Request $req)
    {
        $releaseID = $req->release_id;

        $rules = [
            'app_name'            => 'required|max:255',
            'release_version'     => [
                'required',
                'max:20',
                function ($attribute, $value, $fail) use ($req) {
                    $existingVersion = DB::table('release_versions')
                        ->where('release_version', '=', $value)
                        ->where('app_name', '=', $req->app_name)
                        ->where('release_id', '!=', $req->release_id)
                        ->first();

                    if ($existingVersion) {
                        $fail('Already exists');
                    }
                },
            ],
            'release_message'     => 'required|max:255',
            'is_update_mandatory' => 'required',
            'is_latest'           => 'required',
            'released_on'         => 'required',
            'app_file'            => 'mimes:zip|max:1000000',
        ];
        $messages = [
            'app_name.required'            => 'Required',
            'app_name.max'                 => 'Max: 255 characters',
            'release_version.required'     => 'Required',
            'release_version.max'          => 'Max: 20 characters',
            'release_version.unique'       => 'Already exists',
            'release_message.required'     => 'Required',
            'release_message.max'          => 'Must be 255 characters',
            'is_update_mandatory.required' => 'Required',
            'is_latest.required'           => 'Required',
            'released_on.required'         => 'Required',
            'app_file.mimes'               => 'Upload only APK files',
            'app_file.max'                 => 'Max file size 1 GB',
        ];

        $validator = Validator::make($req->all(), $rules, $messages);

        if ($validator->fails()) {
            return response()->json(['statusCode' => 400, 'message' => 'Recorrect errors', 'errors' => $validator->errors()], 400);
        } else {
            $appFile = "";

            if ($req->hasFile('app_file')) {
                $releaseTable = DB::table('release_versions')->where('release_id', '=', $releaseID)->first();
                $appFile      = $releaseTable->app_file;
                $actualPath   = base_path('./public/' . $appFile);
                if (file_exists($actualPath)) {
                    unlink($actualPath);
                }
                $appName          = str_replace(" ", "_", strtolower($req->input("app_name")));
                $getfileExtension = $req->file('app_file')->getClientOriginalExtension();
                $fileName         = $appName . '_' . str_replace(".", "-", strtolower($req->input("release_version"))) . "." . $getfileExtension;
                $req->app_file->move(base_path("./public/apk_files"), $fileName);
                $appFile = "apk_files/" . $fileName;

            }

            $released = DB::table('release_versions')->where("release_id", "=", $releaseID)
                ->update([
                    'app_name'            => $req->input("app_name"),
                    'release_version'     => $req->input("release_version"),
                    'release_message'     => $req->input("release_message"),
                    'is_update_mandatory' => $req->input("is_update_mandatory"),
                    'released_on'         => $req->input("released_on"),
                    'app_file'            => $appFile,
                    'is_latest'           => $req->input("is_latest"),
                ]);

            if ($released) {
                return response()->json(['statusCode' => 201, 'message' => 'Successfully updated'], 201);
            } else {
                return response()->json(['statusCode' => 201, 'message' => 'Successfully updated'], 201);
            }
        }
    }

    public function deleteVersion(Request $req)
    {
        $releaseID = $req->release_id;

        $releaseTable = DB::table('release_versions')->where('release_id', '=', $releaseID)->first();
        $appFilePath  = $releaseTable->app_file;
        $actualPath   = base_path('./public/' . $appFilePath);

        $releaseDlt = DB::table('release_versions')->where('release_id', '=', $releaseID)->delete();

        if ($releaseDlt) {
            if (file_exists($actualPath)) {
                unlink($actualPath);
            }
            return response()->json(['statusCode' => 201, 'message' => 'Successfully deleted'], 201);
        } else {
            return response()->json(['statusCode' => 500, 'message' => 'Internal server error'], 500);
        }
    }
}
