@extends('admin.layouts.default')
@section('title', 'Users & Directory')
@section('content')
<style>

    .wrapper {
        display: grid;
        grid-template-columns: 300px 300px 100px;
        grid-gap: 7px;
        background-color: #fff;
        color: #444;
        padding-top: 1%;
    }

    .box {
        border-radius: 5px;
        padding: 2px;
        font-size: 150%;
    }

    .wrapper_view {
        display: grid;
        grid-template-columns: 300px 300px 100px;
        background-color: #fff;
        color: #444;
    }

    .box_view {
        border-radius: 5px;
        padding: 5px;
        font-size: 150%;
    }
</style>
<!-- begin:: Subheader -->
<div class="kt-subheader kt-grid__item" id="kt_subheader">
    <div class="kt-subheader__main">
        <h3 class="kt-subheader__title">Users & Directory</h3>
        <div class="kt-subheader__breadcrumbs">
            <a href="javascript:history.back()" class="kt-subheader__breadcrumbs-link" title="Back">List</a>
            <span class="kt-subheader__breadcrumbs-separator"></span>
            <a href="javascript:;" class="kt-subheader__breadcrumbs-link" title="Back">View</a>
        </div>
    </div>
</div>
<!-- end:: Subheader -->
<!-- begin:: Content -->
<div class="kt-content kt-grid__item kt-grid__item--fluid" id="kt_content">
    @include('admin.layouts.flash-message')
    <div class="kt-portlet kt-portlet--mobile">
        <div class="kt-portlet__head kt-portlet__head--lg">
            <div class="kt-portlet__head-label">
                <span class="kt-portlet__head-icon">
                    <i class="kt-font-brand flaticon-user-settings"></i>
                </span>
                <h3 class="kt-portlet__head-title">
                    Users & Directory
                </h3>
            </div>
            <div class="kt-portlet__head-toolbar">
                <div class="kt-portlet__head-wrapper">
                    <a onclick="window.history.back()"class="btn btn-clean btn-icon-sm">
                        <i class="la la-long-arrow-left"></i>
                        Back
                    </a>

                </div>
            </div>
        </div>
        <!--begin::Portlet-->

        <div class="kt-portlet__body">
            <div class="row">
                <div class="col-lg-6">
                    <label><strong>Role:</strong></label>
                    <p>{{ $data->role->name ?? 'N/A' }}</p>
                </div>
                <div class="col-lg-6">
                    <label><strong>Name:</strong></label>
                    <p>{{ $data->name ?? 'N/A' }}</p>
                </div>
                <div class="col-lg-6">
                    <label><strong>Email:</strong></label>
                    <p>{{ $data->email ?? 'N/A' }}</p>
                </div>
                <div class="col-lg-6">
                    <label><strong>Mobile Number:</strong></label>
                    <p>{{ $data->code }} {{ $data->mobile_number ?? 'N/A' }}</p>
                </div>
                @php
                $mobile_number_array = array();
                if(isset($data->extra_mobile_number)){
                $mobile_number_array = json_decode($data->extra_mobile_number, true);
                }
                @endphp
                @foreach($mobile_number_array as $mobile_num_key=> $mobile_num)
                <div class="col-lg-6">
                    <label><strong>Name</strong></label>
                    <p>{{ $mobile_num['name'] ?? null }}</p>
                </div>
                <div class="col-lg-6">
                    <label><strong>Mobile number</strong></label>
                    <p>{{ $mobile_num['code'] ?? null }} {{ $mobile_num['mobile_number'] ?? null }}</p>
                </div>
                @endforeach
                <div class="col-lg-6">
                    <label><strong>Country:</strong></label>
                    <p>{{ $data->country->country_name ?? 'N/A' }}</p>
                </div>
                <div class="col-lg-6">
                    <label><strong>State:</strong></label>
                    <p>{{ $data->state->state_name ?? 'N/A' }}</p>
                </div>
                <div class="col-lg-6">
                    <label><strong>City:</strong></label>
                    <p>{{ $data->city->city_name ?? 'N/A' }}</p>
                </div>
                <div class="col-lg-6">
                    <label><strong>Village:</strong></label>
                    <p>{{ $data->village ?? 'N/A' }}</p>
                </div>
                <div class="col-lg-6">
                    <label><strong>Location:</strong></label>
                    <p>{{ $data->location ?? 'N/A' }}</p>
                </div>
                <div class="col-lg-6">
                    <label><strong>Facebook Link:</strong></label>
                    <p>{{ $data->facebook_link ?? 'N/A' }}</p>
                </div>
                <div class="col-lg-6">
                    <label><strong>Instagram Link:</strong></label>
                    <p>{{ $data->instagram_link ?? 'N/A' }}</p>
                </div>
                <div class="col-lg-6">
                    <label><strong>Web Link :</strong></label>
                    <p>{{ $data->web_link ?? 'N/A' }}</p>
                </div>

                <div class="col-lg-6" id="sound_farm_name_div" style="display: none">
                    <label><strong>Sound Farm Name :</strong></label>
                    <p>{{ $data->sound_farm_name ?? 'N/A' }}</p>
                </div>
                <div class="col-lg-6" id="company_about_div" style="display: none">
                    <label><strong>Company About :</strong></label>
                    <p>{{ $data->company_about ?? 'N/A' }}</p>
                </div>
                <div class="col-lg-6" id="description_div" style="display: none">
                    <label><strong>Description :</strong></label>
                    <p>{{ $data->description ?? 'N/A' }}</p>
                </div>
                <div class="col-lg-6" id="authorised_dealer_company_name_div" style="display: none">
                    <label><strong>Authorised Dealer Company Name :</strong></label>
                    <p>{{ $data->description ?? 'N/A' }}</p>
                </div>
            </div>
            <div class="row" id="catalogue_pdf_div" style="display: none;">
                @if ($data->dealer_list_area_wise_type && $data->dealer_list_area_wise_type == "pdf")
                <div class="col-lg-6">
                    <label><strong>Dealer List Area Wise</strong></label>
                    <label><strong>PDF :</strong></label>
                    <p><a href="{{ $data->dealer_list_area_wise_pdf_url }}" target="_blank">View</a></p>
                </div>
                @elseif ($data->dealer_list_area_wise_type && $data->dealer_list_area_wise_type == "website")
                <div class="col-lg-6">
                    <label><strong>Dealer List Area Wise</strong></label>
                    <label><strong>Website Link :</strong></label>
                    <p>{{ $data->dealer_list_area_wise_website ?? 'N/A' }}</p>
                </div>
                @endif
                @if ($data->catalogue_type && $data->catalogue_type == "pdf")
                <div class="col-lg-6">
                    <label><strong>Catalogue</strong></label>
                    <label><strong>PDF :</strong></label>
                    <p><a href="{{ $data->catalogue_pdf_url }}" target="_blank">View</a></p>
                </div>
                @elseif ($data->catalogue_type && $data->catalogue_type == "website")
                <div class="col-lg-6">
                    <label><strong>Catalogue</strong></label>
                    <label><strong>Website Link :</strong></label>
                    <p>{{ $data->catalogue_website ?? 'N/A' }}</p>
                </div>
                @endif
            </div>
        </div>

        <div class="row">
            <div class="col-lg-6">
                <div class="kt-form kt-form--label-right">
                    <div class="kt-portlet__body">
                        <div class="kt-widget kt-widget--user-profile-3">
                            <div class="kt-widget__top">
                                <div class="kt-widget__media">
                                    <div class="media-item">
                                        @if ($data->image)
                                        <label><strong>Image:</strong></label>
                                        <div>
                                            <a href="{{ $data->image_url }}" target="_blank">
                                                <img src="{{ $data->image_url }}" alt="Image">
                                            </a>
                                        </div>
                                        @endif
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-lg-6">
                <div class="kt-form kt-form--label-right">
                    <div class="kt-portlet__body">
                        <div class="kt-widget kt-widget--user-profile-3">
                            <div class="kt-widget__top">
                                <div class="kt-widget__media">
                                    <div class="media-item">
                                        @if ($data->visiting_card_image)
                                        <label><strong>Visiting Card Image:</strong></label>
                                        <div>
                                            <a href="{{ $data->visiting_card_image_url }}" target="_blank">
                                                <img src="{{ $data->visiting_card_image_url }}" alt="Image">
                                            </a>
                                        </div>
                                        @endif
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>






    </div>
