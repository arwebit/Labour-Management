<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;

class WorkSite extends Model
{
    use HasFactory;

    protected $table      = 'mm_work_site';
    protected $primaryKey = 'work_site_id';
    public $timestamps    = false;

    public function created_by(): HasOne
    {
        return $this->hasOne(User::class, "user_id", "created_by");
    }
    public function updated_by(): HasOne
    {
        return $this->hasOne(User::class, "user_id", "updated_by");
    }

    public function attendance(): HasOne
    {
        return $this->hasOne(Attendance::class, "work_site", "work_site_id");
    }

    public function machines(): HasOne
    {
        return $this->hasOne(Machines::class, "work_site", "work_site_id");
    }
}
