<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ModuleAccess extends Model
{
    use HasFactory;

    protected $table      = 'master_module_access';
    protected $primaryKey = 'module_access_id';
    public $timestamps    = false;
}
