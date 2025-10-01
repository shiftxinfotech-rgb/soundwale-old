<?php

namespace App\Http\Controllers\Admin;

use App\Helper\Helper;
use App\Http\Controllers\Controller;
use App\Models\Register;
use App\Models\Role;
use App\Models\Categories;
use App\Models\Country;
use App\Models\States;
use App\Models\Cities;
use App\Models\DirectoryCataloguePdf;
use DataTables;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class RegisterControllers extends Controller
{
    public function list(Request $request)
    {
        if ($request->method() == 'POST' && $request->ajax()) {
            $query = Register::select('register.*','role.name as role_name','city.city_name as city_name')
            ->join('role', 'register.role_id', '=', 'role.id')
            ->join('city', 'register.city_id', '=', 'city.id')        
            ->latest();
            $query = $query->latest();
            
            if ($request->has('role_id') && !empty($request->role_id)) {
                $query->where('register.role_id', $request->role_id);
            }
            if (! $request->has('order')) {
                $query->orderBy('register.id', 'desc');
            }
            
            
//            $query = Register::select('id', 'image','email','status','role.name as role_name');
//            if ($request->has('role_id') && !empty($request->role_id)) {
//                $query->where('register.role_id', $request->role_id);
//            }
//            if (! $request->has('order')) {
//                $query->orderBy('id', 'desc');
//            }
            return DataTables::of($query)
                ->addColumn('action', function ($row) {
                    $viewRoute = "<a href='".route('admin.register.view', $row->id)."' class='btn btn-sm btn-clean btn-icon' title='View'><i class='flaticon-eye fa-lg'></i></a>";
                    $editRoute = "<a href='".route('admin.register.edit', $row->id)."'class='btn btn-sm btn-clean btn-icon' title='Edit details'><i class='flaticon2-pen'></i></a>";
                    $deleteRoute = "<a href='".route('admin.register.delete')."' data-id='".$row->id."' data-title='Delete ?' data-text='Are you sure you want to delete ?' class='btn btn-sm btn-clean btn-icon delete-record' title='Delete'><i class='flaticon2-trash'></i></a>";

                    return "{$editRoute}{$viewRoute}{$deleteRoute}";
                })
                ->rawColumns(['action'])
                ->make(true);
        }

        $role = Role::select('*')->where('status', 1)->latest()->get();
        return view('admin.register.list', compact('role'));
    }

    public function add($id = null)
    {
        $data = null;
        $catalogue_data = null;
        $role = Role::select('id', 'name')->where('status', 1)->latest()->get();
        $country = Country::select('id', 'country_name')->where('is_enable', 1)->latest()->get();
        $company = Categories::select('id', 'name')->where('status', 1)->latest()->get();
        if ($id) {
            $data = Register::select('*')->findOrFail($id);
        }
        
        return view('admin.register.add', compact('data','role','country','catalogue_data','company'));
    }

    public function view($id)
    {
        $catalogue_data = null;
        if ($id) {
        }
        $data = Register::with('country','state', 'city')->findOrFail($id);
//        $data = Register::findOrFail($id);
        return view('admin.register.view', compact('data','catalogue_data'));
    }
    
    public function store(Request $request)
    {
        $request->validate([
            'email' => ['required','email',Rule::unique('register', 'email')->ignore($request->edit_id)],
            'role_id' => 'required',
            'mobile_number' => ['required',Rule::unique('register', 'mobile_number')->ignore($request->edit_id)],
        ]);

        try {
            $validate = $request->only('image','name','youtube_link','mobile_number','code','email','role_id','status','country_id','state_id','city_id','village','location','latitude','longitude','facebook_link','instagram_link','web_link','sound_farm_name','visiting_card_image','description','authorised_dealer_company_name','company_about','company_name','catalogue_type','catalogue_pdf','catalogue_website','dealer_list_area_wise_type','dealer_list_area_wise_pdf','dealer_list_area_wise_website','taluka','district','extra_mobile_number');
            if ($request->hasFile('image')) {
                $validate['image'] = Helper::uploadImage($request->image, Register::IMAGE_PATH);
            }
            if ($request->hasFile('visiting_card_image')) {
                $validate['visiting_card_image'] = Helper::uploadImage($request->visiting_card_image, Register::IMAGE_PATH);
            }
            if ($request->hasFile('catalogue_pdf')) {
                $validate['catalogue_pdf'] = Helper::uploadImage($request->catalogue_pdf, Register::IMAGE_PATH);
            }
            if ($request->hasFile('dealer_list_area_wise_pdf')) {
                $validate['dealer_list_area_wise_pdf'] = Helper::uploadImage($request->dealer_list_area_wise_pdf, Register::IMAGE_PATH);
            }
            $mobile_array = array();
            if($request->input('extra_mobile_number')){
                $counterr = 0;
                foreach($request->input('extra_mobile_number') as $keyy => $mobile_array_val){
                    if(isset($mobile_array_val['name'])){
                        $mobile_array[$counterr]['name'] = $mobile_array_val['name'];
                        $mobile_array[$counterr]['mobile_number'] = $mobile_array_val['mobile_number'];
                        $mobile_array[$counterr]['code'] = $mobile_array_val['code'];
                        $mobile_array[$counterr]['code_sort'] = $mobile_array_val['code_sort'];
                        $counterr++;
                    }
                }
            }
            $validate['status'] = $request->has('status') ? $request->get('status') : 1;
            $validate['mobile_number'] = str_replace(' ', '', $request->mobile_number);
            $validate['company_name'] = $request->input('company_name') ? json_encode($request->input('company_name')) : Null;
            $validate['role_id'] = $request->input('role_id') ? implode(',', $request->input('role_id')) : NULL;
            $validate['extra_mobile_number'] = $mobile_array ? json_encode($mobile_array) : NULL;
            $obj = ($request->edit_id) ? Register::where('id', $request->edit_id)->first() : new Register;
            $obj->fill($validate);
            $obj->save();

            if ($request->edit_id) {
                $lastInsertedId = $request->edit_id;
            }else{
                $lastInsertedId = $obj->id;
            }
            
//            if ($request->hasFile('catalogue_pdf')) {
//                $names_array = $request->input('catalogue_name');
//                foreach ($request->file('catalogue_pdf') as $key3 => $file1) {
//                    $validate3['directory_id'] = $lastInsertedId;
//                    $validate3['name'] = $names_array[$key3];
//                    $validate3['image'] = Helper::uploadImage($file1, DirectoryCataloguePdf::IMAGE_PATH);
//                    $catalogue_data = new DirectoryCataloguePdf();
//                    $catalogue_data->fill( $validate3 );
//                    $catalogue_data->save();
//                }
//            }
            return response()->json(['message' => ($request->edit_id) ? 'Update successfully' : 'Added successfully'], 200);
        } catch (\Throwable $th) {
            logger($th->getMessage());

            return response()->json(['message' => 'Oops! something went wrong, Please try again later'], 500);
        }
    }

    public function statusChange(Request $request)
    {
        if (! $request->ajax()) {
            return abort(404);
        }

        $request->validate([
            'id' => 'required|exists:register,id',
            'status' => 'required',
        ]);

        try {
            $obj = Register::where('id', request('id'))->limit(1)->first();
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
            $obj = Register::where('id', request('id'))->limit(1)->first();
            if ($obj) {
                $delete = $obj->delete();
            }

            return response()->json(['message' => 'Deleted successfully'], 200);
        } catch (\Throwable $th) {
            logger($th->getMessage());

            return response()->json(['message' => 'Oops! something went wrong, Please try again later'], 500);
        }
    }
    
    public function getState($country_id)
    {
        $states = States::where('id_country', $country_id)->where('is_enable', 1)->latest()->get();
        return response()->json($states);
    }
    public function getCity($state_id)
    {
        $city = Cities::where('id_state', $state_id)->where('is_enable', 1)->latest()->get();
        return response()->json($city);
    }
}
