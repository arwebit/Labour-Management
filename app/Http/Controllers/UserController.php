<?php
namespace App\Http\Controllers;

use App\Models\Query;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator as Validator;

class UserController extends Controller
{

    public function getAllStaffs()
    {
        $sortField = "full_name";
        $sort      = 'asc';
        $query     = User::with([
            'user_role' => function ($q) {
                $q->with(["module_access" => function ($q1) {
                    $q1->join("master_module_access", "group_access.module_access_id", "=", "master_module_access.module_access_id")
                        ->select(
                            "group_access.role_id",
                            "group_access.module_access_id",
                            "master_module_access.module_access_desc"
                        );
                }])->select('role_id', 'role_name', 'tag');
            }, 'created_by' => function ($q2) {
                $q2->select('user_id', 'full_name');
            }, 'updated_by' => function ($q3) {
                $q3->select('user_id', 'full_name');
            },
        ])->select("user_id", "full_name", "username", "mobile", "email", "aadhar_no", "pan_no", "profile_pic", "user_role", "is_active", "created_by", "created_date_time", "updated_by", "updated_date_time")->where("user_id", ">", 1)
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

    public function getStaffs(Request $req)
    {
        $condition = $req->input('filter')['condition'] ?? [];
        $start     = $req->input('start_row');
        $records   = $req->input('page_records');
        $sortField = $req->input('sort_field') == "" ? "full_name" : $req->input('sort_field');
        $sort      = $req->input('sort') == -1 ? 'desc' : 'asc';
        $query     = User::with([
            'user_role' => function ($q) {
                $q->with(["module_access" => function ($q1) {
                    $q1->join("master_module_access", "group_access.module_access_id", "=", "master_module_access.module_access_id")
                        ->select(
                            "group_access.role_id",
                            "group_access.module_access_id",
                            "master_module_access.module_access_desc"
                        );
                }])->select('role_id', 'role_name', 'tag');
            }, 'created_by' => function ($q2) {
                $q2->select('user_id', 'full_name');
            }, 'updated_by' => function ($q3) {
                $q3->select('user_id', 'full_name');
            },
        ])->select("user_id", "full_name", "username", "mobile", "email", "aadhar_no", "pan_no", "profile_pic", "user_role", "is_active", "created_by", "created_date_time", "updated_by", "updated_date_time")->where("user_id", ">", 1);

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

    public function createStaff(Request $req)
    {
        $rules = [
            'username'    => 'required|max:20|unique:user_details,username',
            'email'       => 'email|unique:user_details,email|max:255',
            'password'    => 'required|max:20',
            "full_name"   => 'required|max:255',
            "mobile"      => 'digits:10|unique:user_details,mobile',
            "aadhar_no"   => 'required|digits:12|unique:user_details,aadhar_no',
            "pan_no"      => 'max:20|unique:user_details,pan_no',
            'profile_pic' => 'mimes:png,jpeg,jpg|max:1024',
            "user_role"   => 'required',
            "created_by"  => 'required',
        ];
        $messages = [
            'username.required'   => 'Username required',
            'username.max'        => 'Max: 20 characters',
            'username.unique'     => 'Username already exists. Try another',
            'email.email'         => 'Invalid email',
            'email.unique'        => 'Email already exists',
            'email.max'           => 'Max: 255 characters',
            'password.required'   => 'Password required',
            'password.max'        => 'Max: 20 characters',
            'full_name.required'  => 'Full name required',
            'full_name.max'       => 'Max: 255 characters',
            'user_role.required'  => 'User role required',
            'mobile.digits'       => 'Mobile no. must be of 10 digits',
            'mobile.unique'       => 'Mobile no. already exists',
            'aadhar_no.required'  => 'Aadhar no required',
            'aadhar_no.digits'    => 'Aadhar no. must be of 12 digits',
            'aadhar_no.unique'    => 'Aadhar no. already exists',
            'pan_no.digits'       => 'Max: 20 characters',
            'pan_no.unique'       => 'PAN no. already exists',
            'profile_pic.mimes'   => 'Upload only APK files',
            'profile_pic.max'     => 'Max file size 1 MB',
            'created_by.required' => 'Created by required',
        ];

        $validator = Validator::make($req->all(), $rules, $messages);

        if ($validator->fails()) {
            return response()->json(['statusCode' => 400, 'message' => 'Recorrect errors', 'errors' => $validator->errors()], 400);
        } else {
            $picFile = "";

            if ($req->hasFile('profile_pic')) {
                $picName          = date("YmdHis");
                $getfileExtension = $req->file('profile_pic')->getClientOriginalExtension();
                $fileName         = $picName . "." . $getfileExtension;
                $req->profile_pic->move(base_path("./public/images/pro_pic"), $fileName);
                $picFile = "images/pro_pic/" . $fileName;

            }

            $saveUser = DB::table('user_details')->insert([
                'full_name'         => $req->input("full_name"),
                'username'          => $req->input("username"),
                'email'             => $req->input("email"),
                'password'          => Hash::make($req->input('password')),
                'mobile'            => $req->input("mobile"),
                'aadhar_no'         => $req->input("aadhar_no"),
                'pan_no'            => $req->input("pan_no"),
                'user_role'         => $req->input("user_role"),
                'is_active'         => 'yes',
                'user_ptext'        => $req->input("password"),
                'profile_pic'       => $picFile,
                'created_by'        => $req->input("created_by"),
                'created_date_time' => date("Y-m-d H:i:s"),
            ]);

            if ($saveUser) {
                return response()->json(['statusCode' => 201, 'message' => 'Successfully created staff'], 201);
            } else {
                return response()->json(['statusCode' => 500, 'message' => 'Internal server error'], 500);
            }
        }
    }

    public function updateStaff(Request $req)
    {
        $userID = $req->user_id;

        $rules = [
            'username'    => 'required|max:20|unique:user_details,username,' . $userID . ',user_id',
            'email'       => 'email|unique:user_details,email|max:255',
            "full_name"   => 'required|max:255',
            "mobile"      => 'digits:10|unique:user_details,mobile,' . $userID . ',user_id',
            "aadhar_no"   => 'required|digits:12|unique:user_details,aadhar_no,' . $userID . ',user_id',
            "pan_no"      => 'max:20|unique:user_details,pan_no,' . $userID . ',user_id',
            'profile_pic' => 'mimes:png,jpeg,jpg|max:1024',
            "user_role"   => 'required',
            "is_active"   => 'required',
            "updated_by"  => 'required',
        ];
        $messages = [
            'username.required'   => 'Username required',
            'username.max'        => 'Max: 20 characters',
            'username.unique'     => 'Username already exists. Try another',
            'email.email'         => 'Invalid email',
            'email.unique'        => 'Email already exists',
            'email.max'           => 'Max: 255 characters',
            'full_name.required'  => 'Full name required',
            'full_name.max'       => 'Max: 255 characters',
            'user_role.required'  => 'User role required',
            'mobile.digits'       => 'Mobile no. must be of 10 digits',
            'mobile.unique'       => 'Mobile no. already exists',
            'aadhar_no.required'  => 'Aadhar no required',
            'aadhar_no.digits'    => 'Aadhar no. must be of 12 digits',
            'aadhar_no.unique'    => 'Aadhar no. already exists',
            'pan_no.digits'       => 'Max: 20 characters',
            'pan_no.unique'       => 'PAN no. already exists',
            'profile_pic.mimes'   => 'Upload only APK files',
            'profile_pic.max'     => 'Max file size 1 MB',
            'is_active.required'  => 'Status required',
            'updated_by.required' => 'Updated by required',
        ];

        $validator = Validator::make($req->all(), $rules, $messages);

        if ($validator->fails()) {
            return response()->json(['statusCode' => 400, 'message' => 'Recorrect errors', 'errors' => $validator->errors()], 400);
        } else {
            $userTable = DB::table('user_details')->where('user_id', '=', $userID)->first();
            $picFile   = $userTable->profile_pic ?? "";

            if ($req->hasFile('profile_pic')) {
                if ($picFile) {
                    $actualPath = base_path('./public/' . $picFile);
                    if (file_exists($actualPath)) {
                        unlink($actualPath);
                    }
                }

                $picName          = date("YmdHis");
                $getfileExtension = $req->file('profile_pic')->getClientOriginalExtension();
                $fileName         = $picName . "." . $getfileExtension;
                $req->profile_pic->move(base_path("./public/images/pro_pic"), $fileName);
                $picFile = "images/pro_pic/" . $fileName;

            }

            DB::table('user_details')->where("user_id", "=", $userID)->update([
                'full_name'         => $req->input("full_name"),
                'username'          => $req->input("username"),
                'email'             => $req->input("email"),
                'mobile'            => $req->input("mobile"),
                'aadhar_no'         => $req->input("aadhar_no"),
                'pan_no'            => $req->input("pan_no"),
                'user_role'         => $req->input("user_role"),
                'is_active'         => $req->input("is_active"),
                'profile_pic'       => $picFile,
                'updated_by'        => $req->input("updated_by"),
                'updated_date_time' => date("Y-m-d H:i:s"),
            ]);

            return response()->json(['statusCode' => 201, 'message' => 'Successfully updated staff'], 201);
        }
    }

    public function statusChange(Request $req)
    {
        $userID = $req->user_id;

        $rules = [
            'is_active'  => 'required',
            "updated_by" => 'required',
        ];
        $messages = [
            'is_active.required'  => 'Status required',
            'updated_by.required' => 'Updated by required',
        ];

        $validator = Validator::make($req->all(), $rules, $messages);

        if ($validator->fails()) {
            return response()->json(['statusCode' => 400, 'message' => 'Recorrect errors', 'errors' => $validator->errors()], 400);
        } else {
            DB::table('user_details')->where('user_id', '=', $userID)->update([
                'is_active'         => $req->input("is_active"),
                'updated_by'        => $req->input("updated_by"),
                'updated_date_time' => date("Y-m-d H:i:s"),
            ]);

            return response()->json(['statusCode' => 201, 'message' => 'Successfully changed staff status'], 201);
        }
    }

    public function deleteStaff(Request $req)
    {
        $userID = $req->user_id;

        $releaseTable = DB::table('user_details')->where('user_id', '=', $userID)->first();
        $picFilePath  = $releaseTable->profile_pic ?? "";

        $releaseDlt = DB::table('user_details')->where('user_id', '=', $userID)->delete();

        if ($releaseDlt) {
            if ($picFilePath) {
                $actualPath = base_path('./public/' . $picFilePath);
                if (file_exists($actualPath)) {
                    unlink($actualPath);
                }
            }

            return response()->json(['statusCode' => 201, 'message' => 'Successfully deleted staff'], 201);
        } else {
            return response()->json(['statusCode' => 500, 'message' => 'Internal server error'], 500);
        }
    }

    public function removeProfilePicture(Request $req)
    {
        $userID = $req->user_id;

        $rules = [
            "updated_by" => 'required',
        ];
        $messages = [
            'updated_by.required' => 'Updated by required',
        ];

        $validator = Validator::make($req->all(), $rules, $messages);

        if ($validator->fails()) {
            return response()->json(['statusCode' => 400, 'message' => 'Recorrect errors', 'errors' => $validator->errors()], 400);
        } else {
            $userTable   = DB::table('user_details')->where('user_id', '=', $userID)->first();
            $picFilePath = $userTable->profile_pic;
            $actualPath  = base_path('./public/' . $picFilePath);

            $removePic = DB::table('user_details')->where('user_id', '=', $userID)->update([
                "profile_pic" => "",
                'updated_by'  => $req->input("updated_by"),
            ]);

            if ($removePic) {
                if (file_exists($actualPath)) {
                    unlink($actualPath);
                }
                return response()->json(['statusCode' => 201, 'message' => 'Successfully removed profile picture'], 201);
            } else {
                return response()->json(['statusCode' => 500, 'message' => 'Internal server error'], 500);
            }
        }
    }

    public function changePassword(Request $req)
    {
        $userID = $req->user_id;
        $rules  = [
            'old_password'     => 'required|exists:user_details,user_ptext,user_id,' . $userID,
            'new_password'     => 'required',
            'confirm_password' => 'required|same:new_password',
        ];
        $messages = [
            'old_password.required'     => 'Required',
            'old_password.exists'       => 'Old password doesnot match',
            'new_password.required'     => 'Required',
            'confirm_password.required' => 'Required',
            'confirm_password.same'     => 'Must match with new password',
        ];

        $validator = Validator::make($req->all(), $rules, $messages);
        if ($validator->fails()) {
            return response()->json(['statusCode' => 400, 'message' => 'Recorrect errors', 'errors' => $validator->errors()], 400);
        } else {
            DB::table('user_details')->where('user_id', '=', $userID)
                ->update([
                    'password'   => Hash::make($req->input("new_password")),
                    'user_ptext' => $req->input("new_password"),
                ]);
            return response()->json(['statusCode' => 201, 'message' => 'Successfully changed password'], 201);
        }
    }

    public function login(Request $req)
    {
        $rules = [
            'username' => 'required',
            'password' => 'required',
        ];
        $messages = [
            'username.required' => 'Username is required',
            'password.required' => 'Password is required',
        ];

        $validator = Validator::make($req->all(), $rules, $messages);

        if ($validator->fails()) {
            return response()->json(['statusCode' => 400, 'message' => 'Recorrect errors', 'errors' => $validator->errors()], 400);
        } else {

            $credentials = ['username' => $req->input("username"), 'password' => $req->input("password")];

            if (! $token = Auth::attempt($credentials)) {
                return response()->json(['status' => 406, 'message' => 'Login failed'], 406);
            }

            $data = DB::table('user_details')
                ->select('user_id')
                ->where("username", "=", $req->input("username"))
                ->first();

            return response()->json(['statusCode' => 200, 'message' => 'Successfully logged in', 'rows' => $data, "token" => $this->respondWithToken($token)->original], 200);
        }
    }

    public function logout()
    {
        Auth::logout();

        return response()->json(['statusCode' => 200, 'message' => 'Successfully logged out'], 200);
    }

    protected function respondWithToken($token)
    {
        return response()->json([
            'access_token' => $token,
            'token_type'   => 'bearer',
            'expires_in'   => env('JWT_TTL') . ' minutes',
        ]);
    }
}
