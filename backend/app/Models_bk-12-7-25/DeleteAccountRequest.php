<?php

namespace App\Models;

use App\Helper\Helper;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class DeleteAccountRequest extends Model
{
    public $table = 'delete_account_request';

    protected $fillable = [
        'user_id',
        'description',
        'status',
    ];

    protected $appends = [
//        'video_url',
    ];
    
    public function register()
    {
        return $this->hasOne(Register::class, 'id', 'user_id');
    }
    
}
