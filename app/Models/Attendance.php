<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Attendance extends Model
{
    use HasFactory;

    protected $table      = 'labour_attendance';
    protected $primaryKey = 'attendance_id';
    public $timestamps    = false;

    public function labour(): HasOne
    {
        return $this->hasOne(User::class, "user_id", "labour");
    }
    public function work_site(): HasOne
    {
        return $this->hasOne(WorkSite::class, "work_site_id", "work_site");
    }
}
