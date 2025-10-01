<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Register;
use App\Models\Notifications;
use App\Models\Admin;
use App\Models\MailConfiguration;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Mail;
use App\Mail\ContactUsMail;
use App\Mail\ContactUsMailAdmin;
use App\Traits\ApiPaginationTrait;
use Carbon\Carbon;

class NotificationController extends Controller {

    public function Update_Fcm_Token(Request $request) {
        $user = Auth::user();
        $validator = Validator::make($request->all(), [
                    'fcm_token' => 'required',
                        ], [
                    'fcm_token.required' => 'The fcm token field is required.',
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => false, 'message' => $validator->errors()], 400);
        }

        try {
            $exists = Register::where('id', $user->id)->select('id')->first();
            if ($exists) {
                Register::where('id', $exists->id)->update(['fcm_token' => $request->fcm_token]);

                return response()->json(['status' => true, 'message' => 'FCM token updated successfully.'], 200);
            } else {
                return response()->json(['status' => false, 'message' => 'ID does not exist'], 404);
            }
            return response()->json(['status' => false, 'message' => 'Oops! Something went wrong. Please try again later.'], 500);
        } catch (\Throwable $th) {
            \Log::error(request()->path() . "\n" . $th->getMessage());
            return response()->json(['status' => false, 'message' => 'Oops! Something went wrong. Please try again later.'], 500);
        }
    }

    private function getPaginationInformation($currentPage, $recordPerPage) {
        return [
            'page' => (int) ($currentPage ?? 1),
            'limit' => (int) ($recordPerPage ?? 15),
        ];
    }

    public function Get_All(Request $request) {
        $user = Auth::user();

        $currentPage = $request->input('page', 1);
        $recordPerPage = $request->input('limit', 15);

        // Apply custom pagination logic
        $pagination = $this->getPaginationInformation($currentPage, $recordPerPage);

        // Paginate user notifications
        $query = Notifications::select('id', 'title', 'body', 'type', 'modules_type', 'relation_id', 'read', 'created_at')
                ->where('user_id', $user->id)
                ->orderByDesc('id')
                ->paginate(
                $pagination['limit'], ['*'], 'page', $pagination['page']
        );
        $transformedData = $query->getCollection()
                ->map(function ($notification) {
                    $notification->created_at_human = Carbon::parse($notification->created_at)->diffForHumans();
                    $notification->date_group = Carbon::parse($notification->created_at)->toDateString();
                    return $notification;
                })
                ->groupBy('date_group')
                ->map(function ($group, $date) {
                    return [
                        'date' => $date,
                        'notifications' => $group->values(),
                    ];
                })
                ->values()
                ->toArray();

        // Prepare result structure     
        $result = [
            'data' => $transformedData,
            'meta' => [
                'current_page' => $query->currentPage(),
                'per_page' => $query->perPage(),
                'next_page_url' => $query->nextPageUrl(),
                'has_more_pages' => $query->hasMorePages(),
                'total' => $query->total(),
            ],
        ];

        return response()->json([
                    'status' => true,
                    'data' => $result
                        ], 200);
    }

    public function Unread_Count(Request $request) {
        $user = Auth::user();

        try {
            $data['unread_count'] = Notifications::where('user_id', $user->id)->where('read', 0)->count();
            return response()->json(['status' => true, 'data' => $data], 200);
        } catch (\Throwable $th) {
            \Log::error(request()->path() . "\n" . $th->getMessage());
            return response()->json(['status' => false, 'message' => 'Oops! Something went wrong. Please try again later.'], 500);
        }
    }

    public function Mark_All_Read(Request $request) {
        $user = Auth::user();

        try {
            Notifications::where('user_id', $user->id)->where('read', 0)->update(['read' => 1]);
            return response()->json(['status' => true, 'data' => null, 'message' => "Updated successfully."], 200);
        } catch (\Throwable $th) {
            \Log::error(request()->path() . "\n" . $th->getMessage());
            return response()->json(['status' => false, 'message' => 'Oops! Something went wrong. Please try again later.'], 500);
        }
    }

    public function Delete_By_Id(Request $request) {
        $user = Auth::user();
        $validator = Validator::make($request->all(), [
                    'id' => 'required',
                        ], [
                    'id.required' => 'The id field is required.',
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => false, 'message' => $validator->errors()], 400);
        }

        try {
            Notifications::where('id', $request->id)->where('user_id', $user->id)->delete();

            return response()->json(['status' => true, 'data' => null, 'message' => "Notifications deleted successfully."], 200);
        } catch (\Throwable $th) {
            \Log::error(request()->path() . "\n" . $th->getMessage());
            return response()->json(['status' => false, 'message' => 'Oops! Something went wrong. Please try again later.'], 500);
        }
    }
    
    public function Mark_Read_By_Id(Request $request) {
        $user = Auth::user();
        $validator = Validator::make($request->all(), [
                    'id' => 'required',
                        ], [
                    'id.required' => 'The id field is required.',
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => false, 'message' => $validator->errors()], 400);
        }

        try {
            Notifications::where('id', $request->id)->where('read', 0)->update(['read' => 1]);

            return response()->json(['status' => true, 'data' => null, 'message' => "Notifications updated successfully."], 200);
        } catch (\Throwable $th) {
            \Log::error(request()->path() . "\n" . $th->getMessage());
            return response()->json(['status' => false, 'message' => 'Oops! Something went wrong. Please try again later.'], 500);
        }
    }
    
}
