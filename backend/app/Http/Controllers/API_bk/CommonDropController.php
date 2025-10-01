<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Admin;
use App\Models\Banner;
use App\Models\Categories;
use App\Models\Register;
use App\Models\Category;
use App\Models\SubCategory;
use App\Models\Models;
use App\Models\Unit;
use App\Models\Grade;
use App\Models\Requirment;
use App\Models\Surface;
use App\Models\Country;
use App\Models\Cities;
use App\Models\States;
use App\Models\Role;
use App\Models\HomeSlider;
use App\Models\HomeFooterSlider;
use App\Models\Faq;
use App\Models\BuyerRequirment;
use App\Models\SellerDetails;
use App\Models\MailConfiguration;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Mail;
use App\Mail\AccountDeletedMail;
use Illuminate\Validation\Rule;

class CommonDropController extends Controller {

    public function home_header_slider_list(Request $request) {

        $data = HomeSlider::where('status', 1)->select('id', 'image', 'status')->get();
        if ($data->isEmpty()) {
            return response()->json(['status' => false, 'message' => 'Details not found.'], 404);
        }

        return response()->json(['status' => true, 'data' => $data], 200);
    }

    public function home_footer_slider_list(Request $request) {

        $data = HomeFooterSlider::where('status', 1)->select('id', 'image', 'status')->get();
        if ($data->isEmpty()) {
            return response()->json(['status' => false, 'message' => 'Details not found.'], 404);
        }

        return response()->json(['status' => true, 'data' => $data], 200);
    }

    public function faq_list(Request $request) {

        $data = Faq::select('id', 'title', 'description')->get();
        if ($data->isEmpty()) {
            return response()->json(['status' => false, 'message' => 'Details not found.'], 404);
        }

        return response()->json(['status' => true, 'data' => $data], 200);
    }

    public function main_categories_lists(Request $request) {

        $user = Auth::user();
        
        if ($request->filled('user_id')) {
            $data = Categories::where('status', 1)->orWhere('user_id', $request->user_id)->orderBy('name', 'asc')->select('id', 'name', 'image', 'status')->get();
        }else{
            $data = Categories::where('status', 1)->orderBy('name', 'asc')->select('id', 'name', 'image', 'status')->get();
        }
        if ($data->isEmpty()) {
            return response()->json(['status' => false, 'message' => 'Details not found.'], 404);
        }

        return response()->json(['status' => true, 'data' => $data], 200);
    }

    public function category_lists(Request $request) {

        if ($request->filled('user_id')) {
            $data = Category::where('status', 1)->orWhere('user_id', $request->user_id)->orderBy('name', 'asc')->select('id', 'name', 'status')->get();
        }else{
            $data = Category::where('status', 1)->orderBy('name', 'asc')->select('id', 'name', 'status')->get();
        }
        if ($data->isEmpty()) {
            return response()->json(['status' => false, 'message' => 'Details not found.'], 404);
        }

        return response()->json(['status' => true, 'data' => $data], 200);
    }

	public function model_lists(Request $request) {

        $data = Models::where('status', 1)->orderBy('name', 'asc')->select('id', 'name', 'status')->get();

        if ($data->isEmpty()) {
            return response()->json(['status' => false, 'message' => 'Details not found.'], 404);
        }

        return response()->json(['status' => true, 'data' => $data], 200);
    }

    public function sub_category_lists(Request $request) {

        if ($request->filled('category_id')) {
            if ($request->filled('user_id')) {
                $data = SubCategory::where('status', 1)->where('category_id', $request->category_id)->orWhere('user_id', $request->user_id)->orderBy('name', 'asc')->select('id', 'category_id', 'name', 'status')->get();
            } else {
                $data = SubCategory::where('status', 1)->where('category_id', $request->category_id)->orderBy('name', 'asc')->select('id', 'category_id', 'name', 'status')->get();
            }
        } else {
            $data = SubCategory::where('status', 1)->orderBy('name', 'asc')->select('id', 'category_id', 'name', 'status')->get();
        }
//        if ($request->filled('user_id')) {
//            $data = SubCategory::where('status', 1)->orWhere('user_id', $request->user_id)->orderBy('name', 'asc')->select('id', 'category_id', 'name', 'status')->get();
//        } else {
//            $data = SubCategory::where('status', 1)->orderBy('name', 'asc')->select('id', 'category_id', 'name', 'status')->get();
//        }
        if ($data->isEmpty()) {
            return response()->json(['status' => false, 'message' => 'Details not found.'], 404);
        }

        return response()->json(['status' => true, 'data' => $data], 200);
    }

    public function unit_lists(Request $request) {

        $data = Unit::where('status', 1)->select('id', 'name', 'status')->get();
        if ($data->isEmpty()) {
            return response()->json(['status' => false, 'message' => 'Details not found.'], 404);
        }
        return response()->json(['status' => true, 'data' => $data], 200);
    }

    public function grade_lists(Request $request) {

        $data = Grade::where('status', 1)->select('id', 'name', 'status')->get();
        if ($data->isEmpty()) {
            return response()->json(['status' => false, 'message' => 'Details not found.'], 404);
        }
        return response()->json(['status' => true, 'data' => $data], 200);
    }

