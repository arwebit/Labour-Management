<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Versions extends Model
{
    use HasFactory;

    protected $table      = 'release_versions';
    protected $primaryKey = 'release_id';
    public $timestamps    = false;
}
