<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WagesType extends Model
{
    use HasFactory;

    protected $table      = 'mas_wages_type';
    protected $primaryKey = 'wages_type_id';
    public $timestamps    = false;

}
