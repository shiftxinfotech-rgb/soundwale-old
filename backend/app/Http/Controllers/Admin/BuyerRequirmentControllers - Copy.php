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
use App\Models\BuyerRequirment;
use App\Models\BuyerRequirmentImages;
use App\Models\Cities;
use DataTables;
use Illuminate\Http\Request;
use DB;

class BuyerRequirmentControllers extends Controller
{
    public function list(Request $request)
    {
        if($request->method() == 'POST'){
            $query = BuyerRequirment::select('buyer_requirment.id', 'buyer_requirment.user_id','buyer_requirment.city_id', 'buyer_requirment.status', 'buyer_requirment.created_at', 'categories.name as main_category_name', 'register.name as user_name', 'register.email as user_email', 'register.mobile_number as user_mobile_number', 'register.code as user_mobile_code', 'category.name as category_name', 'city.city_name as city_name')
            ->join('categories', 'buyer_requirment.categories_id', '=', 'categories.id')
            ->join('category', 'buyer_requirment.category_id', '=', 'category.id')
            ->join('register', 'buyer_requirment.user_id', '=', 'register.id')
            ->join('city', 'buyer_requirment.city_id', '=', 'city.id')
            ->latest();
            $query = $query->latest();

            return DataTables::of($query)

            ->addColumn('action', function($row){
                $viewRoute = "<a href='".route('admin.buyer_requirment.view', $row->id)."' class='btn btn-icon btn-outline-brand btn-sm'  title='View details'><i class='flaticon-eye fa-lg'></i></a>&nbsp;";
                $deleteRoute = "<a href='".route('admin.buyer_requirment.delete')."' data-id='".$row->id."' class='delete-record btn btn-icon btn-outline-danger btn-sm' title='Delete'><i class='la la-trash'></i></a>&nbsp;";

                $viewRoute   = $viewRoute ? $viewRoute : null;
                $deleteRoute = $deleteRoute ? $deleteRoute : null;

                return "{$viewRoute}{$deleteRoute}";
            })
            ->addColumn('full_mobile', function ($row) {
                    return ($row->user_mobile_code ? $row->user_mobile_code . ' ' : '') . $row->user_mobile_number;
                })
                ->filterColumn('full_mobile', function ($query, $keyword) {
                    $query->whereRaw("CONCAT(code, ' ', mobile_number) LIKE ?", ["%{$keyword}%"]);
                })
            ->rawColumns(['action'])
            ->make(true);
        }

        return view('admin.buyer_requirment.list');
    }

    

    public function view($id)
    {
        $data = BuyerRequirment::with('categories','category', 'sub_category','country','states','cities')->findOrFail($id);
        $roleIds = explode(',', $data->role_id);
        $roleNames = DB::table('role')
        ->whereIn('id', $roleIds)
        ->pluck('name')
        ->toArray();
        $data->role_names = implode(',', $roleNames);
        if($data->product_id != "[]" && $data->product_id != NULL){
            $productIds = explode(',', $data->product_id);
            $manufacturerNames = DB::table('manufacturer')
            ->whereIn('id', $productIds)
            ->pluck('name')
            ->toArray();
            $data->manufacturer_names = implode(',', $manufacturerNames);
        }
        $images_data = BuyerRequirmentImages::where('buyer_requirment_id', $id)->get();

        return view('admin.buyer_requirment.view', compact('data','images_data'));
    }

    public function statusChange(Request $request)
    {
        if (! $request->ajax()) {
            return abort(404);
        }

        $request->validate([
            'id' => 'required|exists:buyer_requirment,id',
            'status' => 'required',
        ]);

        try {
            $obj = BuyerRequirment::where('id', request('id'))->limit(1)->first();
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
            $obj = BuyerRequirment::where('id', request('id'))->limit(1)->first();
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
    public function gallery_image_delete(Request $request)
    {
        $path = $request->input('path');
        
            $obj = BuyerRequirmentImages::where('id', $request->id)->limit(1)->first();
            if ($obj) {
                $delete = $obj->delete();
            }

            return response()->json(['success' => true], 200);
    }
}
