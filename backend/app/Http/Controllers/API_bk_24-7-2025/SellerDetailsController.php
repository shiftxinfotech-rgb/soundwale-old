<?php

namespace App\Http\Controllers\API;

use App\Helper\Helper;
use App\Http\Controllers\Controller;
use App\Models\ContactUs;
use App\Models\Manufacturer;
use App\Models\Country;
use App\Models\States;
use App\Models\Cities;
use App\Models\SellerDetails;
use App\Models\SellerDetailsImages;
use App\Models\SellerDetailsLike;
use App\Models\CatalogueLike;
use App\Models\Review;
use App\Models\ViewCounter;
use App\Models\Catalogue;
use App\Models\Categories;
use App\Models\Category;
use App\Models\SubCategory;
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
use DB;

class SellerDetailsController extends Controller {

    public function lists(Request $request) {

        $user = Auth::user();

//SellerDetails::raw('COUNT(*) as average_rating')
//        SellerDetails::raw('AVG(review.rating) as average_rating'),

        $perPage = (int) $request->get('limit', config('app.API_PER_PAGE'));
        $page = (int) $request->get('page', 1);
        $offset = ($page - 1) * $perPage;

        $search = $request->search;
        $categories_id = $request->categories_id;
        $category_id = $request->category_id;
        $sub_category_id = $request->sub_category_id;
        $city_id = $request->city_id;
        $requirment_id = $request->requirment_id;
        $price = $request->price;

        $query = SellerDetails::select('register.role_id', 'seller_details.role_id as selected_role_id', 'business.establishment_year', 'business.establishment_year', SellerDetails::raw("
            CASE 
                WHEN register.image IS NOT NULL AND register.image != '' 
                THEN CONCAT('https://soundwale.in/public/storage/app/register/', register.image)
                ELSE CONCAT('https://soundwale.in/public/admin-asset/images/profile_default_image.png') 
            END AS user_profile_url
        "), SellerDetails::raw("IF(seller_details_likes.status = 1, 1, 0) as is_likes"), 'seller_details.id', 'seller_details.product_id', 'seller_details.address', 'seller_details.latitude', 'seller_details.longitude', 'seller_details.view_counter', 'seller_details.other_details', 'seller_details.user_id', 'register.name as user_name', 'register.code as user_code', 'register.mobile_number as user_mobile_number', 'seller_details.country_id', 'country.country_name as country_name', 'seller_details.state_id', 'state.state_name as state_name', 'seller_details.city_id', 'city.city_name as city_name', 'seller_details.requirment_id', 'requirment.name as requirment_name', 'seller_details.categories_id', 'categories.name as main_category_name', 'seller_details.category_id', 'category.name as category_name', 'seller_details.sub_category_id', 'sub_category.name as sub_category_name', 'seller_details.price', 'seller_details.description', 'seller_details.created_at')
                        ->join('register', 'seller_details.user_id', '=', 'register.id')
                        ->join('country', 'seller_details.country_id', '=', 'country.id')
                        ->leftjoin('state', 'seller_details.state_id', '=', 'state.id')
                        ->join('city', 'seller_details.city_id', '=', 'city.id')
                        ->join('requirment', 'seller_details.requirment_id', '=', 'requirment.id')
                        ->join('categories', 'seller_details.categories_id', '=', 'categories.id')
                        ->join('category', 'seller_details.category_id', '=', 'category.id')
                        ->leftjoin('sub_category', 'seller_details.sub_category_id', '=', 'sub_category.id')
                        ->leftjoin('business', 'seller_details.user_id', '=', 'business.user_id')
                        ->leftJoin('seller_details_likes', function ($join) use ($user) {
                            $join->on('seller_details.id', '=', 'seller_details_likes.seller_details_id')
                            ->where('seller_details_likes.user_id', '=', $user->id);
                        })
//                        ->leftjoin('seller_details_likes', 'seller_details.id', '=', 'seller_details_likes.seller_details_id')
                        ->withAvg(['review' => function ($query) {
                                $query->where('type', 'seller');
                            }], 'rating')->withCount('review');
//                ->leftJoin('review', function ($join) {
//                    $join->on('seller_details.id', '=', 'review.relevant_id')
//                    ->where('review.type', '=', "'seller'");
//                })
//                ->groupBy('seller_details.id','seller_details.user_id')        

        $roles_id = explode(",", $user->role_id);
        $query->where(function ($q) use ($roles_id) {
            foreach ($roles_id as $roles_idd) {
                $q->orWhereRaw("FIND_IN_SET(?, seller_details.role_id) > 0", [$roles_idd]);
            }
        });
        if (isset($categories_id)) {
            $categories_id = explode(",", $categories_id);
            $query->where(function ($q) use ($categories_id) {
                foreach ($categories_id as $categories_idd) {
                    $q->orWhereRaw("FIND_IN_SET(?, seller_details.categories_id) > 0", [$categories_idd]);
                }
            });
        }
        if (isset($category_id)) {
            $category_id = explode(",", $category_id);
            $query->where(function ($q) use ($category_id) {
                foreach ($category_id as $category_idd) {
                    $q->orWhereRaw("FIND_IN_SET(?, seller_details.category_id) > 0", [$category_idd]);
                }
            });
        }
        if (isset($sub_category_id)) {
            $sub_category_id = explode(",", $sub_category_id);
            $query->where(function ($q) use ($sub_category_id) {
                foreach ($sub_category_id as $sub_category_idd) {
                    $q->orWhereRaw("FIND_IN_SET(?, seller_details.sub_category_id) > 0", [$sub_category_idd]);
                }
                $q->orWhere('seller_details.sub_category_id', 0)->orWhereNull('seller_details.sub_category_id');
            });
        }
        if (isset($city_id)) {
            if ($city_id != "all") {
                $city_id = explode(",", $city_id);
                $query->where(function ($q) use ($city_id) {
                    foreach ($city_id as $city_idd) {
                        $q->orWhereRaw("FIND_IN_SET(?, seller_details.city_id) > 0", [$city_idd]);
                    }
                });
            }
        }
        if (isset($requirment_id)) {
            $query->where("seller_details.requirment_id", $requirment_id);
        }
        if (isset($price)) {
            $price = explode(',', $price);
            $query->whereBetween("seller_details.price", $price);
        }
        $query->where(function ($q) use ($search) {
            $q->orWhere('categories.name', 'LIKE', "%{$search}%")
                    ->orWhere('category.name', 'LIKE', "%{$search}%")
                    ->orWhere('sub_category.name', 'LIKE', "%{$search}%")
                    ->orWhereExists(function ($q1) use ($search) {
                        $q1->select(DB::raw(1))
                        ->from('manufacturer')
                        ->whereRaw("FIND_IN_SET(manufacturer.id, seller_details.product_id)")
                        ->where('manufacturer.name', 'like', '%' . $search . '%');
                    });
        });

        $latitude = $request->latitude;
        $longitude = $request->longitude;
        $radius = $request->radius ?? 5; // Default to 5 km if not provided
        if (!empty($latitude) && !empty($longitude)) {
            $haversine = "(6371 * acos(cos(radians(?)) * cos(radians(seller_details.latitude)) * cos(radians(seller_details.longitude) - radians(?)) + sin(radians(?)) * sin(radians(seller_details.latitude))))";
            $query->whereRaw("$haversine <= ?", [$latitude, $longitude, $latitude, $radius]);
        }

        $data = $query->orderBy('seller_details.id', 'desc')->get();
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

            $productIds = explode(',', $data->product_id ?? '');
            $products = Manufacturer::whereIn('id', $productIds)->pluck('name', 'id')->toArray();
            $data->product_names = implode(',', array_values($products));

            $productes = Manufacturer::whereIn('id', $productIds)->get(['id', 'name']);
            $what_manufacturer = $productes->map(function ($productt) {
                return [
                    'id' => $productt->id,
                    'value' => $productt->name,
                ];
            });
            $data->what_manufacturer = $what_manufacturer;

            $selected_role_ids = explode(',', $data->selected_role_id);
            $selected_roles_list = Role::whereIn('id', $selected_role_ids)->get(['id', 'name', 'slug']);
            $selected_roles = $selected_roles_list->map(function ($selected_roles) {
                return [
                    'id' => $selected_roles->id,
                    'name' => $selected_roles->name,
                    'slug' => $selected_roles->slug,
                ];
            });
            $data->selected_role = $selected_roles;

            return $data;
        });
        if ($data->isEmpty()) {
            return response()->json(['status' => false, 'message' => 'Details not found.'], 404);
        }

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

    public function SellerDetailsSave(Request $request) {
        $user = Auth::user();

        $validator = Validator::make($request->all(), [
                    'role_id' => 'required',
                    'country_id' => 'required',
//                    'state_id' => 'required',
                    'city_id' => 'required',
                    'requirment_id' => 'required',
                    'categories_id' => 'required',
                    'category_id' => 'required',
                    'sub_category_id' => 'required',
                    'price' => 'required',
//                    'other_details' => 'required',
                    'address' => 'required',
                    'latitude' => 'required',
                    'longitude' => 'required',
                        ], [
                    'role_id.required' => 'The role field is required.',
                    'country_id.required' => 'The country field is required.',
//                    'state_id.required' => 'The state field is required.',
                    'city_id.required' => 'The city field is required.',
                    'requirment_id.required' => 'The requirment field is required.',
                    'categories_id.required' => 'The categories field is required.',
                    'category_id.required' => 'The category field is required.',
                    'sub_category_id.required' => 'The sub category field is required.',
                    'price.required' => 'The price field is required.',
//                    'other_details.required' => 'The other details field is required.',
                    'address.required' => 'The address field is required.',
                    'latitude.required' => 'The latitude field is required.',
                    'longitude.required' => 'The longitude field is required.',
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => false, 'message' => $validator->errors()], 400);
        }

        try {
            $data = $request->only('role_id', 'address', 'latitude', 'longitude', 'product_id', 'user_id', 'country_id', 'other_details', 'state_id', 'city_id', 'requirment_id', 'categories_id', 'category_id', 'sub_category_id', 'price', 'description', 'image', 'status');

            $categories_id = $request->categories_id;
            if (isset($categories_id)) {
                if (is_numeric($categories_id)) {
                    $categories_id = $categories_id;
                } else {
                    $company = Categories::firstOrCreate([
                                'name' => $categories_id,
                                'user_id' => $user->id,
                                'status' => 0,
                    ]);
                    $categories_id = $company->id;
                }
            }
            $data['categories_id'] = $categories_id;

            $category_id = $request->category_id;
            if (isset($category_id)) {
                if (is_numeric($category_id)) {
                    $category_id = $category_id;
                } else {
                    $category_data = Category::firstOrCreate([
                                'name' => $category_id,
                                'user_id' => $user->id,
                                'status' => 0,
                    ]);
                    $category_id = $category_data->id;
                }
            }
            $data['category_id'] = $category_id;

            $sub_category_id = $request->sub_category_id;
            if (isset($sub_category_id)) {
                if ($sub_category_id == "undefined" || $sub_category_id == null || $sub_category_id == 0) {
                    $sub_category_id = 0;
                } else if (is_numeric($sub_category_id)) {
                    $sub_category_id = $sub_category_id;
                } else {
                    $sub_category_data = SubCategory::firstOrCreate([
                                'name' => $sub_category_id,
                                'category_id' => $category_id,
                                'user_id' => $user->id,
                                'status' => 0,
                    ]);
                    $sub_category_id = $sub_category_data->id;
                }
            }
            $data['sub_category_id'] = $sub_category_id;

            $data['user_id'] = $user->id;
            $data['status'] = 1;

            if ($request->has('country_name')) {
                if ($request->country_name != "") {
                    $country_data = Country::firstOrCreate(
                                    [
                                'country_name' => $request->country_name,
                                    ], [
                                'user_id' => $user->id,
                                    ]
                    );
                    $data['country_id'] = $country_data->id;
                }
            }
            if ($request->has('state_name')) {
                if ($request->state_name != "") {
                    $state_data = States::firstOrCreate(
                                    [
                                'id_country' => $data['country_id'],
                                'state_name' => $request->state_name,
                                    ], [
                                'user_id' => $user->id,
                                    ]
                    );
                    $data['state_id'] = $state_data->id;
                }
            }
            if ($request->has('city_name')) {
                if ($request->city_name != "") {
                    $city_data = Cities::firstOrCreate(
                                    [
                                'id_country' => $data['country_id'],
                                'id_state' => $data['state_id'],
                                'city_name' => $request->city_name,
                                    ], [
                                'user_id' => $user->id,
                                    ]
                    );
                    $data['city_id'] = $city_data->id;
                }
            }

            $product_id_info = json_decode($request->product_id, true);
            $product_id_info_new = array();
            if ($request->product_id != "" && $request->product_id != "[]") {
                $product_id = "";
                foreach ($product_id_info as $product_id_info_row) {
                    if ($product_id_info_row['manufacturer_id'] == "" || $product_id_info_row['manufacturer_id'] == "0" || $product_id_info_row['manufacturer_id'] == 0) {
                        $product_data = Manufacturer::firstOrCreate([
                                    'name' => $product_id_info_row['manufacturer_name'],
                                    'user_id' => $user->id,
                                    'status' => 0,
                        ]);
                        $product_id = (int) $product_data->id;
                    } else {
                        $product_id = (int) $product_id_info_row['manufacturer_id'];
                    }
                    $product_id_info_new[] = $product_id;
                }
                $data['product_id'] = implode(',', $product_id_info_new);
            }

            $seller_details = new SellerDetails($data);
            if ($seller_details->save()) {

                $seller_details_id = $seller_details->id;
                $imageRecords = [];
                if ($request->hasFile('images')) {
                    foreach ($request->file('images') as $file) {
                        $path = Helper::uploadImage($file, SellerDetailsImages::IMAGE_PATH);
                        $imageRecords[] = [
                            'user_id' => $user->id,
                            'seller_details_id' => $seller_details_id,
                            'image' => $path,
                        ];
                    }
                    if (!empty($imageRecords)) {
                        SellerDetailsImages::insert($imageRecords);
                    }
                }

                return response()->json([
                            'status' => true,
                            'message' => 'Your request was sent successfully.'
                                ], 200);
            }

            return response()->json(['status' => false, 'message' => 'Oops! Something went wrong. Please try again later.'], 500);
        } catch (\Throwable $th) {
            \Log::error(request()->path() . "\n" . $th->getMessage());
            return response()->json(['status' => false, 'message' => 'Oops! Something went wrong. Please try again later.'], 500);
        }
    }

