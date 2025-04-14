<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GroupAccess extends Model
{
    use HasFactory;

    protected $table      = 'group_access';
    protected $primaryKey = '';
    public $timestamps    = false;

}