    public function requirment_lists(Request $request) {

        $data = Requirment::where('status', 1)->select('id', 'name', 'status')->get();
        if ($data->isEmpty()) {
            return response()->json(['status' => false, 'message' => 'Details not found.'], 404);
        }
        return response()->json(['status' => true, 'data' => $data], 200);
    }

    public function surface_lists(Request $request) {

        $data = Surface::where('status', 1)->select('id', 'name', 'status')->get();
        if ($data->isEmpty()) {
            return response()->json(['status' => false, 'message' => 'Details not found.'], 404);
        }
        return response()->json(['status' => true, 'data' => $data], 200);
    }

    public function country_lists(Request $request) {

        $data = Country::where('is_enable', 1)->select('id', 'country_name')->get();
        if ($data->isEmpty()) {
            return response()->json(['status' => false, 'message' => 'Details not found.'], 404);
        }
        return response()->json(['status' => true, 'data' => $data], 200);
    }

    public function states_lists(Request $request) {

        if ($request->filled('id_country') && $request->filled('id_country')) {
            $data = States::where('is_enable', 1)->where('id_country', $request->id_country)->select('id', 'state_name', 'id_country')->get();
        } else {
            $data = States::where('is_enable', 1)->select('id', 'state_name', 'id_country')->get();
        }
        if ($data->isEmpty()) {
            return response()->json(['status' => false, 'message' => 'Details not found.'], 404);
        }
        return response()->json(['status' => true, 'data' => $data], 200);
    }

    public function cities_lists(Request $request) {

        if ($request->filled('id_state') && $request->filled('id_state')) {
            $data = Cities::where('is_enable', 1)->where('id_state', $request->id_state)->select('id', 'city_name', 'id_state', 'id_country')->get();
        } else {
            $data = Cities::where('is_enable', 1)->select('id', 'city_name', 'id_state', 'id_country')->get();
        }
        if ($data->isEmpty()) {
            return response()->json(['status' => false, 'message' => 'Details not found.'], 404);
        }
        return response()->json(['status' => true, 'data' => $data], 200);
    }

    public function role_lists(Request $request) {

        $data = Role::where('status', 1)->select('id', 'name','selected_image', 'slug', 'description', 'image')->get();
        if ($data->isEmpty()) {
            return response()->json(['status' => false, 'message' => 'Details not found.'], 404);
        }
        
        return response()->json(['status' => true, 'data' => $data], 200);
    }

    public function country_and_state_list(Request $request) {

        $formattedCountries = [];
        $countries = Country::get();
        foreach ($countries as $country) {
            $formattedStates = [];
            $states_list = States::where('id_country', $country->id)->select('*')->get();
            foreach ($states_list as $states_list_row) {
                $formattedStates[] = [
                    'id' => $states_list_row->id,
                    'name' => $states_list_row->state_name,
                    'country_id' => $states_list_row->id_country,
                ];
            }
            $formattedCountries[] = [
                'id' => $country->id,
                'name' => $country->country_name,
                'states' => $formattedStates,
            ];
        }


//        $countries = Country::with('states')->get();
        return response()->json(['status' => true, 'data' => $formattedCountries], 200);
    }

    public function get_filter_data(Request $request) {

        $type = $request->type;

        
        if ($type == "buyer") {
            $data['price']['min'] = BuyerRequirment::min('price');
            $data['price']['max'] = BuyerRequirment::max('price');
            $data['city'] = BuyerRequirment::select('city.id', 'city.city_name')
                ->join('city', 'buyer_requirment.city_id', '=', 'city.id')
                ->distinct()
                ->get();
        }else if ($type == "directory") {
            $data['city'] = Register::select('city.id', 'city.city_name')
                ->join('city', 'register.city_id', '=', 'city.id')
                ->distinct()
                ->get();
			$data['main_category'] = Categories::where('status', 1)->select('id', 'name', 'image', 'status')->get();
            $data['category'] = Category::where('status', 1)->select('id', 'name', 'status')->get();
            $data['sub_category'] = SubCategory::where('status', 1)->select('id', 'category_id', 'name', 'status')->get();
            $data['model'] = Models::where('status', 1)->select('id', 'name', 'status')->get();
            return response()->json(['status' => true, 'data' => $data], 200);
        } else {
            $data['price']['min'] = SellerDetails::min('price');
            $data['price']['max'] = SellerDetails::max('price');
            $data['city'] = SellerDetails::select('city.id', 'city.city_name')
                ->join('city', 'seller_details.city_id', '=', 'city.id')
                ->distinct()
                ->get();
        }
        $data['main_category'] = Categories::where('status', 1)->select('id', 'name', 'image', 'status')->get();
        $data['requirement_type'] = Requirment::where('status', 1)->select('id', 'name', 'status')->get();
        $data['category'] = Category::where('status', 1)->select('id', 'name', 'status')->get();
        $data['sub_category'] = SubCategory::where('status', 1)->select('id', 'category_id', 'name', 'status')->get();

        return response()->json(['status' => true, 'data' => $data], 200);
    }

}
