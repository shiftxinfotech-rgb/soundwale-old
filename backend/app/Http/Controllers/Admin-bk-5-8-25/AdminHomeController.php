<?php

namespace App\Http\Controllers\Admin;

use App\Helper\Helper;
use App\Http\Controllers\Controller;
use App\Models\CmsPages;
use App\Models\ContactUs;
use App\Models\Register;
use App\Models\Categories;
use App\Models\City;
use App\Models\Category;
use App\Models\SubCategory;
use App\Models\Models;
use App\Models\Manufacturer;
use App\Models\BuyerRequirment;
use App\Models\SellerDetails;
use Illuminate\Http\Request;

class AdminHomeController extends Controller {

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct() {
        // $this->middleware('auth');
    }

    /**
     * Show the application dashboard.
     *
     * @return \Illuminate\Contracts\Support\Renderable
     */
    public function index() {

        $data['user_count'] = Register::count();
        $data['company_count'] = Categories::count();
        $data['category_count'] = Category::count();
        $data['sub_category_count'] = SubCategory::select('id')
            ->join('category', 'sub_category.category_id', '=', 'category.id')
            ->count();
        $data['models_count'] = Models::count();
        $data['manufacturer_count'] = Manufacturer::count();
        $data['buyer_requirment_count'] = BuyerRequirment::join('categories', 'buyer_requirment.categories_id', '=', 'categories.id')
                ->join('category', 'buyer_requirment.category_id', '=', 'category.id')
                ->join('register', 'buyer_requirment.user_id', '=', 'register.id')
                ->join('city', 'buyer_requirment.city_id', '=', 'city.id')
                ->count();
        $data['seller_details_count'] = SellerDetails::join('categories', 'seller_details.categories_id', '=', 'categories.id')
                ->join('category', 'seller_details.category_id', '=', 'category.id')
                ->join('register', 'seller_details.user_id', '=', 'register.id')
                ->join('city', 'seller_details.city_id', '=', 'city.id')
                ->count();
        $data['user_inquiry_count'] = ContactUs::count();
        return view('admin.dashboard', compact('data'));
    }

    public function storeImage(Request $request) {
        if ($request->hasFile('upload')) {

            $originName = $request->file('upload')->getClientOriginalName();
            $fileName = pathinfo($originName, PATHINFO_FILENAME);
            $upload = $request->file('upload')->store('upload');
            $url = Helper::getImageUrl($upload, $fileName);

            return response()->json(['fileName' => $fileName, 'uploaded' => 1, 'url' => $url]);
        }
        return false;
    }

}
