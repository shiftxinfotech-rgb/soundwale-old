<?php

namespace App\Http\Controllers\API\Auth;

use App\Http\Controllers\Controller;
use App\Models\Admin;
use App\Models\Register;
use App\Models\Role;
use App\Models\Catalogue;
use App\Models\UserVideo;
use App\Models\SellerDetails;
use App\Models\SellerDetailsLike;
use App\Models\Review;
use App\Models\TempRegister;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Config;

class LoginController extends Controller {

    public function login(Request $request) {
        $validator = Validator::make($request->all(), [
                    'email' => 'required|string|email|max:255',
                    'password' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => false, 'message' => $validator->errors()], 400);
        }

        // Attempt to find the user in the register table
        $user = Register::where('email', $request->email)->select('id', 'name', 'email', 'password', 'status')->first();

        // If user is not found
        if (!$user) {
            return response()->json(['message' => 'User not found.', 'status' => false], 404);
        }

        // Check if the provided password matches the stored hashed password
        if (!Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Password invalid.', 'status' => false], 401);
        }

        // Check if user is active (status 0) or deactivated (status 1)
        if ($user->status == 0) {
            return response()->json(['message' => 'Your account has been disabled. Please contact support for assistance.', 'status' => false], 401);
        }



        // Invalidate existing tokens
        $user->tokens()->delete();

        // Generate a new token
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json(['message' => 'Login successful', 'status' => true, 'token' => $token, 'user' => $user], 200);
    }

    public function login_with_mobile_number(Request $request) {
        $validator = Validator::make($request->all(), [
                    'code' => 'required',
                    'mobile_number' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => false, 'message' => $validator->errors()], 400);
        }

        // Attempt to find the user in the register table
        $user = Register::select('register.*', 'country.country_name as country_name', 'state.state_name as state_name', 'city.city_name as city_name')
                ->join('country', 'register.country_id', '=', 'country.id')
                ->join('state', 'register.state_id', '=', 'state.id')
                ->join('city', 'register.city_id', '=', 'city.id')
                ->where('code', $request->code)
                ->where('mobile_number', $request->mobile_number);
        $user = $user->first();
        if (!$user) {
            return response()->json(['message' => 'User not found.', 'status' => false], 404);
        }

        $role_data = array();
        $catalogue_data = array();
        $shorts_data = array();
        $seller_data = array();
        if (isset($user)) {
            $role_data = Role::select('*')->whereIn('id', explode(',', $user->role_id))->get();
            $catalogue_data = Catalogue::select('*')->where('user_id', $user->id)->get();
            $shorts_data = UserVideo::select('*')->where('user_id', $user->id)->get();
            $seller_data = SellerDetails::select(SellerDetails::raw("IF(seller_details_likes.status = 1, 1, 0) as is_likes"), 'seller_details.id', 'seller_details.other_details', 'seller_details.user_id', 'register.name as user_name', 'seller_details.country_id', 'country.country_name as country_name', 'seller_details.state_id', 'state.state_name as state_name', 'seller_details.city_id', 'city.city_name as city_name', 'seller_details.requirment_id', 'requirment.name as requirment_name', 'seller_details.categories_id', 'categories.name as main_category_name', 'seller_details.category_id', 'category.name as category_name', 'seller_details.sub_category_id', 'sub_category.name as sub_category_name', 'seller_details.price', 'seller_details.description')
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
        }
        $user['roles'] = $role_data;
        $user['catalogue_data'] = $catalogue_data;
        $user['shorts_data'] = $shorts_data;
        $user['seller_data'] = $seller_data;
//        $user = Register::where('code', $request->code)->where('mobile_number', $request->mobile_number)->select('*')->first();
        // If user is not found
        // Check if user is active (status 0) or deactivated (status 1)
        $token = "";
        if (isset($user)) {
            if ($user->status == 0) {
                return response()->json(['message' => 'Your account has been disabled. Please contact support for assistance.', 'status' => false], 401);
            }
            // Invalidate existing tokens
            $user->tokens()->delete();

            // Generate a new token
            $token = $user->createToken('auth_token')->plainTextToken;
        }



        return response()->json(['message' => 'Login successful', 'status' => true, 'token' => $token, 'user' => $user], 200);
    }

    public function send_otp(Request $request) {
        $validator = Validator::make($request->all(), [
                    'code' => 'required',
                    'mobile_number' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => false, 'message' => $validator->errors()], 400);
        }

        try {

            $otp = random_int(100000, 999999);

            $user = TempRegister::where('code', $request->code)->where('mobile_number', $request->mobile_number)->select('id')->first();
            if (!$user) {
//                insert
                $data = $request->only('code', 'mobile_number', 'verification_code');
                $data['verification_code'] = $otp;

                $temp_register = new TempRegister($data);
                $temp_register->save();
            } else {
//                update
                $user->update([
                    'verification_code' => $otp,
                ]);
            }

            return response()->json(['message' => 'Otp send successfully', 'status' => true, 'otp' => $otp], 200);
        } catch (\Throwable $th) {
            \Log::error(request()->path() . "\n" . $th->getMessage());
            return response()->json(['status' => false, 'message' => 'Oops! Something went wrong. Please try again later.'], 500);
        }
    }

    public function verify_otp(Request $request) {
        $validator = Validator::make($request->all(), [
                    'code' => 'required',
                    'mobile_number' => 'required',
                    'otp' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => false, 'message' => $validator->errors()], 400);
        }

        // Attempt to find the user in the register table
        $temp_register = TempRegister::where('code', $request->code)->where('mobile_number', $request->mobile_number)->where('verification_code', $request->otp)->select('*')->first();

        // If user is not found
        if (!$temp_register) {
            return response()->json(['message' => 'Invalid Otp.', 'status' => false], 404);
        }

        $user = Register::where('code', $request->code)->where('mobile_number', $request->mobile_number)->select('*')->first();
        // Check if user is active (status 0) or deactivated (status 1)
        if (!$user) {
            $token = "";
        } else {
            if ($user->status == 0) {
                return response()->json(['message' => 'Your account has been disabled. Please contact support for assistance.', 'status' => false], 401);
            }
            // Invalidate existing tokens
            $user->tokens()->delete();

            // Generate a new token
            $token = $user->createToken('auth_token')->plainTextToken;
        }


        return response()->json(['message' => 'Otp verify successful', 'status' => true, 'token' => $token, 'user' => $user], 200);
    }

}
