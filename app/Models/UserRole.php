<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserRole extends Model
{
    use HasFactory;

    protected $table      = 'master_role';
    protected $primaryKey = 'role_id';
    public $timestamps    = false;
}
