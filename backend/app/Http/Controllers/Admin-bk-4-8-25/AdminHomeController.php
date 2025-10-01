<?php



namespace App\Http\Controllers\Admin;



use App\Helper\Helper;
use App\Http\Controllers\Controller;
use App\Models\CmsPages;
use App\Models\ContactUs;
use App\Models\HomeSliders;
use App\Models\JobPosting;
use App\Models\User;
use App\Models\Teams;
use App\Models\Testimonials;
use App\Models\Banner;
use App\Models\BrowseByPositions;
use App\Models\Leaders;
use App\Models\SubmitRole;
use App\Models\TalentSeeker;
use App\Models\Solutions;
use App\Models\OurValues;
use App\Models\ApplyJobs;
use Illuminate\Http\Request;

class AdminHomeController extends Controller
{

    /**
     * Create a new controller instance.
     *
     * @return void
     */

    public function __construct()
    {
        // $this->middleware('auth');
    }
    /**
     * Show the application dashboard.
     *
     * @return \Illuminate\Contracts\Support\Renderable
     */
    public function index()
    {

        $data['services_count'] = JobPosting::count();
        $data['cms_page_count'] = CmsPages::count();
        $data['home_slider_count'] = HomeSliders::count();
        $data['contact_us_count'] = ContactUs::count();
        $data['testimonial_count'] = Testimonials::count();
        $data['Banner_count'] = Banner::count();
        $data['BrowseByPositions_count'] = BrowseByPositions::count();
        $data['Leaders_count'] = Leaders::count();
        $data['SubmitRole_count'] = SubmitRole::count();
        $data['Career_count'] = TalentSeeker::count();
        $data['Teams'] = Teams::count();
        $data['Solutions'] = Solutions::count();
        $data['ApplyJobs'] = ApplyJobs::count();
        $data['OurValues'] = OurValues::count();

        $data['services_chart'] = JobPosting::selectRaw('COUNT(*) as count, MONTH(created_at) as month')
            ->groupBy('month')
            ->orderBy('month')
            ->get()
            ->pluck('count', 'month')
            ->toArray();

        $services_chart = [];
        for ($month = 1; $month <= 12; $month++) {
            $services_chart[$month] = isset($data['services_chart'][$month]) ? $data['services_chart'][$month] : 0;
        }

        $data['services_chart'] = $services_chart;

        $data['TalentSeeker_chart'] = TalentSeeker::selectRaw('COUNT(*) as count, MONTH(created_at) as month')
            ->groupBy('month')
            ->orderBy('month')
            ->get()
            ->pluck('count', 'month')
            ->toArray();

        $TalentSeeker_chart = [];
        for ($month = 1; $month <= 12; $month++) {
            $TalentSeeker_chart[$month] = isset($data['TalentSeeker_chart'][$month]) ? $data['TalentSeeker_chart'][$month] : 0;
        }

        $data['TalentSeeker_chart'] = $TalentSeeker_chart;

        $data['SubmitRole_chart'] = SubmitRole::selectRaw('COUNT(*) as count, MONTH(created_at) as month')
            ->groupBy('month')
            ->orderBy('month')
            ->get()
            ->pluck('count', 'month')
            ->toArray();

        $SubmitRole_chart = [];
        for ($month = 1; $month <= 12; $month++) {
            $SubmitRole_chart[$month] = isset($data['SubmitRole_chart'][$month]) ? $data['SubmitRole_chart'][$month] : 0;
        }

        $data['SubmitRole_chart'] = $SubmitRole_chart;

        $data['ApplyJobs_chart'] = ApplyJobs::selectRaw('COUNT(*) as count, MONTH(created_at) as month')
            ->groupBy('month')
            ->orderBy('month')
            ->get()
            ->pluck('count', 'month')
            ->toArray();

        $ApplyJobs_chart = [];
        for ($month = 1; $month <= 12; $month++) {
            $ApplyJobs_chart[$month] = isset($data['ApplyJobs_chart'][$month]) ? $data['ApplyJobs_chart'][$month] : 0;
        }

        $data['ApplyJobs_chart'] = $ApplyJobs_chart;

        return view('admin.dashboard', compact('data'));

    }

    public function storeImage(Request $request)
    {
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

