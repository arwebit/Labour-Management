<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LabourRates extends Model
{
    use HasFactory;

    protected $table      = 'labour_rates';
    protected $primaryKey = 'rate_id';
    public $timestamps    = false;

}
