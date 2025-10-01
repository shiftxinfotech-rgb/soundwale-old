<?php

namespace App\Http\Controllers\API\Auth;

use App\Helper\Helper;
use App\Http\Controllers\Controller;
use App\Models\Admin;
use App\Models\Register;
use App\Models\Role;
use App\Models\Categories;
use App\Models\Category;
use App\Models\SubCategory;
use App\Models\Models;
use App\Models\Parts;
use App\Models\BusinessCompany;
use App\Models\BusinessVideo;
use App\Models\Catalogue;
use App\Models\UserVideo;
use App\Models\SellerDetails;
use App\Models\SellerDetailsLike;
use App\Models\Business;
use App\Models\BusinessImages;
use App\Models\Review;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Mail;
use App\Mail\RegisterMail;
use App\Mail\RegisterMailAdmin;
use Illuminate\Support\Facades\Config;
use App\Models\MailConfiguration;
use Illuminate\Validation\Rule;

class RegisterController extends Controller {

    public function register(Request $request) {
        $validator = Validator::make($request->all(), [
                    'name' => 'required',
                    'role_id' => 'required',
                    'mobile_number' => 'required|string|max:15|unique:register,mobile_number',
                    'country_id' => 'required',
                    'state_id' => 'required',
                    'city_id' => 'required',
                    'village' => 'required',
                    'address' => 'required',
                    'latitude' => 'required',
                    'longitude' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => false, 'message' => $validator->errors()], 400);
        }

        $new_company = $request->new_company;
        $companyId = NULL;
        if (isset($new_company)) {
            if (is_numeric($new_company)) {
                $companyId = $new_company;
            } else {
                $company = Categories::firstOrCreate([
                            'name' => $new_company,
                            'status' => 0,
                ]);
                $companyId = $company->id;
            }
        }
        $image = "";
        if ($request->hasFile('image')) {
            $image = Helper::uploadImage($request->image, Register::IMAGE_PATH);
        }
        $visiting_card_image = "";
        if ($request->hasFile('visiting_card_image')) {
            $visiting_card_image = Helper::uploadImage($request->visiting_card_image, Register::IMAGE_PATH);
        }
        $dealer_list_area_wise_pdf = "";
        if ($request->hasFile('dealer_list_area_wise_pdf')) {
            $dealer_list_area_wise_pdf = Helper::uploadImage($request->dealer_list_area_wise_pdf, Register::IMAGE_PATH);
        }
        $catalogue_pdf = "";
        if ($request->hasFile('catalogue_pdf')) {
            $catalogue_pdf = Helper::uploadImage($request->catalogue_pdf, Register::IMAGE_PATH);
        }
        $description_pdf = "";
        if ($request->hasFile('description_pdf')) {
            $description_pdf = Helper::uploadImage($request->description_pdf, Register::IMAGE_PATH);
        }

        $user = Register::create([
                    'name' => isset($request->name) ? $request->name : '',
                    'personal_name' => isset($request->personal_name) ? $request->personal_name : '',
                    'nick_name' => isset($request->nick_name) ? $request->nick_name : '',
                    'gender' => isset($request->gender) ? $request->gender : '',
                    'email' => isset($request->email) ? $request->email : '',
                    'role_id' => isset($request->role_id) ? $request->role_id : '',
                    'sound_farm_name' => isset($request->sound_farm_name) ? $request->sound_farm_name : '',
                    'mobile_number' => isset($request->mobile_number) ? $request->mobile_number : '',
                    'code_sort' => isset($request->code_sort) ? $request->code_sort : '',
                    'code' => isset($request->code) ? $request->code : '',
                    'extra_mobile_number' => isset($request->extra_mobile_number) ? $request->extra_mobile_number : '',
                    'categories_id' => isset($companyId) ? $companyId : NULL,
                    'dealer_list_area_wise_type' => isset($request->dealer_list_area_wise_type) ? $request->dealer_list_area_wise_type : '',
                    'dealer_list_area_wise_website' => isset($request->dealer_list_area_wise_website) ? $request->dealer_list_area_wise_website : '',
                    'dealer_list_area_wise_pdf' => isset($dealer_list_area_wise_pdf) ? $dealer_list_area_wise_pdf : '',
                    'description_pdf' => isset($description_pdf) ? $description_pdf : '',
                    'catalogue_type' => isset($request->catalogue_type) ? $request->catalogue_type : '',
                    'catalogue_website' => isset($request->catalogue_website) ? $request->catalogue_website : '',
                    'catalogue_pdf' => isset($catalogue_pdf) ? $catalogue_pdf : '',
                    'service_center' => isset($request->service_center) ? $request->service_center : '',
                    'youtube_link' => isset($request->youtube_link) ? $request->youtube_link : '',
                    'working_with' => isset($request->working_with) ? $request->working_with : '',
                    'your_best_engineer' => isset($request->your_best_engineer) ? $request->your_best_engineer : '',
                    'coaching_class' => isset($request->coaching_class) ? $request->coaching_class : '',
                    'taluka' => isset($request->taluka) ? $request->taluka : '',
                    'district' => isset($request->district) ? $request->district : '',
                    'country_id' => isset($request->country_id) ? $request->country_id : '',
                    'state_id' => isset($request->state_id) ? $request->state_id : '',
                    'city_id' => isset($request->city_id) ? $request->city_id : '',
                    'village' => isset($request->village) ? $request->village : '',
                    'location' => isset($request->location) ? $request->location : '',
                    'address' => isset($request->address) ? $request->address : '',
                    'latitude' => isset($request->latitude) ? $request->latitude : '',
                    'longitude' => isset($request->longitude) ? $request->longitude : '',
                    'facebook_link' => isset($request->facebook_link) ? $request->facebook_link : '',
                    'instagram_link' => isset($request->instagram_link) ? $request->instagram_link : '',
                    'web_link' => isset($request->web_link) ? $request->web_link : '',
                    'image' => isset($image) ? $image : '',
                    'visiting_card_image' => isset($visiting_card_image) ? $visiting_card_image : '',
                    'fcm_token' => isset($request->fcm_token) ? $request->fcm_token : '',
                    'description' => isset($request->description) ? $request->description : '',
                    'status' => 1
        ]);

        $service_centre_info = json_decode($request->service_center_info, true);
        $service_centre_info_new = array();
        if ($request->service_center_info != "" && $request->service_center_info != "[]") {
            foreach ($service_centre_info as &$service_centre_info_row) {
                $ids = explode(',', $service_centre_info_row['company_id']); // split the ID string
                $company_name_explode = explode(',', $service_centre_info_row['company_name']);
                foreach ($ids as $keys => &$id) {
                    if (trim($id) === "0") {
                        $company = Categories::firstOrCreate([
                                    'name' => $company_name_explode[$keys],
                                    'user_id' => $user->id,
                                    'status' => 0,
                        ]);
                        $id = $company->id;
                    }
                }
                $service_centre_info_row['company_id'] = implode(',', $ids); // Rebuild the string
            }
            $service_centre_info1 = json_encode($service_centre_info);
            $user->update([
                'service_center_info' => isset($service_centre_info1) ? $service_centre_info1 : '',
            ]);
        }

