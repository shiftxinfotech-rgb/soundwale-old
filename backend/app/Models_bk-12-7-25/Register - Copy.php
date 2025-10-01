<?php

namespace App\Models;

use App\Helper\Helper;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Notifications\Notifiable;
use Carbon\Carbon;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;

class Register extends Authenticatable
{
    use HasApiTokens, Notifiable;

    use HasFactory;
    protected $table = 'register';

     protected $fillable = [
        'id',
        'image',
        'name',
        'mobile_number',
        'code',
        'available_on_whatsapp_with_same_number',
        'whatsapp',
        'code2',
        'email',
        'role_id',
        'password',
        'status',
        'country_id',
        'state_id',
        'city_id',
    ];
    // protected $appends = [
    //     "image_full_path"
    // ];

    protected $appends = [
        'image_url',
    ];
    const IMAGE_PATH = 'app/register/';
     
    public function getImageUrlAttribute()
    {
        return Helper::getImageUrl(self::IMAGE_PATH.$this->image, $this->image);
    }
    public function isValidToken($token)
    {
        $tokenData = \DB::table('password_resets')->where('email', $this->email)->first();
        if (!$tokenData) {
            return false; // Token not found for this email
        }

        $expirationTime = Carbon::parse($tokenData->created_at)->addMinutes(config('auth.passwords.'.config('auth.defaults.passwords').'.expire'));
        if (Carbon::now()->gt($expirationTime)) {
            return false; // Token has expired
        }

        return Hash::check($token, $tokenData->token);

    }

    protected static function booted()
    {
        static::updating(function ($obj) {
            if ($obj->image != $obj->getOriginal('image')) {
                removeFile($obj->getOriginal('image'));
            }
        });
    }

    public function getImageFullPathAttribute()
    {
        return getImageUrl( $this->image );
    }

    public function state()
    {
        return $this->hasOne(States::class, 'id', 'state_id');
    }

}
