<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Machines extends Model
{
    use HasFactory;

    protected $table      = 'machines';
    protected $primaryKey = 'machine_id';
    public $timestamps    = false;

    public function work_site(): HasOne
    {
        return $this->hasOne(WorkSite::class, "work_site_id", "work_site");
    }
    public function created_by(): HasOne
    {
        return $this->hasOne(User::class, "user_id", "created_by")->select(["user_id", "full_name"]);
    }

}
