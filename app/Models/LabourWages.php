<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;

class LabourWages extends Model
{
    use HasFactory;

    protected $table      = 'labour_wages';
    protected $primaryKey = 'wages_id';
    public $timestamps    = false;

    public function labour(): HasOne
    {
        return $this->hasOne(User::class, "user_id", "labour");
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
