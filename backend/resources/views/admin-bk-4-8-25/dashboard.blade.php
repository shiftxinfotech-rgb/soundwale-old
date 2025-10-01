@extends('admin.layouts.default')
@section('title', 'Dashboard')
@section('content')
    <!-- begin:: Content Head -->
    <div class="kt-subheader   kt-grid__item" id="kt_subheader">
        <div class="kt-subheader__main">
            <h3 class="kt-subheader__title">Dashboard</h3>
            <span class="kt-subheader__separator kt-subheader__separator--v"></span>
        </div>
    </div>
    <!-- end:: Content Head -->
    <!-- begin:: Content -->
    <div class="kt-content  kt-grid__item kt-grid__item--fluid" id="kt_content">

        <div class="row">
            {{-- <div class="col-lg-12">
                <!--begin:: Widgets/Blog-->
                <div class="kt-portlet kt-portlet--height-fluid kt-widget19">
                    <div class="kt-portlet__body kt-portlet__body--fit kt-portlet__body--unfill">
                        <div class="kt-widget19__pic kt-portlet-fit--top kt-portlet-fit--sides"
                            style="min-height: 300px; background-image: url({{ asset('admin-asset/images/media/bg/c4.jpg') }})">
                            <h3 class="kt-widget19__title kt-font-light">
                                Welcome to the Admin Dashboard!
                            </h3>
                            <div class="kt-widget19__shadow"></div>

                        </div>
                    </div>
                    <div class="kt-portlet__body">
                        <div class="kt-widget19__wrapper">
                            <div class="kt-widget19__content">
                                <div class="kt-widget19__userpic">
                                    <img src=" {{ Auth::user()->image_url }}" alt="">
                                </div>
                                <div class="kt-widget19__info">
                                    <a href="javascript:;" class="kt-widget19__username">
                                        {{ Auth::user()->first_name }} {{ Auth::user()->last_name }}
                                    </a>
                                    <span class="kt-widget19__time">
                                        Admin
                                    </span>
                                </div>

                            </div>
                            <div class="kt-widget19__text">
                                Hello, Admin! We're glad to have you back. Here, you can manage and oversee all activities,
                                track key metrics, and stay updated on the latest notifications. Your dedication keeps
                                everything running smoothly — thank you for all your hard work!
                            </div>
                        </div>

                    </div>
                </div>
            </div> --}}
            <div class="col-lg-6">
                <div class="kt-portlet kt-portlet--fit kt-portlet--head-noborder ">
                    <div class="kt-portlet__head kt-portlet__space-x">
                        <div class="kt-portlet__head-label">
                            <h3 class="kt-portlet__head-title">
                                Job Seeker
                            </h3>
                        </div>
                    </div>
                    <div class="kt-portlet__body kt-portlet__body--fluid">
                        <div class="kt-widget20">
                            <div class="kt-widget20__content kt-portlet__space-x">
                                <span class="kt-widget20__number kt-font-brand">{{ $data['services_count'] }}</span>
                                <span class="kt-widget20__desc">Job Seeker</span>
                            </div>
                            <div class="kt-widget20__chart" style="height:130px;">
                                <canvas id="kt_chart_bandwidth1"></canvas>
                            </div>
                        </div>
                    </div>
                </div>

                <!--end:: Widgets/Inbound Bandwidth-->
                <div class="kt-space-20"></div>

            </div>
            <div class="col-lg-6">
                <div class="kt-portlet kt-portlet--fit kt-portlet--head-noborder ">
                    <div class="kt-portlet__head kt-portlet__space-x">
                        <div class="kt-portlet__head-label">
                            <h3 class="kt-portlet__head-title">
                                Hiring Talent
                            </h3>
                        </div>
                    </div>
                    <div class="kt-portlet__body kt-portlet__body--fluid">
                        <div class="kt-widget20">
                            <div class="kt-widget20__content kt-portlet__space-x">
                                <span class="kt-widget20__number kt-font-brand">{{ $data['Career_count'] }}</span>
                                <span class="kt-widget20__desc">Hiring Talent </span>
                            </div>
                            <div class="kt-widget20__chart" style="height:130px;">
                                <canvas id="kt_chart_bandwidth2"></canvas>
                            </div>
                        </div>
                    </div>
                </div>

                <!--end:: Widgets/Inbound Bandwidth-->
                <div class="kt-space-20"></div>

            </div>

