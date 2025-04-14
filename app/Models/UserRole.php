<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class UserRole extends Model
{
    use HasFactory;

    protected $table      = 'master_role';
    protected $primaryKey = 'role_id';
    public $timestamps    = false;

    public function module_access(): HasMany
    {
        return $this->hasMany(GroupAccess::class, "role_id", "role_id");
    }

}
