<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\ContactUs;
use App\Models\DeleteAccountRequest;
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

class ContactUsController extends Controller
{

    public function lists(Request $request) {
        
        $data = ContactUs::select('name','email','country_code','mobile_number','subject','message')->get();
        if (!$data) {
            return response()->json(['status' => false, 'message' => 'Details not found.'], 404);
        }

        return response()->json(['status' => true, 'data' => $data], 200);
    }
    
    public function Contacussave(Request $request)
    {
        $user = Auth::user();

        $validator = Validator::make($request->all(), [
            'name'    => 'required|string',
            'email'   => 'required|email',
            'message' => 'required|string',
            'mobile_number'   => 'required|string',
            'country_code'    => 'required|string',
        ],[
            'name.required'    => 'The name field is required.',
            'email.required'   => 'The email field is required.',
            'message.required' => 'The message field is required.',
            'mobile_number.required'   => 'The mobile_number field is required.',
            'country_code.required'    => 'The country code field is required.',
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => false,'message' => $validator->errors()], 400);
        }

        try {
            // Prepare data for saving and email
            $data = $request->only('name','email','country_code','mobile_number','subject','message');

            $userContactUs = new ContactUs($data);

            if ($userContactUs->save()) {
                // Prepare email data
//                $mailData = [
//                    'title'      => env('MAIL_FROM_NAME'),
//                    'subject'    => 'Contact-Us From ' . env('APP_NAME'),
//                    'to_name'    => $request->name,
//                    'user_type'  => $user->user_type,
//                    'to_email'   => $request->email,
//                    'to_message' => $request->message,
//                    'to_phone'   => $phoneWithCode,
//                ];
//
//                // Retrieve mail configuration
//                $mailConfig = MailConfiguration::first();
//                $admin = Admin::first();
//                if ($mailConfig) {
//                    Config::set('mail.mailers.smtp', [
//                        'transport'  => $mailConfig->mail_mailer,
//                        'host'       => $mailConfig->mail_host,
//                        'port'       => $mailConfig->mail_port,
//                        'encryption' => $mailConfig->mail_encryption,
//                        'username'   => $mailConfig->mail_username,
//                        'password'   => $mailConfig->mail_password,
//                    ]);
//
//                    Config::set('mail.from.address', $mailConfig->mail_from_address);
//                    Config::set('mail.from.name', $mailConfig->mail_from_name);
//                }
//
//                // Send emails
//                Mail::to($request->email)->send(new ContactUsMail($mailData));
//                Mail::to($admin->email)->send(new ContactUsMailAdmin($mailData));

                return response()->json([
                    'status' => true,
                    'message' => 'Your request was sent successfully. We will contact you soon.'
                ], 200);
            }

            return response()->json(['status' => false,'message' => 'Oops! Something went wrong. Please try again later.'], 500);
        } catch (\Throwable $th) {
            \Log::error(request()->path() . "\n" . $th->getMessage());
            return response()->json(['status' => false,'message' => 'Oops! Something went wrong. Please try again later.'], 500);
        }
    }

    public function delete_account_request(Request $request)
    {
        $user = Auth::user();

        $validator = Validator::make($request->all(), [
            'description'    => 'required',
        ],[
            'description.required'    => 'The description field is required.',
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => false,'message' => $validator->errors()], 400);
        }

        try {
            $data = $request->only('user_id','description','status');
            $data['user_id'] = $user->id;
            $exists = DeleteAccountRequest::where('user_id', $user->id)->exists();
            if ($exists) {
                return response()->json([
                            'status' => false,
                            'message' => 'Request already exist.'
                                ], 404);
            } else {
                $dataa = new DeleteAccountRequest($data);
                if ($dataa->save()) {
                    return response()->json([
                                'status' => true,
                                'message' => 'Your request has been successfully sent to admin for account deletion.'
                                    ], 200);
                }
            }
            
        } catch (\Throwable $th) {
            \Log::error(request()->path() . "\n" . $th->getMessage());
            return response()->json(['status' => false,'message' => 'Oops! Something went wrong. Please try again later.'], 500);
        }
    }

}
