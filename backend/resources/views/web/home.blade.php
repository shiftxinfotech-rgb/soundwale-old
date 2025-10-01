@extends('web.layouts.default')
@section('title', 'Home')
@section('content')

    <!-- banner-section -->
    {{-- <section class="banner-section banner-style-two p_relative">
        <div class="shape" style="background-image: url( {{ asset('web/assets/images/shape/shape-5.png') }} );"></div>
        <div class="pattern-layer-2" style="background-image: url( {{ asset('web/assets/images/shape/shape-4.png') }});">
        </div>
        <div class="bg-layer" style="background-image: url({{ $home_sliders->image_url }});"></div>
        <div class="outer-container">

            <div class="content-box">
                <div class="row">
                    <div class="col-1">
                        <div class="banner_media">
                            <ul>
                                @if ($socialLink->facebook_link)
                                    <li class="">
                                        <a href="{{ $socialLink->facebook_link }}">
                                            <svg xmlns="http://www.w3.org/2000/svg"
                                                xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                                                viewBox="0 0 25 25" style="enable-background:new 0 0 25 25;"
                                                xml:space="preserve">
                                                <g>
                                                    <path
                                                        d="M15,24H9.4v-9.1H5.8V9.5h3.6v-2c0-2.3,0.6-4,1.9-5.1c1.5-1.3,3.9-1.7,7.3-1.2l0.6,0.1v4.9h-3c-0.8,0-1.1,0.2-1.1,1.3v2h4.1  l-0.7,5.4H15V24z M10.7,22.7h3v-9.1h3.6l0.3-2.8h-3.9V7.5c0-1.7,0.8-2.6,2.4-2.6h1.7V2.4c-2.7-0.4-4.6,0-5.7,0.9  c-1,0.8-1.5,2.2-1.5,4.1v3.3H7.1v2.8h3.6V22.7z">
                                                    </path>
                                                </g>
                                            </svg>
                                        </a>
                                    </li>
                                @endif
                                @if ($socialLink->linked_link)
                                    <li class="">

                                        <a href="{{ $socialLink->linked_link }}">
                                            <svg id="fi_3800073" enable-background="new 0 0 512 512" viewBox="0 0 512 512"
                                                xmlns="http://www.w3.org/2000/svg">
                                                <g>
                                                    <path
                                                        d="m7.813 509.935h132.571v-348.613h-132.571zm30-318.613h72.571v288.612h-72.571z">
                                                    </path>
                                                    <path
                                                        d="m74.099 2.065c-40.859 0-74.099 33.241-74.099 74.099s33.24 74.1 74.099 74.1 74.1-33.241 74.1-74.1-33.242-74.099-74.1-74.099zm-44.099 74.099c0-24.316 19.782-44.099 44.099-44.099s44.1 19.782 44.1 44.099-19.783 44.1-44.1 44.1-44.099-19.784-44.099-44.1z">
                                                    </path>
                                                    <path
                                                        d="m511.679 270.79c-4.718-67.855-61.318-120.144-131.489-120.144-31.387 0-61.016 10.912-84.361 30.274v-19.6h-127.03v348.613h132.572v-190.664c0-21.488 17.481-38.97 38.97-38.97 21.487 0 38.969 17.482 38.969 38.979l.128 190.656h132.562v-238.822zm-240.308 209.145h-72.572v-288.614h67.029v42.847l24.005.138 4.46-6.924c18.85-29.265 50.961-46.735 85.897-46.735 55.836 0 100.543 42.602 101.78 96.985l.03 202.303h-72.582l-.108-160.666c0-38.03-30.94-68.97-68.969-68.97-38.03 0-68.97 30.94-68.97 68.97z">
                                                    </path>
                                                </g>
                                            </svg>
                                        </a>
                                    </li>
                                @endif
                                @if ($socialLink->instagram_link)
                                    <li class="">
                                        <a href="{{ $socialLink->instagram_link }}">
                                            <svg xmlns="http://www.w3.org/2000/svg"
                                                xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                                                viewBox="0 0 25 25" style="enable-background:new 0 0 25 25;"
                                                xml:space="preserve">
                                                <g>
                                                    <g>
                                                        <path
                                                            d="M16.7,23H8.3C4.8,23,2,20.2,2,16.7V8.3C2,4.8,4.8,2,8.3,2h8.4C20.2,2,23,4.8,23,8.3v8.4C23,20.2,20.2,23,16.7,23z    M8.3,3.2c-2.8,0-5.1,2.3-5.1,5.1v8.4c0,2.8,2.3,5.1,5.1,5.1h8.4c2.8,0,5.1-2.3,5.1-5.1V8.3c0-2.8-2.3-5.1-5.1-5.1H8.3z">
                                                        </path>
                                                    </g>
                                                    <g>
                                                        <path
                                                            d="M12.5,17.5c-2.8,0-5-2.3-5-5s2.3-5,5-5h0c2.8,0,5,2.3,5,5C17.6,15.3,15.3,17.5,12.5,17.5z M12.5,8.6   c-2.1,0-3.9,1.7-3.9,3.9s1.7,3.9,3.9,3.9s3.9-1.7,3.9-3.9C16.4,10.4,14.6,8.6,12.5,8.6L12.5,8.6z">
                                                        </path>
                                                    </g>
                                                    <g>
                                                        <path
                                                            d="M18.3,7.8c-0.6,0-1-0.5-1-1s0.5-1,1-1s1,0.5,1,1S18.9,7.8,18.3,7.8z M18.3,6.6c-0.1,0-0.1,0.1-0.1,0.1   c0,0.2,0.3,0.2,0.3,0C18.5,6.7,18.4,6.6,18.3,6.6z">
                                                        </path>
                                                    </g>
                                                </g>
                                            </svg>
                                        </a>
                                    </li>
                                @endif
                            </ul>
                        </div>
                        <div class="banner_holder">
                            <a href="#">
                                <div class="button_icon">
                                    <span>
                                        <i aria-hidden="true" class="fas fa-circle"></i>
                                    </span>
                                </div>
                                <div class="button_text"><span>Scroll</span></div>
                            </a>
                        </div>
                    </div>
                    <div class="col-11">
                        <div class="content_box_data">
                            <h2>{!! $home_sliders->title !!}</h2>
                            <p>{{ $home_sliders->text }}</p>
                            <div class="btn-box">
                                <a href="index.html" class="theme-btn btn-one mr_20"><span>Find Works</span></a>
                                <a href="index.html" class="theme-btn banner-btn">Hire Talents Now</a>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </section> --}}
    <!-- banner-section end -->
    <section class="banner_main" style="background-image: url({{ $home_sliders->image_url }});">
        <div class="container">
            <div class="banner_data text-center">
                <h1>{!! $home_sliders->title !!}</h1>
                <p>{{ $home_sliders->text }}
                </p>
            </div>
        </div>
    </section>
    @if ($leader->isNotEmpty())
        <section class="chooseus-section specialist_sec">
            <!-- <div class="pattern-layer" style="background-image: url(assets/images/shape/shape-2.png);"></div> -->
            <div class="auto-container">
                <div class="sec-title centred pb_40 sec-title-animation animation-style2">
                    <h2 class="title-animation">Our Specialist Areas</h2>
                </div>
                <div class="inner-container">
                    <div class="row clearfix">
                        @foreach ($leader as $leaders)
                            <div class="col-lg-4 col-md-6 col-sm-12 chooseus-block">
                                <div class="chooseus-block-one">
                                    <div class="inner-box">
                                        <div class="icon-box">
                                            <img src="{{ $leaders->image_url }}" alt="">
                                        </div>
                                        <h3><a href="javascript:;">{{ $leaders->title }}</a></h3>
                                        <p>
                                            @if (strlen($leaders->description) > 150)
                                                <span
                                                    class="short-message">{{ Str::limit($leaders->description, 200) }}</span>
                                                <span class="full-message"
                                                    style="display: none;">{{ $leaders->description }}</span>
                                                <a href="javascript:void(0);" class="read-more-toggle">Read
                                                    More</a>
                                            @else
                                                {{ $leaders->description }}
                                            @endif
                                        </p>
                                    </div>
                                </div>
                            </div>
                        @endforeach

                    </div>
                </div>
            </div>
        </section>
    @endif
    {{-- @if ($leader->isNotEmpty())
        <!-- clients-style-two -->
        <section class="clients-style-two centred trusted_main">
            <div class="auto-container">
                <div class="title-text">
                    <h3>Trusted by the next-gen industry leaders</h3>
                </div>
                <div class="clients-carousel owl-carousel owl-theme owl-dots-none owl-nav-none">
                    @foreach ($leader as $leaders)
                        <figure class="clients-logo"><a href="javascript:;"><img src="{{ $leaders->image_url }}"
                                    alt=""></a></figure>
                    @endforeach

                </div>
            </div>
        </section>
    @endif --}}

    <!-- clients-style-two end -->
    <!-- about-style-two -->
    <section class="about-style-two about_home_main">
        <div class="auto-container">
            <div class="row align-items-center">
                <div class="col-lg-6 col-md-12 col-sm-12 content-column">
                    <div class="content_block_one">
                        <div class="content-box">
                            <div class="sec-title pb_20 sec-title-animation animation-style2">
                                <span class="sub-title mb_10 title-animation">About us</span>
                                <h2 class="title-animation">
                                    {!! $aboutUs->title_2 !!}
                                </h2>
                            </div>
                            <div class="text-box">
                                <ul class="list-style-one clearfix">
                                    {!! $aboutUs->description !!}
                                </ul>
                                <a href="{{ route('web.about.us') }}" class="theme-btn btn-one about_view_more_btn">View
                                    More</a>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-lg-6 col-md-12 col-sm-12 video-column">
                    <div class="video_block_two">
                        <div class="video-box  z_1 p_relative  centred">
                            <div class="video-inner" style="background-image: url({{ $aboutUs->image_url }});">

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
    <!-- industries-style-two -->
    @if ($advantages->isNotEmpty())
        <section class="industries-style-two positions_main">
            <div class="pattern-layer" style="background-image: url({{ asset('web/assets/images/shape/download.png') }});">
            </div>
            <div class="auto-container">
                <div class="sec-title light centred pb_40 sec-title-animation animation-style2">
                    <span class="sub-title mb_10 title-animation">{!! $home_settings->blog_description !!}</span>
                    <h2 class="title-animation">Browse by Positions</h2>
                </div>
                <div class="row clearfix">
                    @foreach ($advantages as $advantage)
                        <div class="col-xl-3 col-lg-4 col-md-6 col-sm-12 industries-block">
                            <div class="industries-block-two">
                                <div class="inner-box">
                                    <div class="icon-box"><img src="{{ $advantage->image_url }}" alt=""
                                            class="icon-9"></div>
                                    <h3><a href="javascript:;">{{ $advantage->title }}</a></h3>
                                    <p>{{ $advantage->description }} Jobs</p>
                                </div>
                            </div>
                        </div>
                    @endforeach
                </div>
            </div>
        </section>
    @endif
    <!-- testimonial-section -->
    @if ($testimonials->isNotEmpty())
        <section class="testimonial-section testimonial_main">
            <div class="pattern-layer" style="background-image: url({{ asset('web/assets/images/shape/shape-3.png') }});">
            </div>
            <div class="auto-container">
                <div class="sec-title light centred pb_40 sec-title-animation animation-style2">
                    <span class="sub-title mb_10 title-animation">Testimonials</span>
                    <h2 class="title-animation">{!! $home_settings->testimonials_title !!}</h2>
                </div>
                <div class="three-item-carousel owl-carousel owl-theme owl-dots-none owl-nav-none">
                    @foreach ($testimonials as $testimonial)
                        <div class="testimonial-block-one">
                            <div class="inner-box">
                                <div class="shape"
                                    style="background-image: url( {{ asset('web/assets/images/shape/shape-7.png') }});">
                                </div>
                                <div class="icon-box"><img src="{{ asset('web/assets/images/icons/icon-10.png ') }}"
                                        alt=""></div>
                                <div class="author-box">
                                    <figure class="thumb-box"><img src="{{ $testimonial->image_url }}" alt="">
                                    </figure>
                                    <h4>{{ $testimonial->name }} (@if ($testimonial->type == 0)
                                            Clients
                                        @else
                                            Candidate
                                        @endif)</h4>
                                    <span class="designation">{{ $testimonial->designation }}</span>
                                </div>
                                <p>
                                    @if (strlen($testimonial->message) > 150)
                                        <span class="short-message">{{ Str::limit($testimonial->message, 200) }}</span>
                                        <span class="full-message"
                                            style="display: none;">{{ $testimonial->message }}</span>
                                        <a href="javascript:void(0);" class="read-more-toggle">Read
                                            More</a>
                                    @else
                                        {{ $testimonial->message }}
                                    @endif
                                </p>
                            </div>
                        </div>
                    @endforeach
                </div>
            </div>
        </section>
        <!-- testimonial-section end -->
    @endif
    <!-- download-section -->
    <section class="download-section  submit_role_home_main">
        <div class="auto-container">
            <div class="inner-container">
                <div class="pattern-layer"
                    style="background-image: url({{ asset('web/assets/images/shape/shape-6.png') }});"></div>
                <div class="row align-items-center">
                    <div class="col-lg-4 col-md-5 col-sm-12 image-column">
                        <div class="image-box">
                            <figure class="image"><img src="{{ $home_settings->job_image_url }}" alt="">
                            </figure>
                        </div>
                    </div>
                    <div class="col-lg-8 col-md-7 col-sm-12 content-column">
                        <div class="content-box">
                            <h2>{!! $home_settings->nemt_title !!}</h2>
                            <ul class="list-item">
                                {!! $home_settings->nemt_description !!}
                            </ul>
                            <a href="{{ route('web.submit.role') }}" class="theme-btn btn-one jobs_seeker_btn">Submit
                                Role</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
    <!-- download-section end -->
    <!-- industries-style-two end -->
    @if ($services->isNotEmpty())
        <section class="recent_job_sec">
            <div class="auto-container">
                <div class="sec-title centred pb_40 sec-title-animation animation-style2">
                    <span class="sub-title mb_10 title-animation">Available Jobs</span>
                    <h2 class="title-animation">{!! $home_settings->blog_title !!}</h2>
                </div>
                <div class="row">
                    @foreach ($services as $service)
                        <div class="col-xl-3 col-lg-4 col-md-6 col-sm-12 chooseus-block">
                            <div class="chooseus-block-one text-center">
                                <div class="inner-box">
                                    <div class="icon-box"><i class="icon-4"></i></div>
                                    <h3><a href="javascript:;">{{ $service->title }}</a></h3>
                                    <p><i class="fas fa-map-marker-alt"></i> {{ $service->location }}</p>
                                    <ul>
                                        <li>
                                            <span>Salary:</span>
                                            {{ $service->salary }}
                                        </li>
                                        <li>
                                            <span>Experience Need:</span>
                                            {{ $service->sub_title }}
                                        </li>
                                    </ul>
                                    <a href="{{ route('web.apply.job', ['slug' => encrypt($service->id)]) }}"
                                        class="theme-btn btn-one">Apply Now</a>
                                </div>
                            </div>
                        </div>
                    @endforeach

                    <div class="col-lg-12  text-center">
                        <a href="{{ route('web.jobs.seeker') }}" class="theme-btn btn-one jobs_seeker_btn">View More</a>
                    </div>
                </div>
            </div>
        </section>
    @endif

    {{--
    <section class="funfact-section centred ">
        <div class="auto-container">
            <div class="sec-title centred pb_40 sec-title-animation animation-style2">
                <span class="sub-title mb_10 title-animation">Deliverables</span>
                <h2 class="title-animation">{!! $home_settings->testimonial_description !!}</h2>
            </div>

            <div class="row clearfix">
                <div class="col-lg-3 col-md-6 col-sm-12 funfact-block">
                    <div class="funfact-block-one">
                        <div class="inner-box">
                            <div class="count-outer">
                                @php
                                    $count1 = preg_replace('/\D/', '', $home_settings->c1);
                                    $textOnly1 = preg_replace('/\d/', '', $home_settings->c1);
                                @endphp
                                <span class="odometer" data-count="{{ $count1 }}">00</span><span class="symble"
                                    id="symbol">{{ $textOnly1 }}</span>
                            </div>
                            <p>{{ $home_settings->t1 }}</p>
                        </div>
                    </div>
                </div>
                <div class="col-lg-3 col-md-6 col-sm-12 funfact-block">
                    <div class="funfact-block-one">
                        <div class="inner-box">
                            <div class="count-outer">
                                @php
                                    $count2 = preg_replace('/\D/', '', $home_settings->c2);
                                    $textOnly2 = preg_replace('/\d/', '', $home_settings->c2);
                                @endphp
                                <span class="odometer" data-count="{{ $count2 }}">00</span><span
                                    class="symble">{{ $textOnly2 }}</span>
                            </div>
                            <p>{{ $home_settings->t2 }}</p>
                        </div>
                    </div>
                </div>
                <div class="col-lg-3 col-md-6 col-sm-12 funfact-block">
                    <div class="funfact-block-one">
                        <div class="inner-box">
                            <div class="count-outer">
                                @php
                                    $count3 = preg_replace('/\D/', '', $home_settings->c3);
                                    $textOnly3 = preg_replace('/\d/', '', $home_settings->c3);
                                @endphp
                                <span class="odometer" data-count="{{ $count3 }}">00</span><span
                                    class="symble">{{ $textOnly3 }}</span>
                            </div>
                            <p>{{ $home_settings->t3 }}</p>
                        </div>
                    </div>
                </div>
                <div class="col-lg-3 col-md-6 col-sm-12 funfact-block">
                    <div class="funfact-block-one">
                        <div class="inner-box">
                            <div class="count-outer">
                                @php
                                    $count4 = preg_replace('/\D/', '', $home_settings->c4);
                                    $textOnly4 = preg_replace('/\d/', '', $home_settings->c4);
                                @endphp
                                <span class="odometer" data-count="{{ $count4 }}">00</span><span
                                    class="symble">{{ $textOnly4 }}</span>
                            </div>
                            <p>{{ $home_settings->t4 }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section> --}}

@endsection
@push('script')
    <script>
        $.validator.addMethod("validEmail", function(value, element) {
            return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value);
        }, "Please enter a valid email address");

        $.validator.addMethod("notDisposableEmail", function(value, element) {
            var disposableEmails = ['example.com', 'example.org', 'example.net'];
            var domain = value.split('@')[1];
            return disposableEmails.indexOf(domain) === -1;
        }, "Disposable email addresses are not allowed");

        $(document).ready(function() {
            var conf = {
                rules: {
                    name: {
                        required: true,
                    },
                    email: {
                        required: true,
                        validEmail: true,
                        notDisposableEmail: true,
                    },
                    message: {
                        required: true,
                    },
                },
                messages: {
                    name: {
                        required: "Full Name is required.",
                    },
                    email: {
                        required: "Email is required.",
                    },
                    message: {
                        required: "Message is required.",
                    },
                },
            };

            $("#reachouttous-form").validate(conf);
        });
    </script>
@endpush
