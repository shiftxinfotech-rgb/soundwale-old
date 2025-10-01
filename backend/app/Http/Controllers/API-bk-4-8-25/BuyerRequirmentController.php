<?php

namespace App\Http\Controllers\API;

use App\Helper\Helper;
use App\Http\Controllers\Controller;
use App\Models\ContactUs;
use App\Models\Manufacturer;
use App\Models\Country;
use App\Models\States;
use App\Models\Cities;
use App\Models\BuyerRequirment;
use App\Models\BuyerRequirmentImages;
use App\Models\BuyerRequirmentLike;
use App\Models\SellerDetails;
use App\Models\SellerDetailsImages;
use App\Models\SellerDetailsLike;
use App\Models\CatalogueLike;
use App\Models\Admin;
use App\Models\MailConfiguration;
use App\Models\Register;
use App\Models\Categories;
use App\Models\Category;
use App\Models\SubCategory;
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

class BuyerRequirmentController extends Controller {

    public function lists(Request $request) {

        $user = Auth::user();

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
        $query = BuyerRequirment::select('register.role_id', 'buyer_requirment.role_id as selected_role_id', BuyerRequirment::raw("IF(buyer_requirment_likes.status = 1, 1, 0) as is_likes"), 'buyer_requirment.id', 'buyer_requirment.product_id', 'buyer_requirment.address', 'buyer_requirment.latitude', 'buyer_requirment.longitude', 'buyer_requirment.other_details', 'buyer_requirment.user_id', BuyerRequirment::raw("
            CASE 
                WHEN register.image IS NOT NULL AND register.image != '' 
                THEN CONCAT('https://soundwale.in/public/storage/app/register/', register.image)
                ELSE CONCAT('https://soundwale.in/public/admin-asset/images/profile_default_image.png') 
            END AS user_profile_url
        "), 'register.name as user_name', 'register.code as user_code', 'register.mobile_number as user_mobile_number', 'buyer_requirment.country_id', 'country.country_name as country_name', 'buyer_requirment.state_id', 'state.state_name as state_name', 'buyer_requirment.city_id', 'city.city_name as city_name', 'buyer_requirment.requirment_id', 'requirment.name as requirment_name', 'buyer_requirment.categories_id', 'categories.name as main_category_name', 'buyer_requirment.category_id', 'category.name as category_name', 'buyer_requirment.sub_category_id', 'sub_category.name as sub_category_name', 'buyer_requirment.price', 'buyer_requirment.description', 'buyer_requirment.image', 'buyer_requirment.created_at')
                ->join('register', 'buyer_requirment.user_id', '=', 'register.id')
                ->join('country', 'buyer_requirment.country_id', '=', 'country.id')
                ->leftjoin('state', 'buyer_requirment.state_id', '=', 'state.id')
                ->join('city', 'buyer_requirment.city_id', '=', 'city.id')
                ->join('requirment', 'buyer_requirment.requirment_id', '=', 'requirment.id')
                ->join('categories', 'buyer_requirment.categories_id', '=', 'categories.id')
                ->join('category', 'buyer_requirment.category_id', '=', 'category.id')
                ->leftjoin('sub_category', 'buyer_requirment.sub_category_id', '=', 'sub_category.id')
                ->leftJoin('buyer_requirment_likes', function ($join) use ($user) {
            $join->on('buyer_requirment.id', '=', 'buyer_requirment_likes.buyer_requirment_id')
            ->where('buyer_requirment_likes.user_id', '=', $user->id);
        });
//                ->leftjoin('buyer_requirment_likes', 'buyer_requirment.id', '=', 'buyer_requirment_likes.buyer_requirment_id');

        $roles_id = explode(",", $user->role_id);
        $query->where(function ($q) use ($roles_id) {
            foreach ($roles_id as $roles_idd) {
                $q->orWhereRaw("FIND_IN_SET(?, buyer_requirment.role_id) > 0", [$roles_idd]);
            }
        });

        if (isset($categories_id)) {
            $categories_id = explode(",", $categories_id);
            $query->where(function ($q) use ($categories_id) {
                foreach ($categories_id as $categories_idd) {
                    $q->orWhereRaw("FIND_IN_SET(?, buyer_requirment.categories_id) > 0", [$categories_idd]);
                }
            });
        }
        if (isset($category_id)) {
            $category_id = explode(",", $category_id);
            $query->where(function ($q) use ($category_id) {
                foreach ($category_id as $category_idd) {
                    $q->orWhereRaw("FIND_IN_SET(?, buyer_requirment.category_id) > 0", [$category_idd]);
                }
            });
        }
        if (isset($sub_category_id)) {
            $sub_category_id = explode(",", $sub_category_id);
            $query->where(function ($q) use ($sub_category_id) {
                foreach ($sub_category_id as $sub_category_idd) {
                    $q->orWhereRaw("FIND_IN_SET(?, buyer_requirment.sub_category_id) > 0", [$sub_category_idd]);
                }
                $q->orWhere('buyer_requirment.sub_category_id', 0)->orWhereNull('buyer_requirment.sub_category_id');
            });
        }
        if (isset($city_id)) {
            if ($city_id != "all") {
                $city_id = explode(",", $city_id);
                $query->where(function ($q) use ($city_id) {
                    foreach ($city_id as $city_idd) {
                        $q->orWhereRaw("FIND_IN_SET(?, buyer_requirment.city_id) > 0", [$city_idd]);
                    }
                });
            }
        }
        if (isset($requirment_id)) {
            $query->where("buyer_requirment.requirment_id", $requirment_id);
        }
        if (isset($price)) {
            $price = explode(',', $price);
            $query->whereBetween("buyer_requirment.price", $price);
        }
        $query->where(function ($q) use ($search) {
            $q->orWhere('categories.name', 'LIKE', "%{$search}%")
                    ->orWhere('category.name', 'LIKE', "%{$search}%")
                    ->orWhere('sub_category.name', 'LIKE', "%{$search}%")
                    ->orWhereExists(function ($q1) use ($search) {
                        $q1->select(DB::raw(1))
                        ->from('manufacturer')
                        ->whereRaw("FIND_IN_SET(manufacturer.id, buyer_requirment.product_id)")
                        ->where('manufacturer.name', 'like', '%' . $search . '%');
                    });
        });

        $latitude = $request->latitude;
        $longitude = $request->longitude;
        $radius = $request->radius ?? 5; // Default to 5 km if not provided
        if (!empty($latitude) && !empty($longitude)) {
            $haversine = "(6371 * acos(cos(radians(?)) * cos(radians(buyer_requirment.latitude)) * cos(radians(buyer_requirment.longitude) - radians(?)) + sin(radians(?)) * sin(radians(buyer_requirment.latitude))))";
            $query->whereRaw("$haversine <= ?", [$latitude, $longitude, $latitude, $radius]);
        }

        $data = $query->orderBy('buyer_requirment.id', 'desc')->get();


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

//        $data = BayerRequirment::select('user_id', 'country_id', 'state_id', 'city_id', 'requirment_id', 'categories_id', 'category_id', 'sub_category_id', 'price', 'description', 'image', 'status')->get();
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

    public function BuyerRequirmentSave(Request $request) {
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
//            if ($request->hasFile('image')) {
//                $data['image'] = Helper::uploadImage($request->image, BuyerRequirment::IMAGE_PATH);
//            }
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
                if ($sub_category_id == "undefined") {
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

            $leads = new BuyerRequirment($data);
            if ($leads->save()) {
                $leads_inserted_Id = $leads->id;
                $imageRecords = [];
                if ($request->hasFile('images')) {
                    foreach ($request->file('images') as $file) {

                        $path = Helper::uploadImage($file, BuyerRequirmentImages::IMAGE_PATH);
                        $imageRecords[] = [
                            'user_id' => $user->id,
                            'buyer_requirment_id' => $leads_inserted_Id,
                            'image' => $path,
                        ];
                    }
                    if (!empty($imageRecords)) {
                        BuyerRequirmentImages::insert($imageRecords);
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

            $perPage = (int) $request->get('limit', config('app.API_PER_PAGE'));
            $page = (int) $request->get('page', 1);
            $offset = ($page - 1) * $perPage;

//            $limit = $request->limit;
            $query = BuyerRequirment::select('register.role_id', BuyerRequirment::raw("IF(buyer_requirment_likes.status = 1, 1, 0) as is_likes"), 'buyer_requirment.id', 'buyer_requirment.address', 'buyer_requirment.latitude', 'buyer_requirment.longitude', 'buyer_requirment.other_details', 'buyer_requirment.user_id', BuyerRequirment::raw("
            CASE 
                WHEN register.image IS NOT NULL AND register.image != '' 
                THEN CONCAT('https://soundwale.in/public/storage/app/register/', register.image)
                ELSE CONCAT('https://soundwale.in/public/admin-asset/images/profile_default_image.png') 
            END AS user_profile_url
        "), 'register.name as user_name', 'register.code as user_code', 'register.mobile_number as user_mobile_number', 'buyer_requirment.country_id', 'country.country_name as country_name', 'buyer_requirment.state_id', 'state.state_name as state_name', 'buyer_requirment.city_id', 'city.city_name as city_name', 'buyer_requirment.requirment_id', 'requirment.name as requirment_name', 'buyer_requirment.categories_id', 'categories.name as main_category_name', 'buyer_requirment.category_id', 'category.name as category_name', 'buyer_requirment.sub_category_id', 'sub_category.name as sub_category_name', 'buyer_requirment.price', 'buyer_requirment.description', 'buyer_requirment.image', 'buyer_requirment.created_at')
                    ->join('register', 'buyer_requirment.user_id', '=', 'register.id')
                    ->join('country', 'buyer_requirment.country_id', '=', 'country.id')
                    ->leftjoin('state', 'buyer_requirment.state_id', '=', 'state.id')
                    ->join('city', 'buyer_requirment.city_id', '=', 'city.id')
                    ->join('requirment', 'buyer_requirment.requirment_id', '=', 'requirment.id')
                    ->join('categories', 'buyer_requirment.categories_id', '=', 'categories.id')
                    ->join('category', 'buyer_requirment.category_id', '=', 'category.id')
                    ->leftjoin('sub_category', 'buyer_requirment.sub_category_id', '=', 'sub_category.id')
                    ->leftjoin('buyer_requirment_likes', 'buyer_requirment.id', '=', 'buyer_requirment_likes.buyer_requirment_id')
                    ->where('buyer_requirment.categories_id', $request->categories_id)
                    ->where('buyer_requirment.id', '!=', $request->id);
            $data = $query->get();
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
            if ($data->isEmpty()) {
                return response()->json(['status' => false, 'message' => 'Details not found.'], 404);
            } else {

                $total = $data->count();
                $data = $data->slice($offset, $perPage)->values();

                if ($data->isEmpty()) {
                    return response()->json(['status' => false, 'message' => 'Details not found.'], 404);
                }

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
		$user = Auth::user();

        $validator = Validator::make($request->all(), [
                    'id' => 'required',
                        ], [
                    'id.required' => 'The user id field is required.',
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => false, 'message' => $validator->errors()], 400);
        }

        try {

            $data = BuyerRequirment::select('register.role_id', BuyerRequirment::raw("IF(buyer_requirment_likes.status = 1, 1, 0) as is_likes"), 'buyer_requirment.id', 'buyer_requirment.product_id', 'buyer_requirment.address', 'buyer_requirment.latitude', 'buyer_requirment.longitude', 'buyer_requirment.user_id', 'buyer_requirment.other_details', BuyerRequirment::raw("
            CASE 
                WHEN register.image IS NOT NULL AND register.image != '' 
                THEN CONCAT('https://soundwale.in/public/storage/app/register/', register.image)
                ELSE CONCAT('https://soundwale.in/public/admin-asset/images/profile_default_image.png') 
            END AS user_profile_url
        "), BuyerRequirment::raw("
            CASE 
                WHEN categories.image IS NOT NULL AND categories.image != '' 
                THEN CONCAT('https://soundwale.in/public/storage/app/categories/', categories.image)
                ELSE CONCAT('https://soundwale.in/public/admin-asset/images/company_default.jpg') 
            END AS main_category_image_url
        "), 'register.name as user_name', 'register.code as user_code', 'register.mobile_number as user_mobile_number', 'buyer_requirment.country_id', 'country.country_name as country_name', 'buyer_requirment.state_id', 'state.state_name as state_name', 'buyer_requirment.city_id', 'city.city_name as city_name', 'buyer_requirment.requirment_id', 'requirment.name as requirment_name', 'buyer_requirment.categories_id', 'categories.name as main_category_name', 'buyer_requirment.category_id', 'category.name as category_name', 'buyer_requirment.sub_category_id', 'sub_category.name as sub_category_name', 'buyer_requirment.price', 'buyer_requirment.description', 'buyer_requirment.image', 'buyer_requirment.created_at')
                    ->join('register', 'buyer_requirment.user_id', '=', 'register.id')
                    ->join('country', 'buyer_requirment.country_id', '=', 'country.id')
                    ->leftjoin('state', 'buyer_requirment.state_id', '=', 'state.id')
                    ->join('city', 'buyer_requirment.city_id', '=', 'city.id')
                    ->join('requirment', 'buyer_requirment.requirment_id', '=', 'requirment.id')
                    ->join('categories', 'buyer_requirment.categories_id', '=', 'categories.id')
                    ->join('category', 'buyer_requirment.category_id', '=', 'category.id')
                    ->leftjoin('sub_category', 'buyer_requirment.sub_category_id', '=', 'sub_category.id')
                    ->leftJoin('buyer_requirment_likes', function ($join) use ($user) {
                        $join->on('buyer_requirment.id', '=', 'buyer_requirment_likes.buyer_requirment_id')
                        ->where('buyer_requirment_likes.user_id', '=', $user->id);
                    })
                    ->where('buyer_requirment.id', '=', $request->id)
                    ->first();

            if (!empty($data)) {
                $roleIds = explode(',', $data->role_id);
                $roles = Role::whereIn('id', $roleIds)
                        ->get()
                        ->toArray();
                $data->roles = $roles;

                $images = BuyerRequirmentImages::where('buyer_requirment_id', $data->id)
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
                return response()->json(['status' => true, 'data' => $data], 200);
            } else {
                return response()->json(['status' => false, 'message' => 'Details not found.'], 404);
            }
        } catch (\Throwable $th) {
            \Log::error(request()->path() . "\n" . $th->getMessage());
            return response()->json(['status' => false, 'message' => 'Oops! Something went wrong. Please try again later.'], 500);
        }
    }

    public function buyer_like_unlike(Request $request) {

        $user = auth()->user();

        $validator = Validator::make($request->all(), [
                    'buyer_id' => 'required',
                        ], [
                    'buyer_id.required' => 'The buyer id field is required.',
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => false, 'message' => $validator->errors()], 400);
        }
        try {
            $data = $request->only('user_id', 'buyer_requirment_id', 'status');
            $data['status'] = 1;
            $data['user_id'] = $user->id;
            $data['buyer_requirment_id'] = $request->buyer_id;

            $exists = BuyerRequirmentLike::where('user_id', $user->id)->where('buyer_requirment_id', $request->buyer_id)->exists();
            if ($exists) {
                $obj = BuyerRequirmentLike::where('user_id', $user->id)->where('buyer_requirment_id', $request->buyer_id);
                if ($obj) {
                    $delete = $obj->delete();
                }
                return response()->json([
                            'status' => true,
                            'message' => 'Like removed successfully'
                                ], 200);
            } else {
                $dataa = new BuyerRequirmentLike($data);
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

    public function requirment_post_by_user_id_post(Request $request) {
        $user = auth()->user();

        try {
            $limit = $request->limit;
            $user_id = $request->user_id;
            $query = BuyerRequirment::select('register.role_id', 'buyer_requirment.role_id as selected_role_id', BuyerRequirment::raw("IF(buyer_requirment_likes.status = 1, 1, 0) as is_likes"), 'buyer_requirment.id', 'buyer_requirment.product_id', 'buyer_requirment.address', 'buyer_requirment.latitude', 'buyer_requirment.longitude', 'buyer_requirment.product_id', 'buyer_requirment.role_id as roles_id', 'buyer_requirment.other_details', 'buyer_requirment.user_id', BuyerRequirment::raw("
            CASE 
                WHEN register.image IS NOT NULL AND register.image != '' 
                THEN CONCAT('https://soundwale.in/public/storage/app/register/', register.image)
                ELSE CONCAT('https://soundwale.in/public/admin-asset/images/profile_default_image.png') 
            END AS user_profile_url
        "), 'register.name as user_name', 'register.code as user_code', 'register.mobile_number as user_mobile_number', 'buyer_requirment.country_id', 'country.country_name as country_name', 'buyer_requirment.state_id', 'state.state_name as state_name', 'buyer_requirment.city_id', 'city.city_name as city_name', 'buyer_requirment.requirment_id', 'requirment.name as requirment_name', 'buyer_requirment.categories_id', 'categories.name as main_category_name', 'buyer_requirment.category_id', 'category.name as category_name', 'buyer_requirment.sub_category_id', 'sub_category.name as sub_category_name', 'buyer_requirment.price', 'buyer_requirment.description', 'buyer_requirment.image', 'buyer_requirment.created_at')
                    ->join('register', 'buyer_requirment.user_id', '=', 'register.id')
                    ->join('country', 'buyer_requirment.country_id', '=', 'country.id')
                    ->leftjoin('state', 'buyer_requirment.state_id', '=', 'state.id')
                    ->join('city', 'buyer_requirment.city_id', '=', 'city.id')
                    ->join('requirment', 'buyer_requirment.requirment_id', '=', 'requirment.id')
                    ->join('categories', 'buyer_requirment.categories_id', '=', 'categories.id')
                    ->join('category', 'buyer_requirment.category_id', '=', 'category.id')
                    ->leftjoin('sub_category', 'buyer_requirment.sub_category_id', '=', 'sub_category.id')
                    ->leftjoin('buyer_requirment_likes', 'buyer_requirment.id', '=', 'buyer_requirment_likes.buyer_requirment_id');
            if (isset($user_id)) {
                $query->where('buyer_requirment.user_id', '=', $user_id);
            } else {
                $query->where('buyer_requirment.user_id', '=', $user->id);
            }
            if (isset($limit)) {
                $data = $query->limit($limit)->get();
            } else {
                $data = $query->get();
            }
            if (!empty($data)) {
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
            }


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

    public function PostUpdate(Request $request) {
        $user = Auth::user();

        $validator = Validator::make($request->all(), [
                    'id' => 'required',
                    'role_id' => 'required',
                    'type' => 'required',
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
                    'id.required' => 'The id field is required.',
                    'role_id.required' => 'The role field is required.',
                    'type.required' => 'The type field is required.',
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

            if ($request->type == "buyer") {
                $exist_buyer = BuyerRequirment::find($request->id);
                if ($exist_buyer) {
                    $data = $request->only('role_id', 'address', 'product_id', 'latitude', 'longitude', 'country_id', 'other_details', 'state_id', 'city_id', 'requirment_id', 'categories_id', 'category_id', 'sub_category_id', 'price', 'description', 'image', 'status');
                    $categories_id = $request->categories_id;
                    if (isset($categories_id)) {
                        if (is_numeric($categories_id)) {
                            $categories_id = $categories_id;
                        } else {
                            $company = Categories::firstOrCreate([
                                        'name' => $categories_id,
                                        'user_id' => $exist_buyer->user_id,
                                        'status' => 0,
                            ]);
                            $categories_id = $company->id;
                        }
                    }
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

                    $sub_category_id = $request->sub_category_id;
                    if (isset($sub_category_id)) {
                        if ($sub_category_id == "undefined" || $sub_category_id == null || $sub_category_id == 0) {
                            $sub_category_id = 0;
                        } else if (is_numeric($sub_category_id)) {
                            $sub_category_id = $sub_category_id;
                        } else {
                            $sub_category_data = SubCategory::firstOrCreate([
                                        'name' => $sub_category_id,
                                        'user_id' => $user->id,
                                        'status' => 0,
                            ]);
                            $sub_category_id = $sub_category_data->id;
                        }
                    }
					
					$product_id = "";
                    $product_id_info = json_decode($request->product_id, true);
                    $product_id_info_new = array();
                    if ($request->product_id != "" && $request->product_id != "[]") {
                        
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
                        $product_id = implode(',', $product_id_info_new);
                    }

                    BuyerRequirment::where('id', $request->id)->update([
                        'role_id' => $request->role_id,
                        'country_id' => $request->country_id,
                        'other_details' => $request->other_details,
                        'state_id' => $request->state_id,
                        'city_id' => $request->city_id,
                        'requirment_id' => $request->requirment_id,
                        'categories_id' => $categories_id,
                        'category_id' => $category_id,
                        'sub_category_id' => $sub_category_id,
                        'product_id' => $product_id,
                        'price' => $request->price,
                        'description' => $request->description,
                        'address' => isset($request->address) ? $request->address : '',
                        'latitude' => isset($request->latitude) ? $request->latitude : '',
                        'longitude' => isset($request->longitude) ? $request->longitude : '',
                    ]);
                    $leads_inserted_Id = $request->id;
                    $imageRecords = [];
                    if ($request->hasFile('images')) {
                        foreach ($request->file('images') as $file) {
                            $path = Helper::uploadImage($file, BuyerRequirmentImages::IMAGE_PATH);
                            $imageRecords[] = [
                                'user_id' => $exist_buyer->user_id,
                                'buyer_requirment_id' => $leads_inserted_Id,
                                'image' => $path,
                            ];
                        }
                        if (!empty($imageRecords)) {
                            BuyerRequirmentImages::insert($imageRecords);
                        }
                    }

                    return response()->json([
                                'status' => true,
                                'message' => 'Your request was updated successfully.'
                                    ], 200);
                } else {
                    return response()->json(['status' => false, 'message' => 'ID does not exist'], 404);
                }
            } else if ($request->type == "seller") {
                $exist_seller = SellerDetails::find($request->id);
                if ($exist_seller) {
                    $data = $request->only('role_id', 'address', 'product_id', 'latitude', 'longitude', 'country_id', 'other_details', 'state_id', 'city_id', 'requirment_id', 'categories_id', 'category_id', 'sub_category_id', 'price', 'description', 'image', 'status');
                    $categories_id = $request->categories_id;
                    if (isset($categories_id)) {
                        if (is_numeric($categories_id)) {
                            $categories_id = $categories_id;
                        } else {
                            $company = Categories::firstOrCreate([
                                        'name' => $categories_id,
                                        'user_id' => $exist_seller->user_id,
                                        'status' => 0,
                            ]);
                            $categories_id = $company->id;
                        }
                    }

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

                    $sub_category_id = $request->sub_category_id;
                    if (isset($sub_category_id)) {
                        if ($sub_category_id == "undefined" || $sub_category_id == null || $sub_category_id == 0) {
                            $sub_category_id = 0;
                        } else if (is_numeric($sub_category_id)) {
                            $sub_category_id = $sub_category_id;
                        } else {
                            $sub_category_data = SubCategory::firstOrCreate([
                                        'name' => $sub_category_id,
                                        'user_id' => $user->id,
                                        'status' => 0,
                            ]);
                            $sub_category_id = $sub_category_data->id;
                        }
                    }

					$product_id = "";
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
                        $product_id = implode(',', $product_id_info_new);
                    }

                    SellerDetails::where('id', $request->id)->update([
                        'role_id' => $request->role_id,
                        'country_id' => $request->country_id,
                        'other_details' => $request->other_details,
                        'state_id' => $request->state_id,
                        'city_id' => $request->city_id,
                        'requirment_id' => $request->requirment_id,
                        'categories_id' => $categories_id,
                        'category_id' => $category_id,
                        'sub_category_id' => $sub_category_id,
                        'product_id' => $product_id,
                        'price' => $request->price,
                        'description' => $request->description,
                        'address' => isset($request->address) ? $request->address : '',
                        'latitude' => isset($request->latitude) ? $request->latitude : '',
                        'longitude' => isset($request->longitude) ? $request->longitude : '',
                    ]);
                    $leads_inserted_Id = $request->id;
                    $imageRecords = [];
                    if ($request->hasFile('images')) {
                        foreach ($request->file('images') as $file) {
                            $path = Helper::uploadImage($file, SellerDetailsImages::IMAGE_PATH);
                            $imageRecords[] = [
                                'user_id' => $exist_seller->user_id,
                                'seller_details_id' => $leads_inserted_Id,
                                'image' => $path,
                            ];
                        }
                        if (!empty($imageRecords)) {
                            SellerDetailsImages::insert($imageRecords);
                        }
                    }

                    return response()->json([
                                'status' => true,
                                'message' => 'Your request was updated successfully.'
                                    ], 200);
                } else {
                    return response()->json(['status' => false, 'message' => 'ID does not exist'], 404);
                }
            } else {
                return response()->json(['status' => false, 'message' => 'Invalid type'], 404);
            }

            return response()->json(['status' => false, 'message' => 'Oops! Something went wrong. Please try again later.'], 500);
        } catch (\Throwable $th) {
            \Log::error(request()->path() . "\n" . $th->getMessage());
            return response()->json(['status' => false, 'message' => 'Oops! Something went wrong. Please try again later.'], 500);
        }
    }

    public function PostDelete(Request $request) {
        $user = Auth::user();

        $validator = Validator::make($request->all(), [
                    'id' => 'required',
                    'type' => 'required',
                        ], [
                    'id.required' => 'The id field is required.',
                    'type.required' => 'The type field is required.',
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => false, 'message' => $validator->errors()], 400);
        }

        try {

            if ($request->type == "buyer") {
                $exist_buyer = BuyerRequirment::find($request->id);
                if ($exist_buyer) {
                    $exist_buyer->delete();
                    BuyerRequirmentImages::where('buyer_requirment_id', $request->id)->delete();
                    return response()->json([
                                'status' => true,
                                'message' => 'Deleted successfully'
                                    ], 200);
                } else {
                    return response()->json(['status' => false, 'message' => 'ID does not exist'], 404);
                }
            } else if ($request->type == "seller") {
                $exist_seller = SellerDetails::find($request->id);
                if ($exist_seller) {
                    $exist_seller->delete();
                    SellerDetailsImages::where('seller_details_id', $request->id)->delete();
                    return response()->json([
                                'status' => true,
                                'message' => 'Deleted successfully'
                                    ], 200);
                } else {
                    return response()->json(['status' => false, 'message' => 'ID does not exist'], 404);
                }
            } else {
                return response()->json(['status' => false, 'message' => 'Invalid type'], 404);
            }

            return response()->json(['status' => false, 'message' => 'Oops! Something went wrong. Please try again later.'], 500);
        } catch (\Throwable $th) {
            \Log::error(request()->path() . "\n" . $th->getMessage());
            return response()->json(['status' => false, 'message' => 'Oops! Something went wrong. Please try again later.'], 500);
        }
    }

    public function PostImageDelete(Request $request) {
        $user = Auth::user();

        $validator = Validator::make($request->all(), [
                    'id' => 'required',
                    'type' => 'required',
                        ], [
                    'id.required' => 'The id field is required.',
                    'type.required' => 'The type field is required.',
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => false, 'message' => $validator->errors()], 400);
        }

        try {

            if ($request->type == "buyer") {
                $exist_buyer = BuyerRequirmentImages::find($request->id);
                if ($exist_buyer) {
                    $exist_buyer->delete();
                    return response()->json([
                                'status' => true,
                                'message' => 'Deleted successfully'
                                    ], 200);
                } else {
                    return response()->json(['status' => false, 'message' => 'ID does not exist'], 404);
                }
            } else if ($request->type == "seller") {
                $exist_seller = SellerDetailsImages::find($request->id);
                if ($exist_seller) {
                    $exist_seller->delete();
                    return response()->json([
                                'status' => true,
                                'message' => 'Deleted successfully'
                                    ], 200);
                } else {
                    return response()->json(['status' => false, 'message' => 'ID does not exist'], 404);
                }
            } else {
                return response()->json(['status' => false, 'message' => 'Invalid type'], 404);
            }

            return response()->json(['status' => false, 'message' => 'Oops! Something went wrong. Please try again later.'], 500);
        } catch (\Throwable $th) {
            \Log::error(request()->path() . "\n" . $th->getMessage());
            return response()->json(['status' => false, 'message' => 'Oops! Something went wrong. Please try again later.'], 500);
        }
    }

}
