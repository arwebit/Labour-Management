<?php
namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\NoteBook;
use App\Models\Query;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator as Validator;

class NoteBookController extends Controller
{
    public function getAllNoteBooks()
    {
        $sortField = "note_book_id";
        $sort      = 'asc';
        $query     = NoteBook::with(["work_site" => function ($q) {
            $q->select("work_site_id", "work_site_name", "work_site_location");
        }, "checked_by" => function ($q1) {
            $q1->select("user_id", "full_name");
        }, "created_by" => function ($q2) {
            $q2->select("user_id", "full_name");
        }, "updated_by" => function ($q3) {
            $q3->select("user_id", "full_name");
        }])->select("*")
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

    public function getNoteBooks(Request $req)
    {
        $condition = $req->input('filter')['condition'] ?? [];
        $start     = $req->input('start_row');
        $records   = $req->input('page_records');
        $sortField = $req->input('sort_field') == "" ? "work_site_id" : $req->input('sort_field');
        $sort      = $req->input('sort') == -1 ? 'desc' : 'asc';
        $query     = NoteBook::with(["work_site" => function ($q) {
            $q->select("work_site_id", "work_site_name", "work_site_location");
        }, "checked_by" => function ($q1) {
            $q1->select("user_id", "full_name");
        }, "created_by" => function ($q2) {
            $q2->select("user_id", "full_name");
        }, "updated_by" => function ($q3) {
            $q3->select("user_id", "full_name");
        }])->select();

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

    public function createNoteBook(Request $req)
    {
        $rules = [
            'note_title'  => 'required|max:100',
            'work_site'   => 'required',
            'description' => 'required|max:1000',
            'work_date'   => 'required',
            "created_by"  => 'required',
        ];
        $messages = [
            'note_title.required'  => 'Note title required',
            'note_title.max'       => 'Max: 100 characters',
            'work_site.required'   => 'Work site  required',
            'description.required' => 'Description required',
            'description.max'      => 'Max: 1000 characters',
            'work_date.required'   => 'Date required',
            'created_by.required'  => 'Created by required',
        ];

        $validator = Validator::make($req->all(), $rules, $messages);

        if ($validator->fails()) {
            return response()->json(['statusCode' => 400, 'message' => 'Recorrect errors', 'errors' => $validator->errors()], 400);
        } else {

            $saveNoteBook = DB::table('note_books')->insert([
                'note_title'        => $req->input("note_title"),
                'work_site'         => $req->input("work_site"),
                'work_date'         => $req->input("work_date"),
                'description'       => $req->input("description"),
                'checked'           => 'no',
                'is_active'         => 'yes',
                'created_by'        => $req->input("created_by"),
                'created_date_time' => date("Y-m-d H:i:s"),
            ]);

            if ($saveNoteBook) {
                return response()->json(['statusCode' => 201, 'message' => 'Successfully created note book'], 201);
            } else {
                return response()->json(['statusCode' => 500, 'message' => 'Internal server error'], 500);
            }
        }
    }

    public function updateNoteBook(Request $req)
    {
        $noteBookID = $req->note_book_id;

        $rules = [
            'note_title'  => 'required|max:100',
            'work_site'   => 'required',
            'work_date'   => 'required',
            'description' => 'required|max:1000',
            'is_active'   => 'required',
            "updated_by"  => 'required',
        ];
        $messages = [
            'note_title.required'  => 'Note title required',
            'note_title.max'       => 'Max: 100 characters',
            'work_site.required'   => 'Work site  required',
            'description.required' => 'Description required',
            'description.max'      => 'Max: 1000 characters',
            'work_date.required'   => 'Date required',
            'is_active.required'   => 'Status required',
            'updated_by.required'  => 'Updated by required',
        ];

        $validator = Validator::make($req->all(), $rules, $messages);

        if ($validator->fails()) {
            return response()->json(['statusCode' => 400, 'message' => 'Recorrect errors', 'errors' => $validator->errors()], 400);
        } else {

            DB::table('note_books')->where("note_book_id", "=", $noteBookID)->update([
                'note_title'        => $req->input("note_title"),
                'work_site'         => $req->input("work_site"),
                'work_date'         => $req->input("work_date"),
                'description'       => $req->input("description"),
                'is_active'         => $req->input("is_active"),
                'updated_by'        => $req->input("updated_by"),
                'updated_date_time' => date("Y-m-d H:i:s"),
            ]);

            return response()->json(['statusCode' => 201, 'message' => 'Successfully updated note book'], 201);
        }
    }

    public function deleteNoteBook(Request $req)
    {
        $noteBookID = $req->note_book_id;

        $noteBookDlt = DB::table('note_books')->where('note_book_id', '=', $noteBookID)->delete();

        if ($noteBookDlt) {
            return response()->json(['statusCode' => 201, 'message' => 'Successfully deleted note book'], 201);
        } else {
            return response()->json(['statusCode' => 500, 'message' => 'Internal server error'], 500);
        }
    }

    public function checkedNoteBook(Request $req)
    {
        $noteBookID = $req->note_book_id;

        $rules = [
            'checked'    => 'required',
            'checked_by' => 'required',
            'check_note' => 'required|max:255',
        ];
        $messages = [
            'checked.required'    => 'Checked required',
            'checked_by.required' => 'Checked by required',
            'check_note.required' => 'Check note required',
            'check_note.max'      => 'Max: 255 characters',
        ];

        $validator = Validator::make($req->all(), $rules, $messages);

        if ($validator->fails()) {
            return response()->json(['statusCode' => 400, 'message' => 'Recorrect errors', 'errors' => $validator->errors()], 400);
        } else {

            DB::table('note_books')->where("note_book_id", "=", $noteBookID)->update([
                'checked'           => $req->input("checked"),
                'checked_by'        => $req->input("checked_by"),
                'check_note'        => $req->input("check_note"),
                'checked_date_time' => date("Y-m-d H:i:s"),
            ]);

            return response()->json(['statusCode' => 201, 'message' => 'Successfully checked note book'], 201);
        }
    }
}
