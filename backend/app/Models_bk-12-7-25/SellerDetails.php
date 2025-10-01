<?php

namespace App\Models;

use App\Helper\Helper;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class SellerDetails extends Model {

    public $table = 'seller_details';
    protected $fillable = [
        'role_id',
        'user_id',
		'product_id',
        'country_id',
        'state_id',
        'city_id',
        'requirment_id',
        'categories_id',
        'category_id',
        'sub_category_id',
        'price',
        'other_details',
        'description',
        'image',
        'status',
        'view_counter',
    ];
    protected $appends = [
        'image_url',
    ];

    const IMAGE_PATH = 'app/sellar_details/';

    public function getImageUrlAttribute() {
        return Helper::getImageUrl(self::IMAGE_PATH . $this->image, $this->image);
    }

    protected static function booted() {
        parent::boot();
// image 1
        static::updating(function ($obj) {
            if ($obj->image != $obj->getOriginal('image')) {
                Storage::delete(self::IMAGE_PATH . $obj->getOriginal('image'));
            }
        });
        static::deleted(function ($obj) {
            if ($obj->image) {
                Storage::delete(self::IMAGE_PATH . $obj->image);
            }
        });
    }

    public function register() {
        return $this->hasOne(Register::class, 'id', 'user_id');
    }

    public function country() {
        return $this->hasOne(Country::class, 'id', 'country_id');
    }

    public function states() {
        return $this->hasOne(States::class, 'id', 'state_id');
    }

    public function cities() {
        return $this->hasOne(Cities::class, 'id', 'city_id');
    }

    public function requirment() {
        return $this->hasOne(Requirment::class, 'id', 'requirment_id');
    }

    public function categories() {
        return $this->hasOne(Categories::class, 'id', 'categories_id');
    }

    public function category() {
        return $this->hasOne(Category::class, 'id', 'category_id');
    }

    public function sub_category() {
        return $this->hasOne(SubCategory::class, 'id', 'sub_category_id');
    }

    public function review() {
        return $this->hasMany(Review::class, 'relevant_id');
    }

}
