<?php

namespace App\Http\Controllers\API\Auth;

use App\Helper\Helper;
use App\Mail\MailSend;
use App\Http\Controllers\Controller;
use App\Models\Admin;
use App\Models\Register;
use App\Models\Role;
use App\Models\Catalogue;
use App\Models\Business;
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

//    public function send_otp(Request $request) {
//        $validator = Validator::make($request->all(), [
//                    'email' => 'required|string|email|max:255',
//        ]);
//
//        if ($validator->fails()) {
//            return response()->json(['status' => false, 'message' => $validator->errors()], 400);
//        }
//
//        try {
//
//        $otp = 123456;  //random_int(100000, 999999);
//
//        $user = TempRegister::where('email', $request->email)->select('id')->first();
//        if (!$user) {
////                insert
//            $data = $request->only('code', 'mobile_number', 'email', 'verification_code');
//            $data['verification_code'] = $otp;
//
//            $temp_register = new TempRegister($data);
//            $temp_register->save();
//        } else {
////                update
//            $user->update([
//                'verification_code' => $otp,
//            ]);
//        }
//        $mailDataObj = [
//            'email' => $request->email,
//            'otp' => $otp,
//        ];
//        Mail::to($request->email)->send(new MailSend($mailDataObj, 'mail.otp', $subject = 'Otp Verification'));
//        return response()->json(['message' => 'Otp send successfully', 'status' => true, 'otp' => $otp], 200);
//        } catch (\Throwable $th) {
//            \Log::error(request()->path() . "\n" . $th->getMessage());
//            return response()->json(['status' => false, 'message' => 'Oops! Something went wrong. Please try again later.'], 500);
//        }
//    }

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

//            $api_key = '368341AF627B14';
//            $contacts = '9624081361';
//            $from = 'SOUNWL';
//            $sms_text = urlencode('Your Login Otp for Soundwale.in is '.$otp.', kindly do not share your OTP to any one.');
//            $template_id = '1707174843302508298';
//            $pe_id = '1701174809453865621';
//
////Submit to server
//
//            $ch = curl_init();
//            curl_setopt($ch, CURLOPT_URL, "https://kutility.org/app/smsapi/index.php");
//            curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
//            curl_setopt($ch, CURLOPT_POST, 1);
//            curl_setopt($ch, CURLOPT_POSTFIELDS, "key=" . $api_key . "&campaign=14793&routeid=7&type=text&contacts=" . $contacts . "&senderid=" . $from . "&msg=" . $sms_text . "&template_id=" . $template_id . "&pe_id=" . $pe_id);
//            $response = curl_exec($ch);
//            curl_close($ch);
            $response = "ERR";

            if (strpos($response, "SMS") !== false) {
                
            }else{
                return response()->json(['message' => 'Otp send error please try again.', 'status' => false], 401);
            }
            
//            die;

