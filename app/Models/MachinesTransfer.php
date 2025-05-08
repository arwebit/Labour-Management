<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;

class MachinesTransfer extends Model
{
    use HasFactory;

    protected $table      = 'machines_transfer';
    protected $primaryKey = 'machine_transfer_id';
    public $timestamps    = false;

    public function source_work_site(): HasOne
    {
        return $this->hasOne(WorkSite::class, "work_site_id", "source_work_site")->select(["work_site_id", "work_site_name", "work_site_location"]);
    }
    public function destination_work_site(): HasOne
    {
        return $this->hasOne(WorkSite::class, "work_site_id", "destination_work_site")->select(["work_site_id", "work_site_name", "work_site_location"]);
    }
    public function transfered_by(): HasOne
    {
        return $this->hasOne(User::class, "user_id", "transfered_by")->select(["user_id", "full_name"]);
    }

}
