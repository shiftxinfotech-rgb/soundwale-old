<?php

namespace App\Http\Controllers\API;

use App\Helper\Helper;
use App\Http\Controllers\Controller;
use App\Models\Admin;
use App\Models\MailConfiguration;
use App\Models\Register;
use App\Models\Business;
use App\Models\Categories;
use App\Models\BusinessVideo;
use App\Models\BusinessCompany;
use App\Models\Category;
use App\Models\SubCategory;
use App\Models\BusinessImages;
use App\Models\Catalogue;
use App\Models\Review;
use App\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Mail;
use App\Mail\ContactUsMail;
use App\Mail\ContactUsMailAdmin;
use DB;

class DirectoryController extends Controller {

    public function lists(Request $request) {
        $user = auth()->user();

        $validator = Validator::make($request->all(), [
                    'role_id' => 'required',
                        ], [
                    'role_id.required' => 'The role id field is required.',
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => false, 'message' => $validator->errors()], 400);
        }

        try {

            $perPage = (int) $request->get('limit', config('app.API_PER_PAGE'));
            $page = (int) $request->get('page', 1);
            $offset = ($page - 1) * $perPage;

            $search = $request->search;
            $role_id = $request->role_id;
            $city_id = $request->city_id;
			$category_id = $request->category_id;
			$product_id = $request->product_id;
            $company_id = $request->company_id;
            $model_id = $request->model_id;

            $query = Register::select('register.*', 'country.country_name as country_name', 'state.state_name as state_name', 'city.city_name as city_name')
                    ->join('country', 'register.country_id', '=', 'country.id')
                    ->join('state', 'register.state_id', '=', 'state.id')
                    ->join('city', 'register.city_id', '=', 'city.id')
                    ->leftJoin('business', 'business.user_id', '=', 'register.id') // Join business
                    ->withAvg(['review_directory as review_avg_rating' => function ($query) use ($user) {
//                            $query->where('user_id', '!=', $user->id);
                        }], 'rating')
                    ->withCount(['review_directory as review_count' => function ($query) use ($user) {
                            $query->where('type', 'directory');
//                            $query->where('user_id', '!=', $user->id);
                        }])
//                ->where('register.hide_profile_in_directory', '=', 0)
                    ->where('register.id', '!=', $user->id);     
            if (isset($search)) {
                $query->where('register.name', 'LIKE', "%{$search}%");
				$query->orWhere('business.product_info', 'LIKE', '%"product_name":"' . $search . '%');
                $query->orWhere('business.product_info', 'LIKE', '%"company_name":"' . $search . '%');
                $query->orWhere('business.product_info', 'LIKE', '%"model_name":"' . $search . '%');
            }
            if (isset($role_id)) {
                $role_id = explode(",", $role_id);
                foreach ($role_id as $role_idd) {
                    $query->whereRaw("FIND_IN_SET(?, register.role_id) > 0", [$role_idd]);
                }
            }
            if (isset($city_id)) {
                if ($city_id != "all") {
                    $city_id = explode(",", $city_id);
                    $query->where(function ($q) use ($city_id) {
                        foreach ($city_id as $city_idd) {
                            $q->orWhereRaw("FIND_IN_SET(?, register.city_id) > 0", [$city_idd]);
                        }
                    });
                }
            }
			if (isset($category_id)) {
                if ($category_id != "all") {
                    $category_id = explode(",", $category_id);
                    foreach ($category_id as $category_idd) {
                        $query->whereRaw("FIND_IN_SET(?, business.category_id) > 0", [$category_idd]);
                    }
                }
            }
			if (isset($product_id)) {
                $query->where(function ($query2) use ($product_id) {
                    $product_id = explode(",", $product_id);
                    foreach ($product_id as $id2) {
                        $query2->orWhere('business.product_info', 'LIKE', '%"product_id":"' . $id2 . '%');
                    }
                });
            }
            if (isset($company_id)) {
                $query->where(function ($query3) use ($company_id) {
                    $company_id = explode(",", $company_id);
                    foreach ($company_id as $id3) {
                        $query3->orWhere('business.product_info', 'LIKE', '%"company_id":"' . $id3 . '%');
                    }
                });
            }
            if (isset($model_id)) {
                $query->where(function ($query4) use ($model_id) {
                    $model_id = explode(",", $model_id);
                    foreach ($model_id as $id4) {
                        $query4->orWhere('business.product_info', 'LIKE', '%"model_id":"' . $id4 . '%');
                    }
                });
            }
            $data = $query->get();

            $usersWithRoles = $data->map(function ($data) {
                $roleIds = explode(',', $data->role_id);
                $roles = Role::whereIn('id', $roleIds)
                        ->get()
                        ->toArray();
                $data->roles = $roles;

                return $data;
            });
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

    public function get_by_id(Request $request) {

        $user = auth()->user();

        $validator = Validator::make($request->all(), [
                    'id' => 'required',
                        ], [
                    'id.required' => 'The user id field is required.',
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => false, 'message' => $validator->errors()], 400);
        }

//        try {

        $data = Register::select('register.*', 'country.country_name as country_name', 'state.state_name as state_name', 'city.city_name as city_name')
                ->join('country', 'register.country_id', '=', 'country.id')
                ->join('state', 'register.state_id', '=', 'state.id')
                ->join('city', 'register.city_id', '=', 'city.id')
                ->where('register.id', '=', $request->id)
                ->first();
        if (!empty($data)) {
            $roleIds = explode(',', $data->role_id);
            $roles = Role::whereIn('id', $roleIds)
                    ->get()
                    ->toArray();
            $data->roles = $roles;
        }
        if (!$data) {
            return response()->json(['status' => false, 'message' => 'Details not found.'], 404);
        }
        $business_data = array();
        $business_company_pdf_data = array();
        $business_shop_images_data = array();
        $business_shop_video_data = array();
        $review_data = array();
        $catalogue_data = array();
        $review_avg_rating = 0;
        $review_count = 0;
        if (isset($data)) {
            $business_data = Business::select('*')->where('user_id', $request->id)->get();
            $business_data = $business_data->map(function ($business_data) {
                // Explode comma-separated IDs
                $companies_Ids = explode(',', $business_data->companies_id);
                $service_center_Ids = explode(',', $business_data->service_center_id);
                $categoryIds = explode(',', $business_data->category_id);
                $subCategoryIds = explode(',', $business_data->sub_category_id);

                // Fetch category names
                $companies_Names = Categories::whereIn('id', $companies_Ids)->pluck('name')->toArray();
                $service_centerNames = Categories::whereIn('id', $service_center_Ids)->pluck('name')->toArray();
                $categoryNames = Category::whereIn('id', $categoryIds)->pluck('name')->toArray();
                $subCategoryNames = SubCategory::whereIn('id', $subCategoryIds)->pluck('name')->toArray();

                // Add new keys
                $business_data['companies_name'] = implode(',', $companies_Names);
                $business_data['service_center_name'] = implode(',', $service_centerNames);
                $business_data['category_names'] = implode(',', $categoryNames);
                $business_data['sub_category_names'] = implode(',', $subCategoryNames);

                return $business_data;
            });
            $business_company_pdf_data = BusinessCompany::select('*')->where('user_id', $request->id)->get();
            $business_shop_images_data = BusinessImages::select('*')->where('user_id', $request->id)->get();
            $business_shop_video_data = BusinessVideo::select('*')->where('user_id', $request->id)->get();
            $review_data = Review::select('review.*', 'register.role_id', 'register.name as user_name', Review::raw("
            CASE 
                WHEN register.image IS NOT NULL AND register.image != '' 
                THEN CONCAT('https://soundwale.in/public/storage/app/register/', register.image)
                ELSE CONCAT('https://soundwale.in/public/admin-asset/images/profile_default_image.png') 
            END AS user_profile_url
        "))
//                    ->leftJoin('seller_details', function ($join) {
//                        $join->on('review.relevant_id', '=', 'seller_details.id')
//                        ->where('review.type', '=', 'directory');
//                    })
//                    ->leftJoin('buyer_requirment', function ($join) {
//                        $join->on('review.relevant_id', '=', 'buyer_requirment.id')
//                        ->where('review.user_id', '!=', 'buyer');
//                    })
                    ->join('register', 'review.user_id', '=', 'register.id')
                    ->where('review.type', '=', "directory")
                    ->where('review.user_id', '!=', $request->id)
                    ->where('review.relevant_id', '=', $request->id)
                    ->get();
            $usersWithRoles = $review_data->map(function ($review_data) {
                $roleIds = explode(',', $review_data->role_id);
                $roles1 = Role::whereIn('id', $roleIds)
                        ->get()
                        ->toArray();
                $review_data->roles = $roles1;
            });
            $catalogue_data = Catalogue::select('catalogue.*', Catalogue::raw("IF(catalogue_likes.status = 1, 1, 0) as is_likes"))
                    ->leftJoin('catalogue_likes', function($join) use ($user) {
                        $join->on('catalogue.id', '=', 'catalogue_likes.catalogue_id')
                        ->where('catalogue_likes.user_id', '=', $user->id);
                    })
//                    ->leftjoin('catalogue_likes', 'catalogue.user_id', '=', 'catalogue_likes.user_id')
                    ->where('catalogue.user_id', '=', $user->id)
                    ->orderBy('catalogue.id', 'desc')
                    ->get();

            $review_avg_rating = $review_data->avg('rating');
            $review_count = $review_data->count();
        }
        $data['review_data'] = $review_data;
        $data['review_avg_rating'] = $review_avg_rating;
        $data['review_count'] = $review_count;
        $data['catalogue_data'] = $catalogue_data;
        $data['business_data'] = $business_data;
        $product_info_data = array();
        if (!empty($business_data[0]->product_info)) {
            $product_info_data = json_decode($business_data[0]->product_info, true);
            $query2 = DB::table('category')
                    ->join('sub_category', 'category.id', '=', 'sub_category.category_id')
                    ->select('category.id as category_id', 'category.name as category_name', 'sub_category.id as sub_category_id', 'sub_category.name as sub_category_name');
            $query2->where(function ($q) use ($product_info_data) {
                foreach ($product_info_data as $pair) {
                    $q->orWhere(function ($subQuery) use ($pair) {
                        if (isset($pair['category_id'])) {
                            $subQuery->where('category.id', $pair['category_id'])
                                    ->where('sub_category.id', $pair['sub_category_id']);
                        }
                    });
                }
            });
            $product_info_data = $query2->get();
        }
        $data['product_info_data'] = $product_info_data;
        $data['business_company_pdf_data'] = $business_company_pdf_data;
        $data['business_shop_images_data'] = $business_shop_images_data;
        $data['business_shop_video_data'] = $business_shop_video_data;


        if (!empty($data)) {
            Register::find($request->id)->increment('view_counter');
            return response()->json(['status' => true, 'data' => $data], 200);
        } else {
            return response()->json(['status' => false, 'message' => 'Details not found.'], 404);
        }
//        } catch (\Throwable $th) {
//            \Log::error(request()->path() . "\n" . $th->getMessage());
//            return response()->json(['status' => false, 'message' => 'Oops! Something went wrong. Please try again later.'], 500);
//        }
    }

}
