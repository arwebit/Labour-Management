<?php
namespace App\Models;

use Illuminate\Auth\Authenticatable;
use Illuminate\Contracts\Auth\Access\Authorizable as AuthorizableContract;
use Illuminate\Contracts\Auth\Authenticatable as AuthenticatableContract;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Laravel\Lumen\Auth\Authorizable;
use Tymon\JWTAuth\Contracts\JWTSubject;

class User extends Model implements AuthenticatableContract, AuthorizableContract, JWTSubject
{
    use Authenticatable, Authorizable, HasFactory;

    protected $table      = 'user_details';
    protected $primaryKey = 'user_id';
    public $timestamps    = false;

    public function user_role(): HasOne
    {
        return $this->hasOne(UserRole::class, "role_id", "user_role");
    }

    public function created_by(): HasOne
    {
        return $this->hasOne(User::class, "user_id", "created_by")->select(['user_id', 'full_name']);
    }

    public function updated_by(): HasOne
    {
        return $this->hasOne(User::class, "user_id", "updated_by")->select(['user_id', 'full_name']);
    }

    public function labour_rate(): HasOne
    {
        return $this->hasOne(LabourRates::class, "labour", "user_id")->select(['labour', 'labour_rate']);
    }

    public function labour_attendance(): HasMany
    {
        return $this->hasMany(Attendance::class, "labour", "user_id")->select(["labour", "check_in", "check_out", "work_site", "description", "work_date"]);
    }

    public function labour_normal_payment(): HasMany
    {
        return $this->hasMany(LabourWages::class, "labour", "user_id")->select(["labour", "payment_date", "paid_amount"]);
    }

    public function labour_special_payment(): HasMany
    {
        return $this->hasMany(LabourSpclWages::class, "labour", "user_id")->select(["labour", "payment_date", "payment", "payment_type"]);
    }

    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    /**
     * Return a key value array, containing any custom claims to be added to the JWT.
     *
     * @return array
     */
    public function getJWTCustomClaims()
    {
        return [];
    }

}