<!--            <div class="col-lg-6">
                <div class="kt-portlet kt-portlet--fit kt-portlet--head-noborder ">
                    <div class="kt-portlet__head kt-portlet__space-x">
                        <div class="kt-portlet__head-label">
                            <h3 class="kt-portlet__head-title">
                                Submit Role
                            </h3>
                        </div>
                    </div>
                    <div class="kt-portlet__body kt-portlet__body--fluid">
                        <div class="kt-widget20">
                            <div class="kt-widget20__content kt-portlet__space-x">
                                <span class="kt-widget20__number kt-font-brand">{{ $data['SubmitRole_count'] }}</span>
                                <span class="kt-widget20__desc">Submit Role </span>
                            </div>
                            <div class="kt-widget20__chart" style="height:130px;">
                                <canvas id="kt_chart_bandwidth3"></canvas>
                            </div>
                        </div>
                    </div>
                </div>

                end:: Widgets/Inbound Bandwidth
                <div class="kt-space-20"></div>

            </div>

            <div class="col-lg-6">
                <div class="kt-portlet kt-portlet--fit kt-portlet--head-noborder ">
                    <div class="kt-portlet__head kt-portlet__space-x">
                        <div class="kt-portlet__head-label">
                            <h3 class="kt-portlet__head-title">
                                Apply Job
                            </h3>
                        </div>
                    </div>
                    <div class="kt-portlet__body kt-portlet__body--fluid">
                        <div class="kt-widget20">
                            <div class="kt-widget20__content kt-portlet__space-x">
                                <span class="kt-widget20__number kt-font-brand">{{ $data['ApplyJobs'] }}</span>
                                <span class="kt-widget20__desc">Apply Job </span>
                            </div>
                            <div class="kt-widget20__chart" style="height:130px;">
                                <canvas id="kt_chart_bandwidth4"></canvas>
                            </div>
                        </div>
                    </div>
                </div>

                end:: Widgets/Inbound Bandwidth
                <div class="kt-space-20"></div>

            </div>-->
            <div class="col-lg-12">

                <!--begin:: Widgets/Notifications-->
                <div class="kt-portlet kt-portlet--height-fluid">
                    <div class="kt-portlet__head">
                        <div class="kt-portlet__head-label">
                            <h3 class="kt-portlet__head-title">
                                Notifications
                            </h3>
                        </div>
                    </div>
                    <div class="kt-portlet__body">
                        <div class="tab-content">
                            <div class="tab-pane active kt-scroll ps ps--active-y" id="kt_widget6_tab1_content"
                                data-scroll="true" style="height: 200px; overflow: hidden;" aria-expanded="true">
                                <div class="kt-notification custom_notifys">

                                </div>
                                <div class="no-notifications-message" style="display: none;">
                                    <div class="kt-grid kt-grid--ver" style="min-height: 200px;">
                                        <div
                                            class="kt-grid kt-grid--hor kt-grid__item kt-grid__item--fluid kt-grid__item--middle">
                                            <div class="kt-grid__item kt-grid__item--middle kt-align-center">
                                                All caught up!
                                                <br>No new notifications.
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!--end:: Widgets/Notifications-->
            </div>
            <div class="col-xl-4">

                <!--begin:: Widgets/Activity-->
                <div
                    class="kt-portlet kt-portlet--fit kt-portlet--head-lg kt-portlet--head-overlay kt-portlet--skin-solid kt-portlet--height-fluid">
                    <div class="kt-portlet__head kt-portlet__head--noborder kt-portlet__space-x">
                        <div class="kt-portlet__head-label">
                            <h3 class="kt-portlet__head-title">

                            </h3>
                        </div>
                    </div>
                    <div class="kt-portlet__body kt-portlet__body--fit">
                        <div class="kt-widget17">
                            <div class="kt-widget17__visual kt-widget17__visual--chart kt-portlet-fit--top kt-portlet-fit--sides"
                                style=" background-image: url({{ asset('admin-asset/images/media/bg/400.jpg') }}">
                                <div class="kt-widget17__chart" style="height:170px;">
                                    <canvas id="kt_chart_activities"></canvas>
                                </div>
                            </div>
                            <div class="kt-widget17__stats">
                                <div class="kt-widget17__items">
                                    <div class="kt-widget17__item">
                                        <a href="{{ route('admin.home.slider.list') }}">
                                            <span class="kt-widget17__icon">
                                                <i class="fa fa-images"></i>
                                            </span>
                                            <span class="kt-widget17__subtitle">
                                                Home Slider
                                            </span>
                                            <span class="kt-widget17__desc">
                                                {{ $data['home_slider_count'] }} Total Home Slider
                                            </span>
                                        </a>
                                    </div>
                                    <div class="kt-widget17__item">
                                        <a href="{{ route('admin.talent.seeker.list') }}">
                                            <span class="kt-widget17__icon">
                                                <svg class="kt-svg-icon kt-svg-icon--success"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    xmlns:xlink="http://www.w3.org/1999/xlink" width="24px"
                                                    height="24px" viewBox="0 0 24 24" version="1.1"
                                                    class="kt-svg-icon">
                                                    <g stroke="none" stroke-width="1" fill="none"
                                                        fill-rule="evenodd">
                                                        <rect id="bound" x="0" y="0" width="24" height="24" />
                                                        <path
                                                            d="M14.2928932,16.7071068 C13.9023689,16.3165825 13.9023689,15.6834175 14.2928932,15.2928932 C14.6834175,14.9023689 15.3165825,14.9023689 15.7071068,15.2928932 L19.7071068,19.2928932 C20.0976311,19.6834175 20.0976311,20.3165825 19.7071068,20.7071068 C19.3165825,21.0976311 18.6834175,21.0976311 18.2928932,20.7071068 L14.2928932,16.7071068 Z"
                                                            id="Path-2" fill="#000000" fill-rule="nonzero"
                                                            opacity="0.3" />
                                                        <path
                                                            d="M11,16 C13.7614237,16 16,13.7614237 16,11 C16,8.23857625 13.7614237,6 11,6 C8.23857625,6 6,8.23857625 6,11 C6,13.7614237 8.23857625,16 11,16 Z M11,18 C7.13400675,18 4,14.8659932 4,11 C4,7.13400675 7.13400675,4 11,4 C14.8659932,4 18,7.13400675 18,11 C18,14.8659932 14.8659932,18 11,18 Z"
                                                            id="Path" fill="#000000" fill-rule="nonzero" />
                                                    </g>
                                                </svg> </span>
                                            <span class="kt-widget17__subtitle">
                                                Hiring Talent
                                            </span>
                                            <span class="kt-widget17__desc">
                                                {{ $data['Career_count'] }} Total Hiring Talent
                                            </span>
                                        </a>
                                    </div>

                                    <div class="kt-widget17__item">
                                        <a href="{{ route('admin.testimonials.list') }}">
                                            <span class="kt-widget17__icon ">
                                                <i class="fa fa-comments text-warning"></i></span>
                                            <span class="kt-widget17__subtitle">
                                                Testimonials
                                            </span>
                                            <span class="kt-widget17__desc">
                                                {{ $data['testimonial_count'] }} Total Testimonials
                                            </span>
                                        </a>
                                    </div>
                                </div>

                                <div class="kt-widget17__items">

                                    <div class="kt-widget17__item">
                                        <a href="{{ route('admin.job.posting.list') }}">
                                            <span class="kt-widget17__icon">
                                                <svg class="kt-svg-icon kt-svg-icon--danger"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    xmlns:xlink="http://www.w3.org/1999/xlink" width="24px"
                                                    height="24px" viewBox="0 0 24 24" version="1.1"
                                                    class="kt-svg-icon">
                                                    <g stroke="none" stroke-width="1" fill="none"
                                                        fill-rule="evenodd">
                                                        <rect id="bound" x="0" y="0" width="24" height="24" />
                                                        <path
                                                            d="M10.5,5 L19.5,5 C20.3284271,5 21,5.67157288 21,6.5 C21,7.32842712 20.3284271,8 19.5,8 L10.5,8 C9.67157288,8 9,7.32842712 9,6.5 C9,5.67157288 9.67157288,5 10.5,5 Z M10.5,10 L19.5,10 C20.3284271,10 21,10.6715729 21,11.5 C21,12.3284271 20.3284271,13 19.5,13 L10.5,13 C9.67157288,13 9,12.3284271 9,11.5 C9,10.6715729 9.67157288,10 10.5,10 Z M10.5,15 L19.5,15 C20.3284271,15 21,15.6715729 21,16.5 C21,17.3284271 20.3284271,18 19.5,18 L10.5,18 C9.67157288,18 9,17.3284271 9,16.5 C9,15.6715729 9.67157288,15 10.5,15 Z"
                                                            id="Combined-Shape" fill="#000000" />
                                                        <path
                                                            d="M5.5,8 C4.67157288,8 4,7.32842712 4,6.5 C4,5.67157288 4.67157288,5 5.5,5 C6.32842712,5 7,5.67157288 7,6.5 C7,7.32842712 6.32842712,8 5.5,8 Z M5.5,13 C4.67157288,13 4,12.3284271 4,11.5 C4,10.6715729 4.67157288,10 5.5,10 C6.32842712,10 7,10.6715729 7,11.5 C7,12.3284271 6.32842712,13 5.5,13 Z M5.5,18 C4.67157288,18 4,17.3284271 4,16.5 C4,15.6715729 4.67157288,15 5.5,15 C6.32842712,15 7,15.6715729 7,16.5 C7,17.3284271 6.32842712,18 5.5,18 Z"
                                                            id="Combined-Shape" fill="#000000" opacity="0.3" />
                                                    </g>
                                                </svg></span>
                                            <span class="kt-widget17__subtitle">
                                                Job Seeker
                                            </span>
                                            <span class="kt-widget17__desc">
                                                {{ $data['services_count'] }} Total Job Seeker
                                            </span>
                                        </a>
                                    </div>
                                    <div class="kt-widget17__item">
                                        <a href="{{ route('admin.teams.list') }}">
                                            <span class="kt-widget17__icon">
                                                <svg class="kt-svg-icon kt-svg-icon--dark"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    xmlns:xlink="http://www.w3.org/1999/xlink" width="24px"
                                                    height="24px" viewBox="0 0 24 24" version="1.1"
                                                    class="kt-svg-icon">
                                                    <g stroke="none" stroke-width="1" fill="none"
                                                        fill-rule="evenodd">
                                                        <polygon id="Shape" points="0 0 24 0 24 24 0 24" />
                                                        <path
                                                            d="M18,14 C16.3431458,14 15,12.6568542 15,11 C15,9.34314575 16.3431458,8 18,8 C19.6568542,8 21,9.34314575 21,11 C21,12.6568542 19.6568542,14 18,14 Z M9,11 C6.790861,11 5,9.209139 5,7 C5,4.790861 6.790861,3 9,3 C11.209139,3 13,4.790861 13,7 C13,9.209139 11.209139,11 9,11 Z"
                                                            id="Combined-Shape" fill="#000000" fill-rule="nonzero"
                                                            opacity="0.3" />
                                                        <path
                                                            d="M17.6011961,15.0006174 C21.0077043,15.0378534 23.7891749,16.7601418 23.9984937,20.4 C24.0069246,20.5466056 23.9984937,21 23.4559499,21 L19.6,21 C19.6,18.7490654 18.8562935,16.6718327 17.6011961,15.0006174 Z M0.00065168429,20.1992055 C0.388258525,15.4265159 4.26191235,13 8.98334134,13 C13.7712164,13 17.7048837,15.2931929 17.9979143,20.2 C18.0095879,20.3954741 17.9979143,21 17.2466999,21 C13.541124,21 8.03472472,21 0.727502227,21 C0.476712155,21 -0.0204617505,20.45918 0.00065168429,20.1992055 Z"
                                                            id="Combined-Shape" fill="#000000" fill-rule="nonzero" />
                                                    </g>
                                                </svg></span>
                                            <span class="kt-widget17__subtitle">
                                                Meet The Team
                                            </span>
                                            <span class="kt-widget17__desc">
                                                {{ $data['Teams'] }} Total Meet The Team
                                            </span>
                                        </a>
                                    </div>
                                    <div class="kt-widget17__item">
                                        <a href="{{ route('admin.contact.us.list') }}">
                                            <span class="kt-widget17__icon">
                                                <svg xmlns="http://www.w3.org/2000/svg"
                                                    xmlns:xlink="http://www.w3.org/1999/xlink" width="24px"
                                                    height="24px" viewBox="0 0 24 24" version="1.1"
                                                    class="kt-svg-icon">
                                                    <g stroke="none" stroke-width="1" fill="none"
                                                        fill-rule="evenodd">
                                                        <rect id="bound" x="0" y="0" width="24" height="24" />
                                                        <circle id="Oval-5" fill="#000000" opacity="0.3"
                                                            cx="12" cy="12" r="10" />
                                                        <path
                                                            d="M12,16 C12.5522847,16 13,16.4477153 13,17 C13,17.5522847 12.5522847,18 12,18 C11.4477153,18 11,17.5522847 11,17 C11,16.4477153 11.4477153,16 12,16 Z M10.591,14.868 L10.591,13.209 L11.851,13.209 C13.447,13.209 14.602,11.991 14.602,10.395 C14.602,8.799 13.447,7.581 11.851,7.581 C10.234,7.581 9.121,8.799 9.121,10.395 L7.336,10.395 C7.336,7.875 9.31,5.922 11.851,5.922 C14.392,5.922 16.387,7.875 16.387,10.395 C16.387,12.915 14.392,14.868 11.851,14.868 L10.591,14.868 Z"
                                                            id="Combined-Shape" fill="#000000" />
                                                    </g>
                                                </svg></span>
                                            <span class="kt-widget17__subtitle">
                                                User Inquiry
                                            </span>
                                            <span class="kt-widget17__desc">
                                                {{ $data['contact_us_count'] }} Total User Inquiry
                                            </span>
                                        </a>
                                    </div>

                                </div>

                                <div class="kt-widget17__items">

                                    <div class="kt-widget17__item">
                                        <a href="{{ route('admin.our.values.list') }}">
                                            <span class="kt-widget17__icon">
                                                <svg class="kt-svg-icon kt-svg-icon--dark"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    xmlns:xlink="http://www.w3.org/1999/xlink" width="24px"
                                                    height="24px" viewBox="0 0 24 24" version="1.1"
                                                    class="kt-svg-icon">
                                                    <g stroke="none" stroke-width="1" fill="none"
                                                        fill-rule="evenodd">
                                                        <rect id="bound" x="0" y="0" width="24" height="24" />
                                                        <path
                                                            d="M4.5,21 L21.5,21 C22.3284271,21 23,20.3284271 23,19.5 L23,8.5 C23,7.67157288 22.3284271,7 21.5,7 L11,7 L8.43933983,4.43933983 C8.15803526,4.15803526 7.77650439,4 7.37867966,4 L4.5,4 C3.67157288,4 3,4.67157288 3,5.5 L3,19.5 C3,20.3284271 3.67157288,21 4.5,21 Z"
                                                            id="Combined-Shape" fill="#000000" opacity="0.3" />
                                                        <path
                                                            d="M2.5,19 L19.5,19 C20.3284271,19 21,18.3284271 21,17.5 L21,6.5 C21,5.67157288 20.3284271,5 19.5,5 L9,5 L6.43933983,2.43933983 C6.15803526,2.15803526 5.77650439,2 5.37867966,2 L2.5,2 C1.67157288,2 1,2.67157288 1,3.5 L1,17.5 C1,18.3284271 1.67157288,19 2.5,19 Z"
                                                            id="Combined-Shape-Copy" fill="#000000" />
                                                    </g>
                                                </svg></span>
                                            <span class="kt-widget17__subtitle">
                                                Our Values
                                            </span>
                                            <span class="kt-widget17__desc">
                                                {{ $data['OurValues'] }} Total Our Values
                                            </span>
                                        </a>
                                    </div>
                                    <div class="kt-widget17__item">
                                        <a href="{{ route('admin.browse.by.positions.list') }}">
                                            <span class="kt-widget17__icon">
                                                <svg class="kt-svg-icon kt-svg-icon--info"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    xmlns:xlink="http://www.w3.org/1999/xlink" width="24px"
                                                    height="24px" viewBox="0 0 24 24" version="1.1"
                                                    class="kt-svg-icon">
                                                    <g stroke="none" stroke-width="1" fill="none"
                                                        fill-rule="evenodd">
                                                        <rect id="bound" x="0" y="0" width="24" height="24" />
                                                        <path
                                                            d="M5.84026576,8 L18.1597342,8 C19.1999115,8 20.0664437,8.79732479 20.1528258,9.83390904 L20.8194924,17.833909 C20.9112219,18.9346631 20.0932459,19.901362 18.9924919,19.9930915 C18.9372479,19.9976952 18.8818364,20 18.8264009,20 L5.1735991,20 C4.0690296,20 3.1735991,19.1045695 3.1735991,18 C3.1735991,17.9445645 3.17590391,17.889153 3.18050758,17.833909 L3.84717425,9.83390904 C3.93355627,8.79732479 4.80008849,8 5.84026576,8 Z M10.5,10 C10.2238576,10 10,10.2238576 10,10.5 L10,11.5 C10,11.7761424 10.2238576,12 10.5,12 L13.5,12 C13.7761424,12 14,11.7761424 14,11.5 L14,10.5 C14,10.2238576 13.7761424,10 13.5,10 L10.5,10 Z"
                                                            id="Combined-Shape" fill="#000000" />
                                                        <path
                                                            d="M10,8 L8,8 L8,7 C8,5.34314575 9.34314575,4 11,4 L13,4 C14.6568542,4 16,5.34314575 16,7 L16,8 L14,8 L14,7 C14,6.44771525 13.5522847,6 13,6 L11,6 C10.4477153,6 10,6.44771525 10,7 L10,8 Z"
                                                            id="Path-53" fill="#000000" fill-rule="nonzero"
                                                            opacity="0.3" />
                                                    </g>
                                                </svg></span>
                                            <span class="kt-widget17__subtitle">
                                                Browse by Positions
                                            </span>
                                            <span class="kt-widget17__desc">
                                                {{ $data['BrowseByPositions_count'] }} Total Browse by Positions

                                            </span>
                                        </a>
                                    </div>
                                    <div class="kt-widget17__item">
                                        <a href="{{ route('admin.leaders.list') }}">
                                            <span class="kt-widget17__icon">
                                                <svg class="kt-svg-icon kt-svg-icon--warning"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    xmlns:xlink="http://www.w3.org/1999/xlink" width="24px"
                                                    height="24px" viewBox="0 0 24 24" version="1.1"
                                                    class="kt-svg-icon">
                                                    <g stroke="none" stroke-width="1" fill="none"
                                                        fill-rule="evenodd">
                                                        <rect id="bound" x="0" y="0" width="24" height="24" />
                                                        <circle id="Combined-Shape" fill="#000000" opacity="0.3"
                                                            cx="12" cy="12" r="10" />
                                                        <path
                                                            d="M12,11 C10.8954305,11 10,10.1045695 10,9 C10,7.8954305 10.8954305,7 12,7 C13.1045695,7 14,7.8954305 14,9 C14,10.1045695 13.1045695,11 12,11 Z M7.00036205,16.4995035 C7.21569918,13.5165724 9.36772908,12 11.9907452,12 C14.6506758,12 16.8360465,13.4332455 16.9988413,16.5 C17.0053266,16.6221713 16.9988413,17 16.5815,17 L7.4041679,17 C7.26484009,17 6.98863236,16.6619875 7.00036205,16.4995035 Z"
                                                            id="Combined-Shape" fill="#000000" opacity="0.3" />
                                                    </g>
                                                </svg></span>
                                            <span class="kt-widget17__subtitle">
                                                Our Specialist Areas
                                            </span>
                                            <span class="kt-widget17__desc">
                                                {{ $data['Leaders_count'] }} Total Our Specialist Areas
                                            </span>
                                        </a>
                                    </div>

                                </div>

                                <div class="kt-widget17__items">

                                    <div class="kt-widget17__item">
                                        <a href="{{ route('admin.solutions.list') }}">
                                            <span class="kt-widget17__icon">
                                                <svg class="kt-svg-icon kt-svg-icon--success"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    xmlns:xlink="http://www.w3.org/1999/xlink" width="24px"
                                                    height="24px" viewBox="0 0 24 24" version="1.1"
                                                    class="kt-svg-icon">
                                                    <g stroke="none" stroke-width="1" fill="none"
                                                        fill-rule="evenodd">
                                                        <rect id="bound" x="0" y="0" width="24" height="24" />
                                                        <circle id="Combined-Shape" fill="#000000" opacity="0.3"
                                                            cx="12" cy="9" r="8" />
                                                        <path
                                                            d="M14.5297296,11 L9.46184488,11 L11.9758349,17.4645458 L14.5297296,11 Z M10.5679953,19.3624463 L6.53815512,9 L17.4702704,9 L13.3744964,19.3674279 L11.9759405,18.814912 L10.5679953,19.3624463 Z"
                                                            id="Path-69" fill="#000000" fill-rule="nonzero"
                                                            opacity="0.3" />
                                                        <path
                                                            d="M10,22 L14,22 L14,22 C14,23.1045695 13.1045695,24 12,24 L12,24 C10.8954305,24 10,23.1045695 10,22 Z"
                                                            id="Rectangle-72-Copy-2" fill="#000000" opacity="0.3" />
                                                        <path
                                                            d="M9,20 C8.44771525,20 8,19.5522847 8,19 C8,18.4477153 8.44771525,18 9,18 C8.44771525,18 8,17.5522847 8,17 C8,16.4477153 8.44771525,16 9,16 L15,16 C15.5522847,16 16,16.4477153 16,17 C16,17.5522847 15.5522847,18 15,18 C15.5522847,18 16,18.4477153 16,19 C16,19.5522847 15.5522847,20 15,20 C15.5522847,20 16,20.4477153 16,21 C16,21.5522847 15.5522847,22 15,22 L9,22 C8.44771525,22 8,21.5522847 8,21 C8,20.4477153 8.44771525,20 9,20 Z"
                                                            id="Combined-Shape" fill="#000000" />
                                                    </g>
                                                </svg></span>
                                            <span class="kt-widget17__subtitle">
                                                Solutions
                                            </span>
                                            <span class="kt-widget17__desc">
                                                {{ $data['Solutions'] }} Total Solutions
                                            </span>
                                        </a>
                                    </div>
                                    <div class="kt-widget17__item">
                                        <a href="{{ route('admin.submit.role.list') }}">
                                            <span class="kt-widget17__icon">
                                                <svg class="kt-svg-icon kt-svg-icon--secondary"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    xmlns:xlink="http://www.w3.org/1999/xlink" width="24px"
                                                    height="24px" viewBox="0 0 24 24" version="1.1"
                                                    class="kt-svg-icon">
                                                    <g stroke="none" stroke-width="1" fill="none"
                                                        fill-rule="evenodd">
                                                        <polygon id="Shape" points="0 0 24 0 24 24 0 24" />
                                                        <path
                                                            d="M12,11 C9.790861,11 8,9.209139 8,7 C8,4.790861 9.790861,3 12,3 C14.209139,3 16,4.790861 16,7 C16,9.209139 14.209139,11 12,11 Z"
                                                            id="Mask" fill="#000000" fill-rule="nonzero"
                                                            opacity="0.3" />
                                                        <path
                                                            d="M3.00065168,20.1992055 C3.38825852,15.4265159 7.26191235,13 11.9833413,13 C16.7712164,13 20.7048837,15.2931929 20.9979143,20.2 C21.0095879,20.3954741 20.9979143,21 20.2466999,21 C16.541124,21 11.0347247,21 3.72750223,21 C3.47671215,21 2.97953825,20.45918 3.00065168,20.1992055 Z"
                                                            id="Mask-Copy" fill="#000000" fill-rule="nonzero" />
                                                    </g>
                                                </svg></span>
                                            <span class="kt-widget17__subtitle">
                                                Submit Role
                                            </span>
                                            <span class="kt-widget17__desc">
                                                {{ $data['SubmitRole_count'] }} Total Submit Role

                                            </span>
                                        </a>
                                    </div>
                                    <div class="kt-widget17__item">
                                        <a href="{{ route('admin.apply.job.list') }}">
                                            <span class="kt-widget17__icon">
                                                <svg class="kt-svg-icon kt-svg-icon--primary"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    xmlns:xlink="http://www.w3.org/1999/xlink" width="24px"
                                                    height="24px" viewBox="0 0 24 24" version="1.1"
                                                    class="kt-svg-icon">
                                                    <g stroke="none" stroke-width="1" fill="none"
                                                        fill-rule="evenodd">
                                                        <polygon id="Shape" points="0 0 24 0 24 24 0 24" />
                                                        <path
                                                            d="M5.85714286,2 L13.7364114,2 C14.0910962,2 14.4343066,2.12568431 14.7051108,2.35473959 L19.4686994,6.3839416 C19.8056532,6.66894833 20,7.08787823 20,7.52920201 L20,20.0833333 C20,21.8738751 19.9795521,22 18.1428571,22 L5.85714286,22 C4.02044787,22 4,21.8738751 4,20.0833333 L4,3.91666667 C4,2.12612489 4.02044787,2 5.85714286,2 Z"
                                                            id="Combined-Shape" fill="#000000" fill-rule="nonzero"
                                                            opacity="0.3" />
                                                        <rect id="Rectangle" fill="#000000" x="6" y="11" width="9"
                                                            height="2" rx="1" />
                                                        <rect id="Rectangle-Copy" fill="#000000" x="6" y="15"
                                                            width="5" height="2" rx="1" />
                                                    </g>
                                                </svg></span>
                                                <span class="kt-widget17__subtitle">
                                                Apply Job
                                            </span>
                                            <span class="kt-widget17__desc">
                                                {{ $data['ApplyJobs'] }} Total Apply Job
                                            </span>
                                        </a>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection

