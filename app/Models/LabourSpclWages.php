<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;

class LabourSpclWages extends Model
{
    use HasFactory;

    protected $table      = 'labour_special_wages';
    protected $primaryKey = 'spcl_wage_id';
    public $timestamps    = false;

    public function labour(): HasOne
    {
        return $this->hasOne(User::class, "user_id", "labour");
    }

    public function updated_by(): HasOne
    {
        return $this->hasOne(User::class, "user_id", "updated_by");
    }
}
