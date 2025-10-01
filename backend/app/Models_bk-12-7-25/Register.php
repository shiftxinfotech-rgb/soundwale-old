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

class Register extends Authenticatable {

    use HasApiTokens,
        Notifiable;

    use HasFactory;

    protected $table = 'register';
    protected $fillable = [
        'id',
        'image',
        'name',
		'nick_name',
        'mobile_number',
        'code_sort',
        'code',
        'email',
        'extra_mobile_number',
        'role_id',
        'categories_id',
        'company_name',
        'password',
        'status',
        'taluka',
        'district',
        'country_id',
        'state_id',
        'city_id',
        'village',
        'location',
        'latitude',
        'longitude',
        'facebook_link',
        'instagram_link',
        'web_link',
        'sound_farm_name',
        'visiting_card_image',
        'description',
        'authorised_dealer_company_name',
        'company_about',
        'secondary_name',
        'secondary_code',
        'secondary_mobile_number',
        'export_name',
        'export_code',
        'export_mobile_number',
        'domestic_name',
        'domestic_code',
        'domestic_mobile_number',
        'dealer_list_area_wise_type',
        'dealer_list_area_wise_website',
        'dealer_list_area_wise_pdf',
        'youtube_link',
        'working_with',
        'coaching_class',
        'new_company',
        'receive_promotional_and_marketing_email',
        'available_on_whatsapp_with_same_number',
        'whats_app_code',
        'whats_app_mobile_number',
        'hide_profile_in_directory',
        'catalogue_type',
        'catalogue_website',
        'catalogue_pdf',
        'description_pdf',
        'service_center',
        'view_counter',
		'personal_name',
        'your_best_engineer',
		'category_id',
        'sub_category_id',
		'service_center_info',
    ];
    protected $hidden = ['password', 'last_login_ip', 'last_logged_in_at', 'secondary_name', 'secondary_code', 'secondary_mobile_number', 'export_name', 'export_code', 'export_mobile_number', 'domestic_name', 'domestic_code', 'domestic_mobile_number'];
// protected $appends = [
//     "image_full_path"
// ];

    protected $appends = [
        'image_url',
        'visiting_card_image_url',
        'dealer_list_area_wise_pdf_url',
        'catalogue_pdf_url',
        'description_pdf_url',
    ];

    const IMAGE_PATH = 'app/register/';

    public function getImageUrlAttribute() {
        return Helper::getImageUrlProfile(self::IMAGE_PATH . $this->image, $this->image);
    }

    public function getVisitingCardImageUrlAttribute() {
        return Helper::getImageUrl(self::IMAGE_PATH . $this->visiting_card_image, $this->visiting_card_image);
    }

    public function getDealerListAreaWisePdfUrlAttribute() {
        return Helper::getImageUrl(self::IMAGE_PATH . $this->dealer_list_area_wise_pdf, $this->dealer_list_area_wise_pdf);
    }

    public function getDescriptionPdfUrlAttribute() {
        return Helper::getImageUrl(self::IMAGE_PATH . $this->description_pdf, $this->description_pdf);
    }

    public function getCataloguePdfUrlAttribute() {
        return Helper::getImageUrl(self::IMAGE_PATH . $this->catalogue_pdf, $this->catalogue_pdf);
    }

    public function isValidToken($token) {
        $tokenData = \DB::table('password_resets')->where('email', $this->email)->first();
        if (!$tokenData) {
            return false; // Token not found for this email
        }

        $expirationTime = Carbon::parse($tokenData->created_at)->addMinutes(config('auth.passwords.' . config('auth.defaults.passwords') . '.expire'));
        if (Carbon::now()->gt($expirationTime)) {
            return false; // Token has expired
        }

        return Hash::check($token, $tokenData->token);
    }

    protected static function booted() {
        parent::boot();

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

    public function getImageFullPathAttribute() {
        return getImageUrl($this->image);
    }

    public function country() {
        return $this->hasOne(Country::class, 'id', 'country_id');
    }

    public function state() {
        return $this->hasOne(States::class, 'id', 'state_id');
    }

    public function city() {
        return $this->hasOne(Cities::class, 'id', 'city_id');
    }

    public function role() {
        return $this->hasOne(Role::class, 'id', 'role_id');
    }

    public function roles() {
        return $this->belongsToMany(Role::class, 'id', 'role_id');
    }

    public function review() {
        return $this->hasMany(Review::class, 'user_id');
    }

    public function videos() {
        return $this->hasMany(RegisterVideo::class, 'user_id');
    }

    public function review_directory() {
        return $this->hasMany(Review::class, 'relevant_id')->where('type', 'directory');
    }

	public function review_seller() {
        return $this->hasMany(Review::class, 'relevant_id')->where('type', 'seller');
    }

    public function user_reviews() {
        return $this->hasMany(Review::class, 'relevant_id');
    }

	public function sellerDetails() {
        return $this->hasOne(SellerDetails::class, 'user_id', 'id');
    }

    public function reviewSeller() {
        return $this->hasManyThrough(
                        Review::class, SellerDetails::class, 'user_id', // Foreign key on seller_details
                        'relevant_id', // Foreign key on reviews
                        'id', // Local key on register
                        'id'                // Local key on seller_details
                )->where('type', 'seller');
    }

}