</div>
<input type="hidden" id="role_id" name="role_id" value="{{ $data->role_id ?? null }}">
@endsection
@push('script')
<script>
    $(document).ready(function () {
        var selectedValues = $("#role_id").val();
        $("#sound_farm_name_div").css("display", "none");
        $("#description_div").css("display", "none");
        $("#authorised_dealer_company_name_div").css("display", "none");
        $("#company_about_div").css("display", "none");
        $("#catalogue_pdf_div").css("display", "none");
        $("#service_center_div").css("display", "none");
        $("#secondary_name_div").css("display", "none");
        $("#secondary_mobile_number_div").css("display", "none");
        $("#export_name_div").css("display", "none");
        $("#export_mobile_number_div").css("display", "none");
        $("#domestic_name_div").css("display", "none");
        $("#domestic_mobile_number_div").css("display", "none");
        $("#youtube_link_div").css("display", "none");
        if (selectedValues.includes("1")) { // provider
            $("#sound_farm_name_div").css("display", "block");
            $("#description_div").css("display", "block");
        }
        if (selectedValues.includes("2")) { // supplier dealer
            $("#sound_farm_name_div").css("display", "block");
            $("#description_div").css("display", "block");
            $("#authorised_dealer_company_name_div").css("display", "block");
            $("#secondary_name_div").css("display", "block");
            $("#secondary_mobile_number_div").css("display", "block");
        }
        if (selectedValues.includes("3")) { // manufacturing
            $("#description_div").css("display", "block");
            $("#authorised_dealer_company_name_div").css("display", "block");
            $("#company_about_div").css("display", "block");
            $("#catalogue_pdf_div").css("display", "block");
            $("#export_name_div").css("display", "block");
            $("#export_mobile_number_div").css("display", "block");
            $("#domestic_name_div").css("display", "block");
            $("#domestic_mobile_number_div").css("display", "block");
        }
        if (selectedValues.includes("4")) { // dj operator
            $("#youtube_link_div").css("display", "block");
        }
        if (selectedValues.includes("5")) { // sound operator
            $("#youtube_link_div").css("display", "block");
        }
        if (selectedValues.includes("6")) { // spearpart
            $("#sound_farm_name_div").css("display", "block");
            $("#description_div").css("display", "block");
            $("#company_about_div").css("display", "block");
            $("#catalogue_pdf_div").css("display", "block");
        }
        if (selectedValues.includes("7")) { // company service center
            $("#description_div").css("display", "block");
            $("#service_center_div").css("display", "block");
        }
        if (selectedValues.includes("8")) { // private repairing shop
            $("#description_div").css("display", "block");
        }
        if (selectedValues.includes("9")) { // sound education
            $("#youtube_link_div").css("display", "block");
            $("#description_div").css("display", "block");
        }

    });
</script>
@endpush