        if ($user->role_id == "3") {   // Manufacturing
            $category_id_info = json_decode($request->category_id, true);
            $category_id_info_new = array();
            if ($request->category_id != "" && $request->category_id != "[]") {
                $category_id = "";
                foreach ($category_id_info as $category_id_info_row) {
                    if ($category_id_info_row['category_id'] == "") {
                        $category_data = Category::firstOrCreate([
                                    'name' => $category_id_info_row['category_name'],
                                    'user_id' => $user->id,
                                    'status' => 0,
                        ]);
                        $category_id = (int) $category_data->id;
                    } else {
                        $category_id = (int) $category_id_info_row['category_id'];
                    }
                    $category_id_info_new[] = $category_id;
                }
                $category_idd = implode(',', $category_id_info_new);
            }

            $sub_category_id_info = json_decode($request->sub_category_id, true);
            $sub_category_id_info_new = array();
            if ($request->sub_category_id != "" && $request->sub_category_id != "[]") {
                $sub_category_id = "";
                foreach ($sub_category_id_info as $sub_category_id_info_row) {
                    if ($sub_category_id_info_row['sub_category_id'] == "") {
                        $sub_category_data = SubCategory::firstOrCreate([
                                    'name' => $sub_category_id_info_row['sub_category_name'],
                                    'user_id' => $user->id,
                                    'status' => 0,
                        ]);
                        $sub_category_id = (int) $sub_category_data->id;
                    } else {
                        $sub_category_id = (int) $sub_category_id_info_row['sub_category_id'];
                    }
                    $sub_category_id_info_new[] = $sub_category_id;
                }
                $sub_category_idd = implode(',', $sub_category_id_info_new);
            }

            $user->update([
                'category_id' => isset($category_idd) ? $category_idd : '',
                'sub_category_id' => isset($sub_category_idd) ? $sub_category_idd : '',
            ]);
            $business_data = Business::firstOrCreate([
                        'user_id' => $user->id,
                        'category_id' => isset($category_idd) ? $category_idd : '',
                        'sub_category_id' => isset($sub_category_idd) ? $sub_category_idd : '',
                        'status' => 1,
            ]);
        }

        if (isset($new_company)) {
            if (is_numeric($new_company)) {
                
            } else {
                Categories::where('id', $companyId)->update([
                    'user_id' => $user->id,
                ]);
            }
        }