    public function get_related_post(Request $request) {

        $validator = Validator::make($request->all(), [
                    'categories_id' => 'required',
                    'id' => 'required',
                        ], [
                    'categories_id.required' => 'The categories id field is required.',
                    'id.required' => 'The id field is required.',
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => false, 'message' => $validator->errors()], 400);
        }

        try {
            $limit = $request->limit;
            $query = SellerDetails::select('register.role_id', 'business.establishment_year', 'business.establishment_year', SellerDetails::raw("IF(seller_details_likes.status = 1, 1, 0) as is_likes"), 'seller_details.id', 'seller_details.address', 'seller_details.latitude', 'seller_details.longitude', 'seller_details.view_counter', 'seller_details.other_details', 'seller_details.user_id', SellerDetails::raw("
            CASE 
                WHEN register.image IS NOT NULL AND register.image != '' 
                THEN CONCAT('https://soundwale.in/public/storage/app/register/', register.image)
                ELSE CONCAT('https://soundwale.in/public/admin-asset/images/profile_default_image.png') 
            END AS user_profile_url
        "), 'register.name as user_name', 'register.code as user_code', 'register.mobile_number as user_mobile_number', 'seller_details.country_id', 'country.country_name as country_name', 'seller_details.state_id', 'state.state_name as state_name', 'seller_details.city_id', 'city.city_name as city_name', 'seller_details.requirment_id', 'requirment.name as requirment_name', 'seller_details.categories_id', 'categories.name as main_category_name', 'seller_details.category_id', 'category.name as category_name', 'seller_details.sub_category_id', 'sub_category.name as sub_category_name', 'seller_details.price', 'seller_details.description', 'seller_details.created_at')
                    ->join('register', 'seller_details.user_id', '=', 'register.id')
                    ->join('country', 'seller_details.country_id', '=', 'country.id')
                    ->leftjoin('state', 'seller_details.state_id', '=', 'state.id')
                    ->join('city', 'seller_details.city_id', '=', 'city.id')
                    ->join('requirment', 'seller_details.requirment_id', '=', 'requirment.id')
                    ->join('categories', 'seller_details.categories_id', '=', 'categories.id')
                    ->join('category', 'seller_details.category_id', '=', 'category.id')
                    ->leftjoin('sub_category', 'seller_details.sub_category_id', '=', 'sub_category.id')
                    ->leftjoin('business', 'seller_details.user_id', '=', 'business.user_id')
                    ->leftjoin('seller_details_likes', 'seller_details.id', '=', 'seller_details_likes.seller_details_id')
                    ->withAvg(['review' => function ($query) {
                            $query->where('type', 'seller');
                        }], 'rating')->withCount('review')
                    ->where('seller_details.categories_id', $request->categories_id)
                    ->where('seller_details.id', '!=', $request->id);
            if (isset($limit)) {
                $data = $query->limit($limit)->get();
            } else {
                $data = $query->get();
            }
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
            if ($data->isEmpty()) {
                return response()->json(['status' => false, 'message' => 'Details not found.'], 404);
            } else {
                return response()->json(['status' => true, 'data' => $data], 200);
            }
        } catch (\Throwable $th) {
            \Log::error(request()->path() . "\n" . $th->getMessage());
            return response()->json(['status' => false, 'message' => 'Oops! Something went wrong. Please try again later.'], 500);
        }
    }

    public function post_by_user_id(Request $request) {

        $user = Auth::user();
        try {
            $user_id = $request->user_id;
            $query = SellerDetails::select('register.role_id', 'seller_details.role_id as selected_role_id', 'business.establishment_year', 'business.establishment_year', SellerDetails::raw("IF(seller_details_likes.status = 1, 1, 0) as is_likes"), 'seller_details.id', 'seller_details.address', 'seller_details.latitude', 'seller_details.longitude', 'seller_details.product_id', 'seller_details.role_id as roles_id', 'seller_details.view_counter', 'seller_details.other_details', 'seller_details.user_id', SellerDetails::raw("
            CASE 
                WHEN register.image IS NOT NULL AND register.image != '' 
                THEN CONCAT('https://soundwale.in/public/storage/app/register/', register.image)
                ELSE CONCAT('https://soundwale.in/public/admin-asset/images/profile_default_image.png') 
            END AS user_profile_url
        "), 'register.name as user_name', 'register.code as user_code', 'register.mobile_number as user_mobile_number', 'seller_details.product_id', 'seller_details.country_id', 'country.country_name as country_name', 'seller_details.state_id', 'state.state_name as state_name', 'seller_details.city_id', 'city.city_name as city_name', 'seller_details.requirment_id', 'requirment.name as requirment_name', 'seller_details.categories_id', 'categories.name as main_category_name', 'seller_details.category_id', 'category.name as category_name', 'seller_details.sub_category_id', 'sub_category.name as sub_category_name', 'seller_details.price', 'seller_details.description', 'seller_details.created_at')
                            ->join('register', 'seller_details.user_id', '=', 'register.id')
                            ->join('country', 'seller_details.country_id', '=', 'country.id')
                            ->leftjoin('state', 'seller_details.state_id', '=', 'state.id')
                            ->join('city', 'seller_details.city_id', '=', 'city.id')
                            ->join('requirment', 'seller_details.requirment_id', '=', 'requirment.id')
                            ->join('categories', 'seller_details.categories_id', '=', 'categories.id')
                            ->join('category', 'seller_details.category_id', '=', 'category.id')
                            ->leftjoin('sub_category', 'seller_details.sub_category_id', '=', 'sub_category.id')
                            ->leftjoin('business', 'seller_details.user_id', '=', 'business.user_id')
                            ->leftjoin('seller_details_likes', 'seller_details.id', '=', 'seller_details_likes.seller_details_id')
                            ->withAvg(['review' => function ($query) {
                                    $query->where('type', 'seller');
                                }], 'rating')->withCount('review');
            if (isset($user_id)) {
                $query->where('seller_details.user_id', $user_id);
            } else {
                $query->where('seller_details.user_id', '=', $user->id);
            }
            $data = $query->get();

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

                $productIds = explode(',', $data->product_id ?? '');
                $products = Manufacturer::whereIn('id', $productIds)->pluck('name', 'id')->toArray();
                $data->product_names = implode(',', array_values($products));

                $productes = Manufacturer::whereIn('id', $productIds)->get(['id', 'name']);
                $what_manufacturer = $productes->map(function ($productt) {
                    return [
                        'id' => $productt->id,
                        'value' => $productt->name,
                    ];
                });
                $data->what_manufacturer = $what_manufacturer;

                $selected_role_ids = explode(',', $data->selected_role_id);
                $selected_roles_list = Role::whereIn('id', $selected_role_ids)->get(['id', 'name', 'slug']);
                $selected_roles = $selected_roles_list->map(function ($selected_roles) {
                    return [
                        'id' => $selected_roles->id,
                        'name' => $selected_roles->name,
                        'slug' => $selected_roles->slug,
                    ];
                });
                $data->selected_role = $selected_roles;

                return $data;
            });
            
            if ($data->isEmpty()) {
                return response()->json(['status' => false, 'message' => 'Details not found.'], 404);
            } else {
                return response()->json(['status' => true, 'data' => $data], 200);
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

        try {

            $data = SellerDetails::select('register.role_id', 'business.establishment_year', 'business.establishment_year', SellerDetails::raw("IF(seller_details_likes.status = 1, 1, 0) as is_likes"), 'seller_details.id', 'seller_details.address', 'seller_details.latitude', 'seller_details.longitude', 'seller_details.view_counter', 'seller_details.other_details', 'seller_details.user_id', SellerDetails::raw("
            CASE 
                WHEN register.image IS NOT NULL AND register.image != '' 
                THEN CONCAT('https://soundwale.in/public/storage/app/register/', register.image)
                ELSE CONCAT('https://soundwale.in/public/admin-asset/images/profile_default_image.png') 
            END AS user_profile_url
        "), SellerDetails::raw("
            CASE 
                WHEN categories.image IS NOT NULL AND categories.image != '' 
                THEN CONCAT('https://soundwale.in/public/storage/app/categories/', categories.image)
                ELSE CONCAT('https://soundwale.in/public/admin-asset/images/200x200.png') 
            END AS main_category_image_url
        "), 'register.name as user_name', 'register.code as user_code', 'register.mobile_number as user_mobile_number', 'seller_details.country_id', 'country.country_name as country_name', 'seller_details.state_id', 'state.state_name as state_name', 'seller_details.city_id', 'city.city_name as city_name', 'seller_details.requirment_id', 'requirment.name as requirment_name', 'seller_details.categories_id', 'categories.name as main_category_name', 'seller_details.category_id', 'category.name as category_name', 'seller_details.sub_category_id', 'sub_category.name as sub_category_name', 'seller_details.price', 'seller_details.description', 'seller_details.created_at')
                    ->join('register', 'seller_details.user_id', '=', 'register.id')
                    ->join('country', 'seller_details.country_id', '=', 'country.id')
                    ->leftjoin('state', 'seller_details.state_id', '=', 'state.id')
                    ->join('city', 'seller_details.city_id', '=', 'city.id')
                    ->join('requirment', 'seller_details.requirment_id', '=', 'requirment.id')
                    ->join('categories', 'seller_details.categories_id', '=', 'categories.id')
                    ->join('category', 'seller_details.category_id', '=', 'category.id')
                    ->leftjoin('sub_category', 'seller_details.sub_category_id', '=', 'sub_category.id')
                    ->leftjoin('business', 'seller_details.user_id', '=', 'business.user_id')
                    ->leftjoin('seller_details_likes', 'seller_details.id', '=', 'seller_details_likes.seller_details_id')
                    ->withAvg(['review' => function ($query) {
                            $query->where('type', 'seller');
                        }], 'rating')->withCount('review')
                    ->where('seller_details.id', '=', $request->id)
                    ->first();
            if (!empty($data)) {
                $roleIds = explode(',', $data->role_id);
                $roles = Role::whereIn('id', $roleIds)
                        ->get()
                        ->toArray();
                $data->roles = $roles;

                $images = SellerDetailsImages::where('seller_details_id', $data->id)
                        ->get()
                        ->toArray();
                $data->images = $images;

                $productIds = explode(',', $data->product_id ?? '');
                $products = Manufacturer::whereIn('id', $productIds)->pluck('name', 'id')->toArray();
                $data->product_names = implode(',', array_values($products));

                $productes = Manufacturer::whereIn('id', $productIds)->get(['id', 'name']);
                $what_manufacturer = $productes->map(function ($productt) {
                    return [
                        'id' => $productt->id,
                        'value' => $productt->name,
                    ];
                });
                $data->what_manufacturer = $what_manufacturer;
            }
            if (!empty($data)) {
                if (!ViewCounter::where('relation_id', $request->id)->where('user_id', $user->id)->where('type', 'seller')->exists()) {
                    ViewCounter::create(['relation_id' => $request->id, 'user_id' => $user->id, 'type' => 'seller']);
                    SellerDetails::find($request->id)->increment('view_counter');
                }
                return response()->json(['status' => true, 'data' => $data], 200);
            } else {
                return response()->json(['status' => false, 'message' => 'Details not found.'], 404);
            }
        } catch (\Throwable $th) {
            \Log::error(request()->path() . "\n" . $th->getMessage());
            return response()->json(['status' => false, 'message' => 'Oops! Something went wrong. Please try again later.'], 500);
        }
    }

    public function seller_like_unlike(Request $request) {

        $user = auth()->user();

        $validator = Validator::make($request->all(), [
                    'seller_id' => 'required',
                        ], [
                    'seller_id.required' => 'The buyer id field is required.',
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => false, 'message' => $validator->errors()], 400);
        }
        try {
            $data = $request->only('user_id', 'seller_details_id', 'status');
            $data['status'] = 1;
            $data['user_id'] = $user->id;
            $data['seller_details_id'] = $request->seller_id;

            $exists = SellerDetailsLike::where('user_id', $user->id)->where('seller_details_id', $request->seller_id)->exists();
            if ($exists) {
                $obj = SellerDetailsLike::where('user_id', $user->id)->where('seller_details_id', $request->seller_id);
                if ($obj) {
                    $delete = $obj->delete();
                }
                return response()->json([
                            'status' => true,
                            'message' => 'Like removed successfully'
                                ], 200);
            } else {
                $dataa = new SellerDetailsLike($data);
                if ($dataa->save()) {
                    return response()->json([
                                'status' => true,
                                'message' => 'Like added successfully'
                                    ], 200);
                }
            }
        } catch (\Throwable $th) {
            \Log::error(request()->path() . "\n" . $th->getMessage());
            return response()->json(['status' => false, 'message' => 'Oops! Something went wrong. Please try again later.'], 500);
        }
    }

    public function catalogue_add(Request $request) {
        $user = Auth::user();

        $validator = Validator::make($request->all(), [
                    'name' => 'required',
                    'other_details' => 'required',
                    'image' => 'required',
                        ], [
                    'name.required' => 'The title field is required.',
                    'other_details.required' => 'The other details field is required.',
                    'image.required' => 'The image field is required.',
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => false, 'message' => $validator->errors()], 400);
        }

        try {
            $data = $request->only('user_id', 'name', 'other_details', 'image', 'status');
            if ($request->hasFile('image')) {
                $data['image'] = Helper::uploadImage($request->image, Catalogue::IMAGE_PATH);
            }
            $data['status'] = 1;
            $data['user_id'] = $user->id;
            $catalogue_details = new Catalogue($data);
            if ($catalogue_details->save()) {

                return response()->json([
                            'status' => true,
                            'message' => 'Your request was sent successfully.'
                                ], 200);
            }

            return response()->json(['status' => false, 'message' => 'Oops! Something went wrong. Please try again later.'], 500);
        } catch (\Throwable $th) {
            \Log::error(request()->path() . "\n" . $th->getMessage());
            return response()->json(['status' => false, 'message' => 'Oops! Something went wrong. Please try again later.'], 500);
        }
    }

    public function catalouge_like_unlike(Request $request) {

        $user = auth()->user();

        $validator = Validator::make($request->all(), [
                    'catalogue_id' => 'required',
                        ], [
                    'catalogue_id.required' => 'The catalogue id field is required.',
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => false, 'message' => $validator->errors()], 400);
        }
        try {
            $data = $request->only('user_id', 'catalogue_id', 'status');
            $data['status'] = 1;
            $data['user_id'] = $user->id;
            $data['catalogue_id'] = $request->catalogue_id;

            $exists = CatalogueLike::where('user_id', $user->id)->where('catalogue_id', $request->catalogue_id)->exists();
            if ($exists) {
                $obj = CatalogueLike::where('user_id', $user->id)->where('catalogue_id', $request->catalogue_id);
                if ($obj) {
                    $delete = $obj->delete();
                }
                return response()->json([
                            'status' => true,
                            'message' => 'Like removed successfully'
                                ], 200);
            } else {
                $dataa = new CatalogueLike($data);
                if ($dataa->save()) {
                    return response()->json([
                                'status' => true,
                                'message' => 'Like added successfully'
                                    ], 200);
                }
            }
        } catch (\Throwable $th) {
            \Log::error(request()->path() . "\n" . $th->getMessage());
            return response()->json(['status' => false, 'message' => 'Oops! Something went wrong. Please try again later.'], 500);
        }
    }

    public function get_catalogue_userwise(Request $request) {

        $user = Auth::user();

        try {

            $perPage = (int) $request->get('limit', config('app.API_PER_PAGE'));
            $page = (int) $request->get('page', 1);
            $offset = ($page - 1) * $perPage;

            $data = Catalogue::select('catalogue.*', Catalogue::raw("IF(catalogue_likes.status = 1, 1, 0) as is_likes"))
                    ->leftjoin('catalogue_likes', 'catalogue.id', '=', 'catalogue_likes.catalogue_id')
                    ->where('catalogue.user_id', '=', $user->id)
                    ->orderBy('catalogue.id', 'desc')
                    ->get();

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
