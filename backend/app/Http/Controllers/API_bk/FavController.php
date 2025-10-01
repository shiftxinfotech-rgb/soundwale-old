<?php

namespace App\Http\Controllers\API;

use App\Helper\Helper;
use App\Http\Controllers\Controller;
use App\Models\ContactUs;
use App\Models\SellerDetails;
use App\Models\SellerDetailsImages;
use App\Models\SellerDetailsLike;
use App\Models\BuyerRequirment;
use App\Models\BuyerRequirmentImages;
use App\Models\BuyerRequirmentLike;
use App\Models\Catalogue;
use App\Models\CatalogueLike;
use App\Models\Role;
use App\Models\Admin;
use App\Models\MailConfiguration;
use App\Models\Register;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Mail;
use App\Mail\ContactUsMail;
use App\Mail\ContactUsMailAdmin;

class FavController extends Controller {

    public function get_by_type(Request $request) {
        $user = Auth::user();
        $validator = Validator::make($request->all(), [
                    'type' => 'required',
                        ], [
                    'type.required' => 'The type field is required.',
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => false, 'message' => $validator->errors()], 400);
        }

        try {

            $perPage = (int) $request->get('limit', config('app.API_PER_PAGE'));
            $page = (int) $request->get('page', 1);
            $offset = ($page - 1) * $perPage;
            if ($request->type == "seller") {

                $data = SellerDetails::select('register.role_id', 'business.establishment_year', 'business.establishment_year', SellerDetails::raw("IF(seller_details_likes.status = 1, 1, 0) as is_likes"), 'seller_details.id', 'seller_details.view_counter', 'seller_details.other_details', 'seller_details.user_id', SellerDetails::raw("
            CASE 
                WHEN register.image IS NOT NULL AND register.image != '' 
                THEN CONCAT('https://developerwork.in/soundwale/public/storage/app/register/', register.image)
                ELSE CONCAT('https://developerwork.in/soundwale/public/admin-asset/images/profile_default_image.png') 
            END AS user_profile_url
        "), 'register.name as user_name', 'register.code as user_code', 'register.mobile_number as user_mobile_number', 'seller_details.country_id', 'country.country_name as country_name', 'seller_details.state_id', 'state.state_name as state_name', 'seller_details.city_id', 'city.city_name as city_name', 'seller_details.requirment_id', 'requirment.name as requirment_name', 'seller_details.categories_id', 'categories.name as main_category_name', 'seller_details.category_id', 'category.name as category_name', 'seller_details.sub_category_id', 'sub_category.name as sub_category_name', 'seller_details.price', 'seller_details.description', 'seller_details.created_at')
                        ->join('register', 'seller_details.user_id', '=', 'register.id')
                        ->join('country', 'seller_details.country_id', '=', 'country.id')
                        ->join('state', 'seller_details.state_id', '=', 'state.id')
                        ->join('city', 'seller_details.city_id', '=', 'city.id')
                        ->join('requirment', 'seller_details.requirment_id', '=', 'requirment.id')
                        ->join('categories', 'seller_details.categories_id', '=', 'categories.id')
                        ->join('category', 'seller_details.category_id', '=', 'category.id')
                        ->join('sub_category', 'seller_details.sub_category_id', '=', 'sub_category.id')
                        ->leftjoin('business', 'seller_details.user_id', '=', 'business.user_id')
                        ->leftjoin('seller_details_likes', 'seller_details.id', '=', 'seller_details_likes.seller_details_id')
                        ->withAvg(['review' => function ($query) {
                                $query->where('type', 'seller');
                            }], 'rating')->withCount('review')
                        ->where('seller_details_likes.user_id', '=', $user->id)
                        ->get();

                $usersWithRoles = $data->map(function ($data) {
                    $roleIds = explode(',', $data->role_id);
                    $roles = Role::whereIn('id', $roleIds)
                            ->get()
                            ->toArray();
                    $data->roles = $roles;

                    $images = SellerDetailsImages::where('seller_details_id', $data->id)
                            ->get()
                            ->toArray();
                    $data->images = $images;

                    return $data;
                });
            } else if ($request->type == "buyer") {
                $data = BuyerRequirment::select('register.role_id', BuyerRequirment::raw("IF(buyer_requirment_likes.status = 1, 1, 0) as is_likes"), 'buyer_requirment.id', 'buyer_requirment.user_id', 'buyer_requirment.other_details', BuyerRequirment::raw("
            CASE 
                WHEN register.image IS NOT NULL AND register.image != '' 
                THEN CONCAT('https://developerwork.in/soundwale/public/storage/app/register/', register.image)
                ELSE CONCAT('https://developerwork.in/soundwale/public/admin-asset/images/profile_default_image.png') 
            END AS user_profile_url
        "), 'register.name as user_name', 'register.code as user_code', 'register.mobile_number as user_mobile_number', 'buyer_requirment.country_id', 'country.country_name as country_name', 'buyer_requirment.state_id', 'state.state_name as state_name', 'buyer_requirment.city_id', 'city.city_name as city_name', 'buyer_requirment.requirment_id', 'requirment.name as requirment_name', 'buyer_requirment.categories_id', 'categories.name as main_category_name', 'buyer_requirment.category_id', 'category.name as category_name', 'buyer_requirment.sub_category_id', 'sub_category.name as sub_category_name', 'buyer_requirment.price', 'buyer_requirment.description', 'buyer_requirment.image', 'buyer_requirment.created_at')
                        ->join('register', 'buyer_requirment.user_id', '=', 'register.id')
                        ->join('country', 'buyer_requirment.country_id', '=', 'country.id')
                        ->join('state', 'buyer_requirment.state_id', '=', 'state.id')
                        ->join('city', 'buyer_requirment.city_id', '=', 'city.id')
                        ->join('requirment', 'buyer_requirment.requirment_id', '=', 'requirment.id')
                        ->join('categories', 'buyer_requirment.categories_id', '=', 'categories.id')
                        ->join('category', 'buyer_requirment.category_id', '=', 'category.id')
                        ->join('sub_category', 'buyer_requirment.sub_category_id', '=', 'sub_category.id')
                        ->leftjoin('buyer_requirment_likes', 'buyer_requirment.id', '=', 'buyer_requirment_likes.buyer_requirment_id')
                        ->where('buyer_requirment_likes.user_id', '=', $user->id)
                        ->get();
                $usersWithRoles = $data->map(function ($data) {
                    $roleIds = explode(',', $data->role_id);
                    $roles = Role::whereIn('id', $roleIds)
                            ->get()
                            ->toArray();
                    $data->roles = $roles;

                    $images = BuyerRequirmentImages::where('buyer_requirment_id', $data->id)
                            ->get()
                            ->toArray();
                    $data->images = $images;
                    return $data;
                });
            } else if ($request->type == "catalogue") {
                $data = Catalogue::select('catalogue.*')
                        ->leftjoin('catalogue_likes', 'catalogue.id', '=', 'catalogue_likes.catalogue_id')
                        ->where('catalogue_likes.user_id', '=', $user->id)
                        ->get();
            }
            if ($data->isEmpty()) {
                return response()->json(['status' => false, 'message' => 'Details not found.'], 404);
            } else {
                
                $total = $data->count();
                $data = $data->slice($offset, $perPage)->values();

                $meta = array();
                $meta['current_page'] = $page;
                $meta['per_page'] = $perPage;
                $meta['next_page_url'] = $total > ($offset + $perPage) ? url()->current() . '?page=' . ($page + 1) . '&limit=' . $perPage : null;
                $meta['have_more_records'] = $total > ($offset + $perPage);
                $meta['total'] = $total;
                return response()->json(['status' => true, 'data' => ['data' => $data, 'meta' => $meta]], 200);
            }
        } catch (\Throwable $th) {
            \Log::error(request()->path() . "\n" . $th->getMessage());
            return response()->json(['status' => false, 'message' => 'Oops! Something went wrong. Please try again later.'], 500);
        }
    }

}
