<?php

namespace App\Http\Controllers\Admin;

use App\Helper\Helper;
use App\Http\Controllers\Controller;
use App\Models\Categories;
use App\Models\Category;
use App\Models\SubCategory;
use App\Models\Register;
use App\Models\Unit;
use App\Models\Grade;
use App\Models\Requirment;
use App\Models\Surface;
use App\Models\SellerDetails;
use App\Models\SellerDetailsImages;
use App\Models\Cities;
use DataTables;
use Illuminate\Http\Request;

class SellerDetailsControllers extends Controller
{
    public function list(Request $request)
    {
        if($request->method() == 'POST'){
            $query = SellerDetails::select('seller_details.id', 'seller_details.user_id','seller_details.city_id', 'seller_details.status', 'seller_details.created_at', 'categories.name as main_category_name', 'register.name as user_name', 'category.name as category_name', 'city.city_name as city_name')
            ->join('categories', 'seller_details.categories_id', '=', 'categories.id')
            ->join('category', 'seller_details.category_id', '=', 'category.id')
            ->join('register', 'seller_details.user_id', '=', 'register.id')
            ->join('city', 'seller_details.city_id', '=', 'city.id')
            ->latest();
            $query = $query->latest();

            return DataTables::of($query)

            ->addColumn('action', function($row){
                $viewRoute = "<a href='".route('admin.seller_details.view', $row->id)."' class='btn btn-icon btn-outline-brand btn-sm'  title='View details'><i class='flaticon-eye fa-lg'></i></a>&nbsp;";
                $deleteRoute = "<a href='".route('admin.seller_details.delete')."' data-id='".$row->id."' class='delete-record btn btn-icon btn-outline-danger btn-sm' title='Delete'><i class='la la-trash'></i></a>&nbsp;";

                $viewRoute   = $viewRoute ? $viewRoute : null;
                $deleteRoute = $deleteRoute ? $deleteRoute : null;

                return "{$viewRoute}{$deleteRoute}";
            })
            ->rawColumns(['action'])
            ->make(true);
        }

        return view('admin.seller_details.list');
    }

    

    public function view($id)
    {
        $data = SellerDetails::with('categories','category', 'sub_category','country','states','cities')->findOrFail($id);
        $images_data = SellerDetailsImages::where('seller_details_id', $id)->get();

        return view('admin.seller_details.view', compact('data','images_data'));
    }

    public function statusChange(Request $request)
    {
        if (! $request->ajax()) {
            return abort(404);
        }

        $request->validate([
            'id' => 'required|exists:category,id',
            'status' => 'required',
        ]);

        try {
            $obj = SellerDetails::where('id', request('id'))->limit(1)->first();
            if ($obj) {
                $obj->status = ($request->status == 'true') ? 1 : 0;
                $obj->save();
            }

            return response()->json(['message' => 'Status update successfully'], 200);
        } catch (\Throwable $th) {
            logger($th->getMessage());

            return response()->json(['message' => 'Oops! something went wrong, Please try again later'], 500);
        }
    }
    public function delete(Request $request)
    {
        if (! $request->ajax()) {
            return abort(404);
        }
        try {
            $obj = SellerDetails::where('id', request('id'))->limit(1)->first();
            if ($obj) {
                $delete = $obj->delete();
            }

            return response()->json(['message' => 'Deleted successfully'], 200);
        } catch (\Throwable $th) {
            logger($th->getMessage());

            return response()->json(['message' => 'Oops! something went wrong, Please try again later'], 500);
        }
    }
    public function getCategory($categories_id)
    {
        $subcategories = Category::where('categories_id', $categories_id)->where('status', 1)->latest()->get();
        return response()->json($subcategories);
    }
    public function getsubcategory($category_id)
    {
        $subcategory = SubCategory::where('category_id', $category_id)->where('status', 1)->latest()->get();
        return response()->json($subcategory);
    }
}