@push('script')
    <script src="{{ asset('admin-asset/js/Chart.bundle.js') }}"></script>

    <script>
        // Data passed from Laravel to JavaScript
        var servicesData = @json($data['services_chart']);
        var TalentSeekerData = @json($data['TalentSeeker_chart']);
        var SubmitRoleData = @json($data['SubmitRole_chart']);
        var ApplyJobsData = @json($data['ApplyJobs_chart']);
        var labels = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October",
            "November", "December"
        ];

        // Function to process data for charts
        function prepareChartData(data) {
            let chartData = [];
            for (let i = 1; i <= 12; i++) {
                chartData.push(data[i] || 0); // Default to 0 if no data is available
            }
            return chartData;
        }

        // Chart Data Preparation
        var jobPostingData = prepareChartData(servicesData);
        var talentSeekerData = prepareChartData(TalentSeekerData);
        var submitRoleData = prepareChartData(SubmitRoleData);
        var applyJobsData = prepareChartData(ApplyJobsData);

        // KTDashboard Initialization
        var KTDashboard = (function() {
            // Chart 1: Job Posting
            function initJobPostingChart() {
                if (document.getElementById("kt_chart_bandwidth1") === null) {
                    return;
                }

                var ctx = document.getElementById("kt_chart_bandwidth1").getContext("2d");
                var gradient = ctx.createLinearGradient(0, 0, 0, 240);
                gradient.addColorStop(0, 'rgba(0, 123, 255, 1)'); // Blue gradient start
                gradient.addColorStop(1, 'rgba(0, 123, 255, 0.3)'); // Blue gradient end

                new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: labels,
                        datasets: [{
                            label: "Job Posting",
                            backgroundColor: gradient,
                            borderColor: '#007bff', // Blue border
                            data: jobPostingData,
                            pointBackgroundColor: 'rgba(0, 0, 0, 0)',
                            pointBorderColor: 'rgba(0, 0, 0, 0)',
                            pointHoverBackgroundColor: '#0056b3',
                            pointHoverBorderColor: 'rgba(0, 0, 0, 0.1)',
                        }]
                    },
                    options: commonChartOptions()
                });
            }

            // Chart 2: Hiring Talent
            function initTalentSeekerChart() {
                if (document.getElementById("kt_chart_bandwidth2") === null) {
                    return;
                }

                var ctx = document.getElementById("kt_chart_bandwidth2").getContext("2d");
                var gradient = ctx.createLinearGradient(0, 0, 0, 240);
                gradient.addColorStop(0, 'rgba(40, 167, 69, 1)'); // Green gradient start
                gradient.addColorStop(1, 'rgba(40, 167, 69, 0.3)'); // Green gradient end

                new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: labels,
                        datasets: [{
                            label: "Hiring Talent",
                            backgroundColor: gradient,
                            borderColor: '#28a745', // Green border
                            data: talentSeekerData,
                            pointBackgroundColor: 'rgba(0, 0, 0, 0)',
                            pointBorderColor: 'rgba(0, 0, 0, 0)',
                            pointHoverBackgroundColor: '#1e7e34',
                            pointHoverBorderColor: 'rgba(0, 0, 0, 0.1)',
                        }]
                    },
                    options: commonChartOptions()
                });
            }

            // Chart 3: Submit Role
            function initSubmitRoleChart() {
                if (document.getElementById("kt_chart_bandwidth3") === null) {
                    return;
                }

                var ctx = document.getElementById("kt_chart_bandwidth3").getContext("2d");
                var gradient = ctx.createLinearGradient(0, 0, 0, 240);
                gradient.addColorStop(0, 'rgba(255, 193, 7, 1)'); // Yellow gradient start
                gradient.addColorStop(1, 'rgba(255, 193, 7, 0.3)'); // Yellow gradient end

                new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: labels,
                        datasets: [{
                            label: "Submit Role",
                            backgroundColor: gradient,
                            borderColor: '#ffc107', // Yellow border
                            data: submitRoleData,
                            pointBackgroundColor: 'rgba(0, 0, 0, 0)',
                            pointBorderColor: 'rgba(0, 0, 0, 0)',
                            pointHoverBackgroundColor: '#d39e00',
                            pointHoverBorderColor: 'rgba(0, 0, 0, 0.1)',
                        }]
                    },
                    options: commonChartOptions()
                });
            }

            // Chart 4: Apply Job
            function initApplyJobChart() {
                if (document.getElementById("kt_chart_bandwidth4") === null) {
                    return;
                }

                var ctx = document.getElementById("kt_chart_bandwidth4").getContext("2d");
                var gradient = ctx.createLinearGradient(0, 0, 0, 240);
                gradient.addColorStop(0, 'rgba(220, 53, 69, 1)'); // Red gradient start
                gradient.addColorStop(1, 'rgba(220, 53, 69, 0.3)'); // Red gradient end

                new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: labels,
                        datasets: [{
                            label: "Apply Job",
                            backgroundColor: gradient,
                            borderColor: '#dc3545', // Red border
                            data: applyJobsData,
                            pointBackgroundColor: 'rgba(0, 0, 0, 0)',
                            pointBorderColor: 'rgba(0, 0, 0, 0)',
                            pointHoverBackgroundColor: '#bd2130',
                            pointHoverBorderColor: 'rgba(0, 0, 0, 0.1)',
                        }]
                    },
                    options: commonChartOptions()
                });
            }

            function commonChartOptions() {
                return {
                    responsive: true,
                    maintainAspectRatio: false,
                    tooltips: {
                        mode: 'nearest',
                        intersect: false,
                        position: 'nearest',
                        xPadding: 10,
                        yPadding: 10,
                        caretPadding: 10
                    },
                    legend: {
                        display: false
                    },
                    scales: {
                        xAxes: [{
                            display: true, // Enable x-axis display
                            gridLines: {
                                display: false // Disable grid lines if needed
                            },
                            ticks: {
                                fontColor: '#6c757d', // Optional: Set tick label color
                                fontSize: 12 // Optional: Set tick label font size
                            }
                        }],
                        yAxes: [{
                            display: true, // Optional: Show y-axis for context
                            gridLines: {
                                display: true // Enable or disable y-axis grid lines
                            },
                            ticks: {
                                beginAtZero: true,
                                fontColor: '#6c757d', // Optional: Set tick label color
                                fontSize: 12 // Optional: Set tick label font size
                            }
                        }]
                    },
                    elements: {
                        line: {
                            tension: 0.0000001 // Straight lines
                        },
                        point: {
                            radius: 4,
                            borderWidth: 12
                        }
                    },
                    layout: {
                        padding: {
                            left: 0,
                            right: 0,
                            top: 10,
                            bottom: 0
                        }
                    }
                };
            }

            return {
                init: function() {
                    initJobPostingChart();
                    initTalentSeekerChart();
                    initSubmitRoleChart();
                    initApplyJobChart();
                }
            };
        })();

        // Initialize Charts
        jQuery(document).ready(function() {
            KTDashboard.init();
        });


        // Initialize Charts
    </script>
@endpush