        $user = Register::select('register.*', 'country.country_name as country_name', 'state.state_name as state_name', 'city.city_name as city_name', 'categories.name as main_category_name')
                ->leftjoin('categories', 'register.categories_id', '=', 'categories.id')
                ->join('country', 'register.country_id', '=', 'country.id')
                ->join('state', 'register.state_id', '=', 'state.id')
                ->join('city', 'register.city_id', '=', 'city.id')
                ->where('code', $request->code)
                ->where('mobile_number', $request->mobile_number);
        $user = $user->first();
        $role_data = array();
        $catalogue_data = array();
        $shorts_data = array();
        $seller_data = array();
        if (isset($user)) {
            $role_data = Role::select('*')->whereIn('id', explode(',', $user->role_id))->get();
            $catalogue_data = Catalogue::select('*')->where('user_id', $user->id)->get();
            $shorts_data = UserVideo::select('*')->where('user_id', $user->id)->get();
            $seller_data = SellerDetails::select(SellerDetails::raw("IF(seller_details_likes.status = 1, 1, 0) as is_likes"), 'seller_details.id', 'seller_details.other_details', 'seller_details.user_id', 'register.name as user_name', 'seller_details.country_id', 'country.country_name as country_name', 'seller_details.state_id', 'state.state_name as state_name', 'seller_details.city_id', 'city.city_name as city_name', 'seller_details.requirment_id', 'requirment.name as requirment_name', 'seller_details.categories_id', 'categories.name as main_category_name', 'seller_details.category_id', 'category.name as category_name', 'seller_details.sub_category_id', 'sub_category.name as sub_category_name', 'seller_details.price', 'seller_details.description', 'seller_details.created_at')
                    ->join('register', 'seller_details.user_id', '=', 'register.id')
                    ->join('country', 'seller_details.country_id', '=', 'country.id')
                    ->join('state', 'seller_details.state_id', '=', 'state.id')
                    ->join('city', 'seller_details.city_id', '=', 'city.id')
                    ->join('requirment', 'seller_details.requirment_id', '=', 'requirment.id')
                    ->join('categories', 'seller_details.categories_id', '=', 'categories.id')
                    ->join('category', 'seller_details.category_id', '=', 'category.id')
                    ->join('sub_category', 'seller_details.sub_category_id', '=', 'sub_category.id')
                    ->leftjoin('seller_details_likes', 'seller_details.id', '=', 'seller_details_likes.seller_details_id')
                    ->withAvg(['review' => function ($query) {
                            $query->where('type', 'seller');
                        }], 'rating')->withCount('review')
                    ->where('seller_details.user_id', $user->id)
                    ->get();

            //        Notification Code Start
            $notification_title = "Welcome to Soundwale!";
            $notification_body = "Congratulations, $user->name Your account has been successfully created. Explore and enjoy our services!";
            $notification_type = "welcome_register";
            $notification_modules_type = "register";
            $notification_relation_id = $user->id;
            $notification_user_id = $user->id;
            $notification_token_user_id = $user->id;
            Helper::notifyToUser(
                    $notification_title, $notification_body, $notification_type, $notification_modules_type, $notification_relation_id, $notification_user_id, $notification_token_user_id
            );
            //        Notification Code End
        }
        $user['roles'] = $role_data;
        $user['catalogue_data'] = $catalogue_data;
        $user['shorts_data'] = $shorts_data;
        $user['seller_data'] = $seller_data;

//        $user = Register::where('code', $request->code)->where('mobile_number', $request->mobile_number)->select('*')->first();
        // Invalidate existing tokens
        $user->tokens()->delete();
        // Generate a new token
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json(['message' => 'Registered successfully', 'status' => true, 'token' => $token, 'user' => $user], 200);
    }

    public function update_profile(Request $request) {
        $user = auth()->user();
        $validator = Validator::make($request->all(), [
                    'id' => 'required',
                    'name' => 'required',
                    'role_id' => 'required',
                    'mobile_number' => ['required', Rule::unique('register', 'mobile_number')->ignore($user->id)],
                    'country_id' => 'required',
                    'state_id' => 'required',
                    'city_id' => 'required',
                    'village' => 'required',
                    'address' => 'required',
                    'latitude' => 'required',
                    'longitude' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => false, 'message' => $validator->errors()], 400);
        }

        $new_company = $request->new_company;
        $companyId = NULL;
        if (isset($new_company)) {
            if (is_numeric($new_company)) {
                $companyId = $new_company;
            } else {
                $company = Categories::firstOrCreate([
                            'name' => $new_company,
                            'status' => 0,
                ]);
                $companyId = $company->id;
            }
        }
        $image = "";
        if ($request->hasFile('image')) {
            $user->image = Helper::uploadImage($request->image, Register::IMAGE_PATH);
        }
        $visiting_card_image = "";
        if ($request->hasFile('visiting_card_image')) {

            $user->visiting_card_image = Helper::uploadImage($request->visiting_card_image, Register::IMAGE_PATH);
        }
        $dealer_list_area_wise_pdf = "";
        if ($request->hasFile('dealer_list_area_wise_pdf')) {
            $user->dealer_list_area_wise_pdf = Helper::uploadImage($request->dealer_list_area_wise_pdf, Register::IMAGE_PATH);
        }
        $catalogue_pdf = "";
        if ($request->hasFile('catalogue_pdf')) {
            $user->catalogue_pdf = Helper::uploadImage($request->catalogue_pdf, Register::IMAGE_PATH);
        }
        $description_pdf = "";
        if ($request->hasFile('description_pdf')) {
            $user->description_pdf = Helper::uploadImage($request->description_pdf, Register::IMAGE_PATH);
        }

        $category_id_info = json_decode($request->category_id, true);
        $category_id_info_new = array();
        if ($request->category_id != "" && $request->category_id != "[]") {
            $category_id = "";
            foreach ($category_id_info as $category_id_info_row) {
                if ($category_id_info_row['category_id'] == "") {
                    $category_data = Category::firstOrCreate([
                                'name' => $category_id_info_row['category_name'],
                                'user_id' => $user->id,
                                'status' => 0,
                    ]);
                    $category_id = (int) $category_data->id;
                } else {
                    $category_id = (int) $category_id_info_row['category_id'];
                }
                $category_id_info_new[] = $category_id;
            }
            $user->category_id = implode(',', $category_id_info_new);
            $category_idd = implode(',', $category_id_info_new);
        }

        $sub_category_id_info = json_decode($request->sub_category_id, true);
        $sub_category_id_info_new = array();
        if ($request->sub_category_id != "" && $request->sub_category_id != "[]") {
            $sub_category_id = "";
            foreach ($sub_category_id_info as $sub_category_id_info_row) {
                if ($sub_category_id_info_row['sub_category_id'] == "") {
                    $sub_category_data = SubCategory::firstOrCreate([
                                'name' => $sub_category_id_info_row['sub_category_name'],
                                'user_id' => $user->id,
                                'status' => 0,
                    ]);
                    $sub_category_id = (int) $sub_category_data->id;
                } else {
                    $sub_category_id = (int) $sub_category_id_info_row['sub_category_id'];
                }
                $sub_category_id_info_new[] = $sub_category_id;
            }
            $user->sub_category_id = implode(',', $sub_category_id_info_new);
            $sub_category_idd = implode(',', $sub_category_id_info_new);
        }

        $service_centre_info = json_decode($request->service_center_info, true);
        $service_centre_info_new = array();
        if ($request->service_center_info != "" && $request->service_center_info != "[]") {
            foreach ($service_centre_info as &$service_centre_info_row) {
                $ids = explode(',', $service_centre_info_row['company_id']); // split the ID string
                $company_name_explode = explode(',', $service_centre_info_row['company_name']);
                foreach ($ids as $keys => &$id) {
                    if (trim($id) === "0") {
                        $company = Categories::firstOrCreate([
                                    'name' => $company_name_explode[$keys],
                                    'user_id' => $user->id,
                                    'status' => 0,
                        ]);
                        $id = $company->id;
                    }
                }
                $service_centre_info_row['company_id'] = implode(',', $ids); // Rebuild the string
            }
            $user->service_center_info = json_encode($service_centre_info);
        }

        $user->update([
            'name' => isset($request->name) ? $request->name : '',
            'personal_name' => isset($request->personal_name) ? $request->personal_name : '',
            'nick_name' => isset($request->nick_name) ? $request->nick_name : '',
            'gender' => isset($request->gender) ? $request->gender : '',
            'email' => isset($request->email) ? $request->email : '',
            'role_id' => isset($request->role_id) ? $request->role_id : '',
            'sound_farm_name' => isset($request->sound_farm_name) ? $request->sound_farm_name : '',
            'mobile_number' => isset($request->mobile_number) ? $request->mobile_number : '',
            'code_sort' => isset($request->code_sort) ? $request->code_sort : '',
            'code' => isset($request->code) ? $request->code : '',
            'extra_mobile_number' => isset($request->extra_mobile_number) ? $request->extra_mobile_number : '',
            'categories_id' => isset($companyId) ? $companyId : NULL,
            'dealer_list_area_wise_type' => isset($request->dealer_list_area_wise_type) ? $request->dealer_list_area_wise_type : '',
            'dealer_list_area_wise_website' => isset($request->dealer_list_area_wise_website) ? $request->dealer_list_area_wise_website : '',
            'catalogue_type' => isset($request->catalogue_type) ? $request->catalogue_type : '',
            'catalogue_website' => isset($request->catalogue_website) ? $request->catalogue_website : '',
            'service_center' => isset($request->service_center) ? $request->service_center : '',
            'youtube_link' => isset($request->youtube_link) ? $request->youtube_link : '',
            'working_with' => isset($request->working_with) ? $request->working_with : '',
            'your_best_engineer' => isset($request->your_best_engineer) ? $request->your_best_engineer : '',
            'coaching_class' => isset($request->coaching_class) ? $request->coaching_class : '',
            'taluka' => isset($request->taluka) ? $request->taluka : '',
            'district' => isset($request->district) ? $request->district : '',
            'country_id' => isset($request->country_id) ? $request->country_id : '',
            'state_id' => isset($request->state_id) ? $request->state_id : '',
            'city_id' => isset($request->city_id) ? $request->city_id : '',
            'village' => isset($request->village) ? $request->village : '',
            'location' => isset($request->location) ? $request->location : '',
            'address' => isset($request->address) ? $request->address : '',
            'latitude' => isset($request->latitude) ? $request->latitude : '',
            'longitude' => isset($request->longitude) ? $request->longitude : '',
            'facebook_link' => isset($request->facebook_link) ? $request->facebook_link : '',
            'instagram_link' => isset($request->instagram_link) ? $request->instagram_link : '',
            'web_link' => isset($request->web_link) ? $request->web_link : '',
            'description' => isset($request->description) ? $request->description : '',
        ]);

        if ($request->role_id == "3") {
            Business::where('user_id', $request->id)->update([
                'category_id' => isset($category_idd) ? $category_idd : '',
                'sub_category_id' => isset($sub_category_idd) ? $sub_category_idd : '',
            ]);
        }

        if (isset($new_company)) {
            if (is_numeric($new_company)) {
                
            } else {
                Categories::where('id', $companyId)->update([
                    'user_id' => $user->id,
                ]);
            }
        }


        $user = Register::select('register.*', 'country.country_name as country_name', 'state.state_name as state_name', 'city.city_name as city_name')
                ->join('country', 'register.country_id', '=', 'country.id')
                ->join('state', 'register.state_id', '=', 'state.id')
                ->join('city', 'register.city_id', '=', 'city.id')
                ->where('register.id', $request->id);
        $user = $user->first();
        $role_data = Role::select('*')->whereIn('id', explode(',', $user->role_id))->get();
        $user['roles'] = $role_data;

        return response()->json(['message' => 'Updated successfully', 'status' => true, 'user' => $user], 200);
    }

    public function update_profile_specific_fields(Request $request) {
        $user = auth()->user();

        $exists = Register::where('id', $user->id)->first();
        if ($exists) {
            $updateData = array();

            if ($request->name) {
                $updateData['name'] = $request->name;
            }
            if ($request->has('service_center_info')) {
                $service_centre_info = json_decode($request->service_center_info, true);
                $service_centre_info_new = array();
                if ($request->service_center_info == "") {
                    $updateData['service_center_info'] = NULL;
                } else if ($request->service_center_info != "" && $request->service_center_info != "[]") {
                    foreach ($service_centre_info as &$service_centre_info_row) {
                        $ids = explode(',', $service_centre_info_row['company_id']); // split the ID string
                        $company_name_explode = explode(',', $service_centre_info_row['company_name']);
                        foreach ($ids as $keys => &$id) {
                            if (trim($id) === "0") {
                                $company = Categories::firstOrCreate([
                                            'name' => $company_name_explode[$keys],
                                            'user_id' => $user->id,
                                            'status' => 0,
                                ]);
                                $id = $company->id;
                            }
                        }
                        $service_centre_info_row['company_id'] = implode(',', $ids); // Rebuild the string
                    }
                    $service_centre_info1 = json_encode($service_centre_info);
                    $updateData['service_center_info'] = isset($service_centre_info1) ? $service_centre_info1 : '';
                }
            }

            $exists->update($updateData);
        }

        $user = Register::select('register.*', 'country.country_name as country_name', 'state.state_name as state_name', 'city.city_name as city_name')
                ->join('country', 'register.country_id', '=', 'country.id')
                ->join('state', 'register.state_id', '=', 'state.id')
                ->join('city', 'register.city_id', '=', 'city.id')
                ->where('register.id', $user->id);
        $user = $user->first();
        $role_data = array();
        if (isset($user)) {
            $role_data = Role::select('*')->whereIn('id', explode(',', $user->role_id))->get();
        }
        $user['roles'] = $role_data;

        return response()->json(['message' => 'Updated successfully.', 'status' => true, 'user' => $user], 200);
    }

    public function update_profile_personal(Request $request) {
        $user = auth()->user();
        $validator = Validator::make($request->all(), [
                    'name' => 'required',
//                    'email' => ['required', 'email', Rule::unique('register', 'email')->ignore($user->id)],
                    'role_id' => 'required',
                    'mobile_number' => ['required', Rule::unique('register', 'mobile_number')->ignore($user->id)],
                    'country_id' => 'required',
                    'state_id' => 'required',
                    'city_id' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => false, 'message' => $validator->errors()], 400);
        }
        $image = "";
        if ($request->hasFile('image')) {
            $image = Helper::uploadImage($request->image, Register::IMAGE_PATH);
        }
        $user->update([
            'image' => $image,
            'role_id' => $request->role_id,
            'name' => $request->name,
            'email' => $request->email,
            'receive_promotional_and_marketing_email' => $request->receive_promotional_and_marketing_email,
            'code_sort' => $request->code_sort,
            'code' => $request->code,
            'mobile_number' => $request->mobile_number,
            'available_on_whatsapp_with_same_number' => $request->available_on_whatsapp_with_same_number,
            'whats_app_code' => $request->whats_app_code,
            'whats_app_mobile_number' => $request->whats_app_mobile_number,
            'village' => $request->village,
            'city_id' => $request->city_id,
            'taluka' => $request->taluka,
            'district' => $request->district,
            'state_id' => $request->state_id,
            'country_id' => $request->country_id,
        ]);

        $user = Register::select('register.*', 'country.country_name as country_name', 'state.state_name as state_name', 'city.city_name as city_name')
                ->join('country', 'register.country_id', '=', 'country.id')
                ->join('state', 'register.state_id', '=', 'state.id')
                ->join('city', 'register.city_id', '=', 'city.id')
                ->where('register.id', $user->id);
        $user = $user->first();
        $role_data = Role::select('*')->whereIn('id', explode(',', $user->role_id))->get();
        $user['roles'] = $role_data;

        return response()->json(['message' => 'Updated successfully', 'status' => true, 'user' => $user], 200);
    }

    public function update_profile_business(Request $request) {
        $user = auth()->user();
        $validator = Validator::make($request->all(), [
                    'address' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => false, 'message' => $validator->errors()], 400);
        }
        $data = $request->only('user_id', 'your_best_engineer', 'service_center_id', 'service_center_address', 'service_center_address_latitude', 'service_center_address_longitude', 'working_with', 'product_info', 'proof', 'name', 'address', 'latitude', 'longitude', 'companies_id', 'company_website', 'gst_number', 'establishment_year', 'annual_turnover', 'status', 'business_card_image', 'facebook_link', 'instagram_link', 'web_link', 'youtube_link', 'category_id', 'sub_category_id', 'catalogue_type', 'catalogue_website', 'catalogue_pdf', 'dealer_list_area_wise_type', 'dealer_list_area_wise_website', 'dealer_list_area_wise_pdf', 'description');
        $data['status'] = 1;

        $exists = Business::where('user_id', $user->id)->first();
        if ($exists) {

            $updateData = [
                'name' => $request->name,
                'address' => $request->address,
                'latitude' => isset($request->latitude) ? $request->latitude : '',
                'longitude' => isset($request->longitude) ? $request->longitude : '',
                'company_website' => $request->company_website,
                'gst_number' => $request->gst_number,
                'working_with' => $request->working_with,
                'your_best_engineer' => $request->your_best_engineer,
                'establishment_year' => $request->establishment_year,
                'annual_turnover' => $request->annual_turnover,
                'dealer_list_area_wise_type' => $request->dealer_list_area_wise_type,
                'dealer_list_area_wise_website' => $request->dealer_list_area_wise_website,
                'catalogue_type' => $request->catalogue_type,
                'catalogue_website' => $request->catalogue_website,
                'youtube_link' => $request->youtube_link,
                'facebook_link' => $request->facebook_link,
                'instagram_link' => $request->instagram_link,
                'web_link' => $request->web_link,
                'description' => $request->description,
                'service_center_id' => isset($request->service_center_id) ? $request->service_center_id : '',
                'service_center_address' => isset($request->service_center_address) ? $request->service_center_address : '',
                'service_center_address_latitude' => isset($request->service_center_address_latitude) ? $request->service_center_address_latitude : '',
                'service_center_address_longitude' => isset($request->service_center_address_longitude) ? $request->service_center_address_longitude : '',
            ];


            $category_id_info = json_decode($request->category_id, true);
            $category_id_info_new = array();
            if ($request->category_id != "" && $request->category_id != "[]") {
                $category_id = "";
                foreach ($category_id_info as $category_id_info_row) {
                    if ($category_id_info_row['category_id'] == "") {
                        $category_data = Category::firstOrCreate([
                                    'name' => $category_id_info_row['category_name'],
                                    'user_id' => $user->id,
                                    'status' => 0,
                        ]);
                        $category_id = (int) $category_data->id;
                    } else {
                        $category_id = (int) $category_id_info_row['category_id'];
                    }
                    $category_id_info_new[] = $category_id;
                }
                $updateData['category_id'] = implode(',', $category_id_info_new);
            }

            $sub_category_id_info = json_decode($request->sub_category_id, true);
            $sub_category_id_info_new = array();
            if ($request->sub_category_id != "" && $request->sub_category_id != "[]") {
                $sub_category_id = "";
                foreach ($sub_category_id_info as $sub_category_id_info_row) {
                    if ($sub_category_id_info_row['sub_category_id'] == "") {
                        $sub_category_data = SubCategory::firstOrCreate([
                                    'name' => $sub_category_id_info_row['sub_category_name'],
                                    'user_id' => $user->id,
                                    'status' => 0,
                        ]);
                        $sub_category_id = (int) $sub_category_data->id;
                    } else {
                        $sub_category_id = (int) $sub_category_id_info_row['sub_category_id'];
                    }
                    $sub_category_id_info_new[] = $sub_category_id;
                }
                $updateData['sub_category_id'] = implode(',', $sub_category_id_info_new);
            }


            if ($user->role_id == "2" || $user->role_id == "3" || $user->role_id == "7") {
                $companies_id_info = json_decode($request->companies_id, true);
                $companies_id_info_new = array();
                if ($request->companies_id != "" && $request->companies_id != "[]") {
                    $company_id = "";
                    foreach ($companies_id_info as $companies_id_info_row) {
                        if ($companies_id_info_row['company_id'] == "") {
                            $company_data = Categories::firstOrCreate([
                                        'name' => $companies_id_info_row['company_name'],
                                        'user_id' => $user->id,
                                        'status' => 0,
                            ]);
                            $company_id = (int) $company_data->id;
                        } else {
                            $company_id = (int) $companies_id_info_row['company_id'];
                        }
                        $companies_id_info_new[] = $company_id;
                    }
                    $updateData['companies_id'] = implode(',', $companies_id_info_new);
                }
            } else {
                $updateData['companies_id'] = $request->companies_id;
            }

            if ($request->proof) {
                $updateData['proof'] = Helper::uploadImage($request->proof, Business::IMAGE_PATH);
            }
            if ($request->business_card_image) {
                if ($request->business_card_image == "removed") {
                    $updateData['business_card_image'] = "";
                } else {
                    $updateData['business_card_image'] = Helper::uploadImage($request->business_card_image, Business::IMAGE_PATH);
                }
            }
            if ($request->dealer_list_area_wise_pdf) {
                $updateData['dealer_list_area_wise_pdf'] = Helper::uploadImage($request->dealer_list_area_wise_pdf, Business::IMAGE_PATH);
            }
            if ($request->catalogue_pdf) {
                $updateData['catalogue_pdf'] = Helper::uploadImage($request->catalogue_pdf, Business::IMAGE_PATH);
            }

            $product_info = json_decode($request->product_info, true);
            $product_info_new = array();
            if ($request->product_info != "" && $request->product_info != "[]") {
                $product_id = "";
                $company_id = "";
                $model_id = "";
                foreach ($product_info as $product_info_row) {
                    if ($product_info_row['product_id'] == "") {
                        $product_data = Category::firstOrCreate([
                                    'name' => $product_info_row['product_name'],
                                    'user_id' => $user->id,
                                    'status' => 0,
                        ]);
                        $product_id = $product_data->id;
                    } else {
                        $product_id = $product_info_row['product_id'];
                    }
                    if ($product_info_row['company_id'] == "") {
                        $company_data = Categories::firstOrCreate([
                                    'name' => $product_info_row['company_name'],
                                    'user_id' => $user->id,
                                    'status' => 0,
                        ]);
                        $company_id = $company_data->id;
                    } else {
                        $company_id = $product_info_row['company_id'];
                    }

                    if ($product_info_row['model_id'] == "") {
                        $model_data = Models::firstOrCreate([
                                    'name' => $product_info_row['model_name'],
                                    'user_id' => $user->id,
                                    'status' => 0,
                        ]);
                        $model_id = $model_data->id;
                    } else {
                        $model_id = $product_info_row['model_id'];
                    }

                    $product_info_new[] = [
                        'product_id' => (string) $product_id,
                        'company_id' => (string) $company_id,
                        'model_id' => (string) $model_id,
                        'product_name' => (string) $product_info_row['product_name'],
                        'company_name' => (string) $product_info_row['company_name'],
                        'model_name' => (string) $product_info_row['model_name'],
                    ];
                }
                $updateData['product_info'] = json_encode($product_info_new);
            }

            $exists->update($updateData);

            $business_inserted_Id = $exists->id;
            $imageRecords = [];
            if ($request->hasFile('shop_images')) {
                foreach ($request->file('shop_images') as $file) {
                    $path = Helper::uploadImage($file, BusinessImages::IMAGE_PATH);
                    $imageRecords[] = [
                        'user_id' => $user->id,
                        'business_id' => $business_inserted_Id,
                        'image' => $path,
                    ];
                }
                if (!empty($imageRecords)) {
                    BusinessImages::insert($imageRecords);
                }
            }

            $companypdfRecords = [];
            if ($request->hasFile('company_names_pdf')) {
                $companyNames = $request->input('company_names');
                foreach ($request->file('company_names_pdf') as $index => $file1) {
                    $path = Helper::uploadImage($file1, BusinessCompany::IMAGE_PATH);
                    $companypdfRecords[] = [
                        'user_id' => $user->id,
                        'name' => $companyNames[$index] ?? null,
                        'business_id' => $business_inserted_Id,
                        'image' => $path,
                    ];
                }
                if (!empty($companypdfRecords)) {
                    BusinessCompany::insert($companypdfRecords);
                }
            }

            return response()->json([
                        'status' => true,
                        'message' => 'Updated successfully'
                            ], 200);
        } else {
            $data['user_id'] = $user->id;
            if ($request->proof) {
                $data['proof'] = Helper::uploadImage($request->proof, Business::IMAGE_PATH);
            }
            if ($request->business_card_image) {
                $data['business_card_image'] = Helper::uploadImage($request->business_card_image, Business::IMAGE_PATH);
            }
            if ($request->dealer_list_area_wise_pdf) {
                $data['dealer_list_area_wise_pdf'] = Helper::uploadImage($request->dealer_list_area_wise_pdf, Business::IMAGE_PATH);
            }
            if ($request->catalogue_pdf) {
                $data['catalogue_pdf'] = Helper::uploadImage($request->catalogue_pdf, Business::IMAGE_PATH);
            }

            $category_id_info = json_decode($request->category_id, true);
            $category_id_info_new = array();
            if ($request->category_id != "" && $request->category_id != "[]") {
                $category_id = "";
                foreach ($category_id_info as $category_id_info_row) {
                    if ($category_id_info_row['category_id'] == "") {
                        $category_data = Category::firstOrCreate([
                                    'name' => $category_id_info_row['category_name'],
                                    'user_id' => $user->id,
                                    'status' => 0,
                        ]);
                        $category_id = (int) $category_data->id;
                    } else {
                        $category_id = (int) $category_id_info_row['category_id'];
                    }
                    $category_id_info_new[] = $category_id;
                }
                $data['category_id'] = implode(',', $category_id_info_new);
            }

            $sub_category_id_info = json_decode($request->sub_category_id, true);
            $sub_category_id_info_new = array();
            if ($request->sub_category_id != "" && $request->sub_category_id != "[]") {
                $sub_category_id = "";
                foreach ($sub_category_id_info as $sub_category_id_info_row) {
                    if ($sub_category_id_info_row['sub_category_id'] == "") {
                        $sub_category_data = SubCategory::firstOrCreate([
                                    'name' => $sub_category_id_info_row['sub_category_name'],
                                    'user_id' => $user->id,
                                    'status' => 0,
                        ]);
                        $sub_category_id = (int) $sub_category_data->id;
                    } else {
                        $sub_category_id = (int) $sub_category_id_info_row['sub_category_id'];
                    }
                    $sub_category_id_info_new[] = $sub_category_id;
                }
                $data['sub_category_id'] = implode(',', $sub_category_id_info_new);
            }

            if ($user->role_id == "2" || $user->role_id == "3" || $user->role_id == "7") {
                $companies_id_info = json_decode($request->companies_id, true);
                $companies_id_info_new = array();
                if ($request->companies_id != "" && $request->companies_id != "[]") {
                    $company_id = "";
                    foreach ($companies_id_info as $companies_id_info_row) {
                        if ($companies_id_info_row['company_id'] == "") {
                            $company_data = Categories::firstOrCreate([
                                        'name' => $companies_id_info_row['company_name'],
                                        'user_id' => $user->id,
                                        'status' => 0,
                            ]);
                            $company_id = (int) $company_data->id;
                        } else {
                            $company_id = (int) $companies_id_info_row['company_id'];
                        }
                        $companies_id_info_new[] = $company_id;
                    }
                    $data['companies_id'] = implode(',', $companies_id_info_new);
                }
            } else {
                $data['companies_id'] = $request->companies_id;
            }

            $product_info = json_decode($request->product_info, true);
            $product_info_new = array();
            if ($request->product_info != "" && $request->product_info != "[]") {
                $product_id = "";
                $company_id = "";
                $model_id = "";
                foreach ($product_info as $product_info_row) {
                    if ($product_info_row['product_id'] == "") {
                        $product_data = Category::firstOrCreate([
                                    'name' => $product_info_row['product_name'],
                                    'user_id' => $user->id,
                                    'status' => 0,
                        ]);
                        $product_id = $product_data->id;
                    } else {
                        $product_id = $product_info_row['product_id'];
                    }
                    if ($product_info_row['company_id'] == "") {
                        $company_data = Categories::firstOrCreate([
                                    'name' => $product_info_row['company_name'],
                                    'user_id' => $user->id,
                                    'status' => 0,
                        ]);
                        $company_id = $company_data->id;
                    } else {
                        $company_id = $product_info_row['company_id'];
                    }

                    if ($product_info_row['model_id'] == "") {
                        $model_data = Models::firstOrCreate([
                                    'name' => $product_info_row['model_name'],
                                    'user_id' => $user->id,
                                    'status' => 0,
                        ]);
                        $model_id = $model_data->id;
                    } else {
                        $model_id = $product_info_row['model_id'];
                    }

                    $product_info_new[] = [
                        'product_id' => (string) $product_id,
                        'company_id' => (string) $company_id,
                        'model_id' => (string) $model_id,
                        'product_name' => (string) $product_info_row['product_name'],
                        'company_name' => (string) $product_info_row['company_name'],
                        'model_name' => (string) $product_info_row['model_name'],
                    ];
                }
                $data['product_info'] = json_encode($product_info_new);
            }

            $business = new Business($data);
            $business->save();
            $business_inserted_Id = $business->id;
            $imageRecords = [];
            if ($request->hasFile('shop_images')) {
                foreach ($request->file('shop_images') as $file) {
                    $path = Helper::uploadImage($file, BusinessImages::IMAGE_PATH);
                    $imageRecords[] = [
                        'user_id' => $user->id,
                        'business_id' => $business_inserted_Id,
                        'image' => $path,
                    ];
                }
                if (!empty($imageRecords)) {
                    BusinessImages::insert($imageRecords);
                }
            }

            return response()->json([
                        'status' => true,
                        'message' => 'Inserted successfully'
                            ], 200);
        }

        $user = Register::select('register.*', 'country.country_name as country_name', 'state.state_name as state_name', 'city.city_name as city_name')
                ->join('country', 'register.country_id', '=', 'country.id')
                ->join('state', 'register.state_id', '=', 'state.id')
                ->join('city', 'register.city_id', '=', 'city.id')
                ->where('register.id', $user->id);
        $user = $user->first();
        $role_data = array();
        if (isset($user)) {
            $role_data = Role::select('*')->whereIn('id', explode(',', $user->role_id))->get();
        }
        $user['roles'] = $role_data;

        return response()->json(['message' => 'Updated successfully', 'status' => true, 'user' => $user], 200);
    }

    public function update_business_specific_fields(Request $request) {
        $user = auth()->user();

        $data = $request->only('user_id', 'spare_part_info', 'working_with', 'your_best_engineer', 'service_center_id', 'service_center_address', 'service_center_address_latitude', 'service_center_address_longitude', 'working_with', 'product_info', 'proof', 'name', 'address', 'latitude', 'longitude', 'companies_id', 'company_website', 'gst_number', 'establishment_year', 'annual_turnover', 'status', 'business_card_image', 'facebook_link', 'instagram_link', 'web_link', 'youtube_link', 'category_id', 'sub_category_id', 'catalogue_type', 'catalogue_website', 'catalogue_pdf', 'dealer_list_area_wise_type', 'dealer_list_area_wise_website', 'dealer_list_area_wise_pdf', 'description');

        $exists = Business::where('user_id', $user->id)->first();
        if ($exists) {
            $updateData = array();


            if ($request->name) {
                $updateData['name'] = $request->name;
            }
            if ($request->working_with) {
                $updateData['working_with'] = $request->working_with;
            }
            if ($request->your_best_engineer) {
                $updateData['your_best_engineer'] = $request->your_best_engineer;
            }

            if ($request->has('spare_part_info')) {
                $spare_part_info = json_decode($request->spare_part_info, true);
                $parts_info_new = array();
                if ($request->spare_part_info == "") {
                    $updateData['spare_part_info'] = NULL;
                } else if ($request->spare_part_info != "" && $request->spare_part_info != "[]") {
                    $parts_id = "";
                    $company_id = "";
                    foreach ($spare_part_info as $spare_part_info_row) {
                        if ($spare_part_info_row['parts_id'] == "0" || $spare_part_info_row['parts_id'] == "") {
                            $parts_data = Parts::firstOrCreate([
                                        'name' => $spare_part_info_row['parts_name'],
                                        'user_id' => $user->id,
                                        'status' => 0,
                            ]);
                            $parts_id = $parts_data->id;
                        } else {
                            $parts_id = $spare_part_info_row['parts_id'];
                        }
                        if ($spare_part_info_row['company_id'] == "0" || $spare_part_info_row['company_id'] == "") {
                            $company_data = Categories::firstOrCreate([
                                        'name' => $spare_part_info_row['company_name'],
                                        'user_id' => $user->id,
                                        'status' => 0,
                            ]);
                            $company_id = $company_data->id;
                        } else {
                            $company_id = $spare_part_info_row['company_id'];
                        }

                        $parts_info_new[] = [
                            'parts_id' => (string) $parts_id,
                            'parts_name' => (string) $spare_part_info_row['parts_name'],
                            'company_id' => (string) $company_id,
                            'company_name' => (string) $spare_part_info_row['company_name'],
                            'details' => (string) $spare_part_info_row['details'],
                        ];
                    }
                    $updateData['spare_part_info'] = json_encode($parts_info_new);
                }
            }

            if ($request->has('product_info')) {
                $product_info = json_decode($request->product_info, true);
                $product_info_new = array();
                if ($request->product_info == "") {
                    $updateData['product_info'] = NULL;
                } else if ($request->product_info != "" && $request->product_info != "[]") {
                    $product_id = "";
                    $company_id = "";
                    $model_id = "";
                    foreach ($product_info as $product_info_row) {
                        if ($product_info_row['product_id'] == "") {
                            $product_data = Category::firstOrCreate([
                                        'name' => $product_info_row['product_name'],
                                        'user_id' => $user->id,
                                        'status' => 0,
                            ]);
                            $product_id = $product_data->id;
                        } else {
                            $product_id = $product_info_row['product_id'];
                        }
                        if ($product_info_row['company_id'] == "") {
                            $company_data = Categories::firstOrCreate([
                                        'name' => $product_info_row['company_name'],
                                        'user_id' => $user->id,
                                        'status' => 0,
                            ]);
                            $company_id = $company_data->id;
                        } else {
                            $company_id = $product_info_row['company_id'];
                        }

                        if ($product_info_row['model_id'] == "") {
                            $model_data = Models::firstOrCreate([
                                        'name' => $product_info_row['model_name'],
                                        'user_id' => $user->id,
                                        'status' => 0,
                            ]);
                            $model_id = $model_data->id;
                        } else {
                            $model_id = $product_info_row['model_id'];
                        }

                        $product_info_new[] = [
                            'product_id' => (string) $product_id,
                            'company_id' => (string) $company_id,
                            'model_id' => (string) $model_id,
                            'product_name' => (string) $product_info_row['product_name'],
                            'company_name' => (string) $product_info_row['company_name'],
                            'model_name' => (string) $product_info_row['model_name'],
                        ];
                    }
                    $updateData['product_info'] = json_encode($product_info_new);
                }
            }


            $category_id_info = json_decode($request->category_id, true);
            $category_id_info_new = array();
            if ($request->category_id != "" && $request->category_id != "[]") {
                $category_id = "";
                foreach ($category_id_info as $category_id_info_row) {
                    if ($category_id_info_row['category_id'] == "") {
                        $category_data = Category::firstOrCreate([
                                    'name' => $category_id_info_row['category_name'],
                                    'user_id' => $user->id,
                                    'status' => 0,
                        ]);
                        $category_id = (int) $category_data->id;
                    } else {
                        $category_id = (int) $category_id_info_row['category_id'];
                    }
                    $category_id_info_new[] = $category_id;
                }
                $updateData['category_id'] = implode(',', $category_id_info_new);
            }

            $sub_category_id_info = json_decode($request->sub_category_id, true);
            $sub_category_id_info_new = array();
            if ($request->sub_category_id != "" && $request->sub_category_id != "[]") {
                $sub_category_id = "";
                foreach ($sub_category_id_info as $sub_category_id_info_row) {
                    if ($sub_category_id_info_row['sub_category_id'] == "") {
                        $sub_category_data = SubCategory::firstOrCreate([
                                    'name' => $sub_category_id_info_row['sub_category_name'],
                                    'user_id' => $user->id,
                                    'status' => 0,
                        ]);
                        $sub_category_id = (int) $sub_category_data->id;
                    } else {
                        $sub_category_id = (int) $sub_category_id_info_row['sub_category_id'];
                    }
                    $sub_category_id_info_new[] = $sub_category_id;
                }
                $updateData['sub_category_id'] = implode(',', $sub_category_id_info_new);
            }

            if ($request->companies_id) {
                if ($user->role_id == "2" || $user->role_id == "3" || $user->role_id == "7") {
                    if ($request->has('companies_id')) {
                        $companies_id_info = json_decode($request->companies_id, true);
                        $companies_id_info_new = array();
                        if ($request->companies_id == "") {
                            $updateData['companies_id'] = NULL;
                        } else if ($request->companies_id != "" && $request->companies_id != "[]") {
                            $company_id = "";
                            foreach ($companies_id_info as $companies_id_info_row) {
                                if ($companies_id_info_row['company_id'] == "") {
                                    $company_data = Categories::firstOrCreate([
                                                'name' => $companies_id_info_row['company_name'],
                                                'user_id' => $user->id,
                                                'status' => 0,
                                    ]);
                                    $company_id = (int) $company_data->id;
                                } else {
                                    $company_id = (int) $companies_id_info_row['company_id'];
                                }
                                $companies_id_info_new[] = $company_id;
                            }
                            $updateData['companies_id'] = implode(',', $companies_id_info_new);
                        }
                    }
                } else {
                    $updateData['companies_id'] = $request->companies_id;
                }
            }


            $exists->update($updateData);

//            return response()->json([
//                        'status' => true,
//                        'message' => 'Updated successfully.'
//                            ], 200);
        } else {
            $data['user_id'] = $user->id;

            if ($request->name) {
                $data['name'] = $request->name;
            }
            if ($request->working_with) {
                $data['working_with'] = $request->working_with;
            }
            if ($request->your_best_engineer) {
                $data['your_best_engineer'] = $request->your_best_engineer;
            }
            if ($request->has('spare_part_info')) {
                $spare_part_info = json_decode($request->spare_part_info, true);
                $parts_info_new = array();
                if ($request->spare_part_info == "") {
                    $data['spare_part_info'] = NULL;
                } else if ($request->spare_part_info != "" && $request->spare_part_info != "[]") {
                    $parts_id = "";
                    $company_id = "";
                    foreach ($spare_part_info as $spare_part_info_row) {
                        if ($spare_part_info_row['parts_id'] == "0" || $spare_part_info_row['parts_id'] == "") {
                            $parts_data = Parts::firstOrCreate([
                                        'name' => $spare_part_info_row['parts_name'],
                                        'user_id' => $user->id,
                                        'status' => 0,
                            ]);
                            $parts_id = $parts_data->id;
                        } else {
                            $parts_id = $spare_part_info_row['parts_id'];
                        }
                        if ($spare_part_info_row['company_id'] == "0" || $spare_part_info_row['company_id'] == "") {
                            $company_data = Categories::firstOrCreate([
                                        'name' => $spare_part_info_row['company_name'],
                                        'user_id' => $user->id,
                                        'status' => 0,
                            ]);
                            $company_id = $company_data->id;
                        } else {
                            $company_id = $spare_part_info_row['company_id'];
                        }

                        $parts_info_new[] = [
                            'parts_id' => (string) $parts_id,
                            'parts_name' => (string) $spare_part_info_row['parts_name'],
                            'company_id' => (string) $company_id,
                            'company_name' => (string) $spare_part_info_row['company_name'],
                            'details' => (string) $spare_part_info_row['details'],
                        ];
                    }
                    $data['spare_part_info'] = json_encode($parts_info_new);
                }
            }

            if ($request->has('product_info')) {
                $product_info = json_decode($request->product_info, true);
                $product_info_new = array();
                if ($request->product_info == "") {
                    $data['product_info'] = NULL;
                } else if ($request->product_info != "" && $request->product_info != "[]") {
                    $product_id = "";
                    $company_id = "";
                    $model_id = "";
                    foreach ($product_info as $product_info_row) {
                        if ($product_info_row['product_id'] == "") {
                            $product_data = Category::firstOrCreate([
                                        'name' => $product_info_row['product_name'],
                                        'user_id' => $user->id,
                                        'status' => 0,
                            ]);
                            $product_id = $product_data->id;
                        } else {
                            $product_id = $product_info_row['product_id'];
                        }
                        if ($product_info_row['company_id'] == "") {
                            $company_data = Categories::firstOrCreate([
                                        'name' => $product_info_row['company_name'],
                                        'user_id' => $user->id,
                                        'status' => 0,
                            ]);
                            $company_id = $company_data->id;
                        } else {
                            $company_id = $product_info_row['company_id'];
                        }

                        if ($product_info_row['model_id'] == "") {
                            $model_data = Models::firstOrCreate([
                                        'name' => $product_info_row['model_name'],
                                        'user_id' => $user->id,
                                        'status' => 0,
                            ]);
                            $model_id = $model_data->id;
                        } else {
                            $model_id = $product_info_row['model_id'];
                        }

                        $product_info_new[] = [
                            'product_id' => (string) $product_id,
                            'company_id' => (string) $company_id,
                            'model_id' => (string) $model_id,
                            'product_name' => (string) $product_info_row['product_name'],
                            'company_name' => (string) $product_info_row['company_name'],
                            'model_name' => (string) $product_info_row['model_name'],
                        ];
                    }
                    $data['product_info'] = json_encode($product_info_new);
                }
            }
            $category_id_info = json_decode($request->category_id, true);
            $category_id_info_new = array();
            if ($request->category_id != "" && $request->category_id != "[]") {
                $category_id = "";
                foreach ($category_id_info as $category_id_info_row) {
                    if ($category_id_info_row['category_id'] == "") {
                        $category_data = Category::firstOrCreate([
                                    'name' => $category_id_info_row['category_name'],
                                    'user_id' => $user->id,
                                    'status' => 0,
                        ]);
                        $category_id = (int) $category_data->id;
                    } else {
                        $category_id = (int) $category_id_info_row['category_id'];
                    }
                    $category_id_info_new[] = $category_id;
                }
                $data['category_id'] = implode(',', $category_id_info_new);
            }

            $sub_category_id_info = json_decode($request->sub_category_id, true);
            $sub_category_id_info_new = array();
            if ($request->sub_category_id != "" && $request->sub_category_id != "[]") {
                $sub_category_id = "";
                foreach ($sub_category_id_info as $sub_category_id_info_row) {
                    if ($sub_category_id_info_row['sub_category_id'] == "") {
                        $sub_category_data = SubCategory::firstOrCreate([
                                    'name' => $sub_category_id_info_row['sub_category_name'],
                                    'user_id' => $user->id,
                                    'status' => 0,
                        ]);
                        $sub_category_id = (int) $sub_category_data->id;
                    } else {
                        $sub_category_id = (int) $sub_category_id_info_row['sub_category_id'];
                    }
                    $sub_category_id_info_new[] = $sub_category_id;
                }
                $data['sub_category_id'] = implode(',', $sub_category_id_info_new);
            }


            if ($request->companies_id) {
                if ($user->role_id == "2" || $user->role_id == "3" || $user->role_id == "7") {
                    if ($request->has('companies_id')) {
                        $companies_id_info = json_decode($request->companies_id, true);
                        $companies_id_info_new = array();
                        if ($request->companies_id == "") {
                            $data['companies_id'] = NULL;
                        } else if ($request->companies_id != "" && $request->companies_id != "[]") {
                            $company_id = "";
                            foreach ($companies_id_info as $companies_id_info_row) {
                                if ($companies_id_info_row['company_id'] == "") {
                                    $company_data = Categories::firstOrCreate([
                                                'name' => $companies_id_info_row['company_name'],
                                                'user_id' => $user->id,
                                                'status' => 0,
                                    ]);
                                    $company_id = (int) $company_data->id;
                                } else {
                                    $company_id = (int) $companies_id_info_row['company_id'];
                                }
                                $companies_id_info_new[] = $company_id;
                            }
                            $data['companies_id'] = implode(',', $companies_id_info_new);
                        }
                    }
                } else {
                    $data['companies_id'] = $request->companies_id;
                }
            }

            $business = new Business($data);
            $business->save();
//            $business_inserted_Id = $business->id;
//            return response()->json([
//                        'status' => true,
//                        'message' => 'Inserted successfully.'
//                            ], 200);
        }

        $business_data = array();
        $business_shop_images_data = array();
        $business_shop_video_data = array();
        $business_company_pdf_data = array();

        $user = Register::select('register.*', 'country.country_name as country_name', 'state.state_name as state_name', 'city.city_name as city_name')
                ->join('country', 'register.country_id', '=', 'country.id')
                ->join('state', 'register.state_id', '=', 'state.id')
                ->join('city', 'register.city_id', '=', 'city.id')
                ->where('register.id', $user->id);
        $user = $user->first();
        $role_data = array();
        if (isset($user)) {
            $role_data = Role::select('*')->whereIn('id', explode(',', $user->role_id))->get();

            $business_data = Business::select('*')->where('user_id', $user->id)->get();
            $business_data = $business_data->map(function ($business_data) {
                // Explode comma-separated IDs
                $categoryIds = explode(',', $business_data->category_id);
                $subCategoryIds = explode(',', $business_data->sub_category_id);

                // Fetch categories with id and name
                $categories = Category::whereIn('id', $categoryIds)->get(['id', 'name']);
                $subCategories = SubCategory::whereIn('id', $subCategoryIds)->get(['id', 'name']);

                // Map to desired format
                $categoryNames = $categories->map(function ($category) {
                    return [
                        'id' => $category->id,
                        'value' => $category->name,
                    ];
                });

                $subCategoryNames = $subCategories->map(function ($subCategory) {
                    return [
                        'id' => $subCategory->id,
                        'value' => $subCategory->name,
                    ];
                });

                // Add new keys
                $business_data['category_names'] = $categoryNames;
                $business_data['sub_category_names'] = $subCategoryNames;

                return $business_data;
            });

            $business_shop_images_data = BusinessImages::select('*')->where('user_id', $user->id)->get();
            $business_shop_video_data = BusinessVideo::select('*')->where('user_id', $user->id)->get();
            $business_company_pdf_data = BusinessCompany::select('*')->where('user_id', $user->id)->get();
        }
        $user['roles'] = $role_data;
        $user['business_data'] = $business_data;
        $user['business_company_pdf_data'] = $business_company_pdf_data;
        $user['business_shop_images_data'] = $business_shop_images_data;
        $user['business_shop_video_data'] = $business_shop_video_data;

        return response()->json(['message' => 'Updated successfully.', 'status' => true, 'user' => $user], 200);
    }

    public function remove_business_shop_image_by_id(Request $request) {
        $user = auth()->user();
        $validator = Validator::make($request->all(), [
                    'id' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => false, 'message' => $validator->errors()], 400);
        }

        $obj = BusinessImages::where('id', $request->id);
        if ($obj) {
            $delete = $obj->delete();
        }
        return response()->json([
                    'status' => true,
                    'message' => 'Image removed successfully'
                        ], 200);
    }

    public function update_business_company_pdf(Request $request) {
        $user = auth()->user();

        $validator = Validator::make($request->all(), [
                    'id' => 'required'
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => false, 'message' => $validator->errors()], 400);
        }

        $exists = BusinessCompany::where('id', $request->id)->first();
        if ($exists) {
            $updateData = [
                'name' => $request->name
            ];
            if ($request->image) {
                $updateData['image'] = Helper::uploadImage($request->image, BusinessCompany::IMAGE_PATH);
            }
            $exists->update($updateData);
        }
        return response()->json(['message' => 'Updated successfully', 'status' => true], 200);
    }

    public function delete_business_company_pdf(Request $request) {
        $user = auth()->user();

        $validator = Validator::make($request->all(), [
                    'id' => 'required'
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => false, 'message' => $validator->errors()], 400);
        }

        BusinessCompany::where('id', $request->id)->delete();
        return response()->json(['message' => 'Deleted successfully', 'status' => true], 200);
    }

}
