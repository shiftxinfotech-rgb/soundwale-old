<?php

namespace App\Models;

use App\Helper\Helper;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class TempRegister extends Model
{
    public $table = 'temp_register';

    protected $fillable = [
        'email',
        'code',
        'mobile_number',
        'verification_code',
    ];

    protected static function booted()
    {
        parent::boot();
    }
}
