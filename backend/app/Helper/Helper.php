<?php

namespace App\Helper;

use App\Models\Admin;
use App\Models\Register;
use App\Models\Notifications;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use App\Services\FCMService;

class Helper
{
    public static function isJson($string, $return_data = false, $returnArray = false)
    {
        $data = json_decode($string, $returnArray);

        return (json_last_error() == JSON_ERROR_NONE) ? ($return_data ? $data : true) : false;
    }

    public static function uploadImage(UploadedFile $image, string $path): string
    {
        // Ensure the directory exists
        if (! Storage::exists($path)) {
            // Create the directory
            Storage::makeDirectory($path);

            // Construct the full path to the directory
            $fullPath = storage_path('app/'.$path);

            // Set the correct permissions
            if (File::exists($fullPath)) {
                File::chmod($fullPath, 0777);
            }
        }

        $imageName = Str::random(10).'.'.$image->getClientOriginalExtension();
        Storage::putFileAs($path, $image, $imageName, 'public');

        return $imageName;
    }

    public static function reportError(string $message, array $data = [], array $notificationChannel = [], string $type = 'info')
    {
        if (in_array('slack', $notificationChannel)) {
            Log::channel('slack')->emergency($message, [
                'details' => $data,
                'request' => [
                    'url' => request()->fullUrl(),
                    'input' => request()->all(),
                ],
            ]);
        }
        if (in_array('mail', $notificationChannel)) {
            Log::channel('mail')->emergency($message, [
                'details' => $data,
                'request' => [
                    'url' => request()->fullUrl(),
                    'input' => request()->all(),
                ],
            ]);
        }

        Log::$type($message, $data);

        return true;
    }

    public static function getImageUrl($file, $filename = null)
    {
        if ($filename) {
            return Storage::url($file);
        }

        return self::dummyImage();
    }

    public static function dummyImage($text = 'Image', $size = '500x500')
    {
        return asset('admin-asset/images/200x200.png');
    }
    
    public static function getImageUrlCategories($file, $filename = null)
    {
        if ($filename) {
            return Storage::url($file);
        }

        return self::dummyImageCategories();
    }

    public static function dummyImageCategories($text = 'Image', $size = '500x500')
    {
        return asset('admin-asset/images/company_default.jpg');
    }
    
    public static function getImageUrlProfile($file, $filename = null)
    {
        if ($filename) {
            return Storage::url($file);
        }

        return self::dummyImageProfile();
    }
    public static function dummyImageProfile($text = 'Image', $size = '500x500')
    {
        return asset('admin-asset/images/profile_default_image.png');
    }

    public static function mimesFileValidation($type = 'image')
    {
        if ($type == 'image') {
            return 'mimes:jpg,jpeg,png';
        } elseif ($type == 'video') {
            $types = '3g2,3gp,aaf,asf,avchd,avi,drc,flv,m2v,m3u8,m4p,m4v,mkv,mng,mov,mp2,mp4,mpe,mpeg,mpg,mpv,mxf,nsv,ogg,ogv,qt,rm,rmvb,roq,svi,vob,webm,wmv,yu';

            return "mimes:{$types}";
        }
    }

    public static function removeLeadingZeroFromMobileNumber($phoneNumber)
    {
        // Remove all spaces
        $phoneNumber = str_replace(' ', '', $phoneNumber);
        // Check if the first character is a zero
        if (substr($phoneNumber, 0, 1) === '0') {
            // Remove the leading zero
            $phoneNumber = substr($phoneNumber, 1);
        }

        return $phoneNumber;
    }

    public static function getAdminMail()
    {
        $admin = Admin::first();

        return $admin->email ?? 'admin@admin.com';
    }

    public static function notifyToAdmin($message, $type, $relationId = null)
    {
        $notification = [
            'title' => $message,
            'type' => $type,
            'relation_id' => $relationId,
        ];

        AdminNotification::create($notification);
    }

    public static function adminNotifyDelete($type, $relationId)
    {
        if ($type && $relationId) {
            AdminNotification::where('type', $type)->where('relation_id', $relationId)->limit(1)->delete();
        }
    }
    
    public static function notifyToUser($notification_title,$notification_body,$notification_type,$notification_modules_type,$notification_relation_id,$notification_user_id,$notification_token_user_id,$categories_id = null)
    {
        // Save notification to database
        $notification = [
            'title' => $notification_title,
            'body' => $notification_body,
            'type' => $notification_type,
            'modules_type' => $notification_modules_type,
            'relation_id' => $notification_relation_id,
            'user_id' => $notification_user_id,
            'categories_id' => $categories_id,
        ];

        $userNotification = Notifications::create($notification);

        // Send push notification if device_token exists
        $register = Register::find($notification_token_user_id);
        if ($register && $register->fcm_token) {
            
            $fcmService = new FCMService;
            $fcmService->sendNotification(
                $register->fcm_token,
                $notification_title,
                $notification_body,
                ['notification_id' => $userNotification->id,'type' => $notification_type,'modules_type' => $notification_modules_type, 'relation_id' => $notification_relation_id, 'user_id' => $notification_user_id]
            );
        }
    }

}
