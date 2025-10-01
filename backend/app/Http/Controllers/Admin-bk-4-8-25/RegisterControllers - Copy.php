<?php

namespace App\Http\Controllers\Admin;

use App\Helper\Helper;
use App\Http\Controllers\Controller;
use App\Models\Register;
use App\Models\Role;
use App\Models\Country;
use App\Models\States;
use App\Models\Cities;
use DataTables;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class RegisterControllers extends Controller
{
    public function list(Request $request)
    {
        if ($request->method() == 'POST' && $request->ajax()) {
            $query = Register::select('id', 'image','email','status');

            if (! $request->has('order')) {
                $query->orderBy('id', 'desc');
            }
            return DataTables::of($query)
                ->addColumn('action', function ($row) {
                    $editRoute = "<a href='".route('admin.register.edit', $row->id)."'class='btn btn-sm btn-clean btn-icon' title='Edit details'><i class='flaticon2-pen'></i></a>";
                    $deleteRoute = "<a href='".route('admin.register.delete')."' data-id='".$row->id."' data-title='Delete ?' data-text='Are you sure you want to delete ?' class='btn btn-sm btn-clean btn-icon delete-record' title='Delete'><i class='flaticon2-trash'></i></a>";

                    return "{$editRoute}{$deleteRoute}";
                })
                ->rawColumns(['action'])
                ->make(true);
        }

        return view('admin.register.list');
    }

    public function add($id = null)
    {
        $data = null;
        $role = Role::select('id', 'name')->where('status', 1)->latest()->get();
        $country = Country::select('id', 'country_name')->where('is_enable', 1)->latest()->get();
        if ($id) {
            $data = Register::select('id','image','name','email','role_id','password','status','mobile_number','code','available_on_whatsapp_with_same_number','whatsapp','code2','country_id','state_id','city_id')->findOrFail($id);
        }

        return view('admin.register.add', compact('data','role','country'));
    }

    public function store(Request $request)
    {
        $request->validate([], []);

        try {
            $validate = $request->only('image','name','mobile_number','code','available_on_whatsapp_with_same_number','whatsapp','code2','email','role_id','password','status','country_id','state_id','city_id');
            if ($request->hasFile('image')) {
                $validate['image'] = Helper::uploadImage($request->image, Register::IMAGE_PATH);
            }
            $validate['status'] = $request->has('status') ? $request->get('status') : 1;
            $validate['password'] = Hash::make($request->get('password'));
            $obj = ($request->edit_id) ? Register::where('id', $request->edit_id)->first() : new Register;
            $obj->fill($validate);
            $obj->save();

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