//            $api_key = '368341AF627B14';
//            $campaign_id = '14793';
//            $routeid = '7';
//            $contacts = '919624081361';
//            $senderid = 'SOUNWL';
//            $msg = 'Hello';
//            $template_id = '1707174843302508298';
//            $pe_id = '1701174809453865621';
//
//
//            $postData = [
//                'key' => $api_key,
//                'campaign_id' => $campaign_id,
//                'routeid' => $routeid,
//                'type' => "text",
//                'contacts' => $contacts,
//                'senderid' => $senderid,
//                'msg' => $msg,
//                'template_id' => $template_id,
//                'pe_id' => $pe_id
//            ];
//
//            $url = "https://kutility.org/app/smsapi/index.php";
//
//            $ch = curl_init();
//            curl_setopt_array($ch, [
//                CURLOPT_URL => $url,
//                CURLOPT_RETURNTRANSFER => true,
//                CURLOPT_POST => true,
//                CURLOPT_POSTFIELDS => $postData
//            ]);
//
//            $response = curl_exec($ch);
//            if (curl_errno($ch)) {
//                echo 'cURL Error: ' . curl_error($ch);
//            }
//            curl_close($ch);
//
//            echo $response;
//
//            die;

            $user = TempRegister::where('code', $request->code)->where('mobile_number', $request->mobile_number)->select('id')->first();
            if (!$user) {
                $data = $request->only('code', 'mobile_number', 'verification_code');
                $data['verification_code'] = $otp;

                $temp_register = new TempRegister($data);
                $temp_register->save();
            } else {
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
                    'email' => 'required|string|email|max:255',
                    'otp' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => false, 'message' => $validator->errors()], 400);
        }

        // Attempt to find the user in the register table
        $temp_register = TempRegister::where('email', $request->email)->where('verification_code', $request->otp)->select('*')->first();

        // If user is not found
        if (!$temp_register) {
            return response()->json(['message' => 'Invalid Otp.', 'status' => false], 404);
        }

        // $user = Register::where('code', $request->code)->where('mobile_number', $request->mobile_number)->select('*')->first();
        $user = Register::select('register.*', 'country.country_name as country_name', 'state.state_name as state_name', 'city.city_name as city_name', 'categories.name as main_category_name')
                ->leftjoin('categories', 'register.categories_id', '=', 'categories.id')
                ->join('country', 'register.country_id', '=', 'country.id')
                ->join('state', 'register.state_id', '=', 'state.id')
                ->join('city', 'register.city_id', '=', 'city.id')
                ->where('register.email', $request->email);
        $user = $user->first();


        // Check if user is active (status 0) or deactivated (status 1)
        if (!$user) {
            $token = "";
        } else {
            if ($user->status == 0) {
                return response()->json(['message' => 'Your account has been disabled. Please contact support for assistance.', 'status' => false], 404);
            }
            // Invalidate existing tokens
            $user->tokens()->delete();

            // Generate a new token
            $token = $user->createToken('auth_token')->plainTextToken;
        }


        return response()->json(['message' => 'Otp verify successful', 'status' => true, 'token' => $token, 'user' => $user], 200);
    }

//    public function verify_otp(Request $request) {
//        $validator = Validator::make($request->all(), [
//                    'code' => 'required',
//                    'mobile_number' => 'required',
//                    'otp' => 'required',
//        ]);
//
//        if ($validator->fails()) {
//            return response()->json(['status' => false, 'message' => $validator->errors()], 400);
//        }
//
//        // Attempt to find the user in the register table
//        $temp_register = TempRegister::where('code', $request->code)->where('mobile_number', $request->mobile_number)->where('verification_code', $request->otp)->select('*')->first();
//
//        // If user is not found
//        if (!$temp_register) {
//            return response()->json(['message' => 'Invalid Otp.', 'status' => false], 404);
//        }
//
//        // $user = Register::where('code', $request->code)->where('mobile_number', $request->mobile_number)->select('*')->first();
//		$user = Register::select('register.*', 'country.country_name as country_name', 'state.state_name as state_name', 'city.city_name as city_name','categories.name as main_category_name')
//                    ->leftjoin('categories', 'register.categories_id', '=', 'categories.id')
//                    ->join('country', 'register.country_id', '=', 'country.id')
//                    ->join('state', 'register.state_id', '=', 'state.id')
//                    ->join('city', 'register.city_id', '=', 'city.id')
//                    ->where('register.mobile_number', $request->mobile_number);
//            $user = $user->first();
//
//		
//        // Check if user is active (status 0) or deactivated (status 1)
//        if (!$user) {
//            $token = "";
//        } else {
//            if ($user->status == 0) {
//                return response()->json(['message' => 'Your account has been disabled. Please contact support for assistance.', 'status' => false], 401);
//            }
//            // Invalidate existing tokens
//            $user->tokens()->delete();
//
//            // Generate a new token
//            $token = $user->createToken('auth_token')->plainTextToken;
//        }
//
//
//        return response()->json(['message' => 'Otp verify successful', 'status' => true, 'token' => $token, 'user' => $user], 200);
//    }
}
