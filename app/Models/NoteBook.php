<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;

class NoteBook extends Model
{
    use HasFactory;

    protected $table      = 'note_books';
    protected $primaryKey = 'note_book_id';
    public $timestamps    = false;

    public function work_site(): HasOne
    {
        return $this->hasOne(WorkSite::class, "work_site_id", "work_site");
    }
    public function checked_by(): HasOne
    {
        return $this->hasOne(User::class, "user_id", "checked_by");
    }
    public function created_by(): HasOne
    {
        return $this->hasOne(User::class, "user_id", "created_by");
    }
    public function updated_by(): HasOne
    {
        return $this->hasOne(User::class, "user_id", "updated_by");
    }
}
