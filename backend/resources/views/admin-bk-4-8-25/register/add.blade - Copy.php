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
<style>
    .select2-selection__choice {
        color: #000 !important;
    }
    .select2-search__field{
          width: 35.75em !important;
    }
</style>
<!-- begin:: Subheader -->
<div class="kt-subheader   kt-grid__item" id="kt_subheader">
    <div class="kt-subheader__main">
        <h3 class="kt-subheader__title">Users & Directory</h3>
        <span class="kt-subheader__separator kt-hidden"></span>
        <div class="kt-subheader__breadcrumbs">
            <span class="kt-subheader__breadcrumbs-separator"></span>
            <a href="{{ route('admin.register.list') }}" class="kt-subheader__breadcrumbs-link" title="Back">List</a>
            <span class="kt-subheader__breadcrumbs-separator"></span>
            <a href="javascript:;" class="kt-subheader__breadcrumbs-link"
               title="Back">{{ $data ? 'Edit' : 'Add' }}</a>
        </div>
    </div>

</div>

<!-- end:: Subheader -->

<!-- begin:: Content -->
<div class="kt-content  kt-grid__item kt-grid__item--fluid" id="kt_content">
    @include('admin.layouts.flash-message')
    <div class="kt-portlet kt-portlet--mobile">
        <div class="kt-portlet__head kt-portlet__head--lg">
            <div class="kt-portlet__head-label">
                <span class="kt-portlet__head-icon">
                    <i class="kt-font-brand flaticon-user-settings"></i>
                </span>
                <h3 class="kt-portlet__head-title">
                    {{ $data ? 'Edit' : 'Add' }} Users & Directory
                </h3>
            </div>
        </div>
        <!--begin::Portlet-->
        <!--begin::Form-->
        <form class="kt-form" action="{{ route('admin.register.store') }}" id="user-add-from" method="post"
              isReload="{{ route('admin.register.list') }}" enctype="multipart/form-data">
            @csrf
            <input type="hidden" name="edit_id" value="{{ $data->id ?? null }}">
            <input type="hidden" name="status" value="{{ $data->status ?? '1' }}">
            <div class="kt-portlet__body">
                <div class="form-group row">
                    <div class="form-group col-lg-6">
                        <label>Role: <span class="text-danger">*</span></label>
                        <select id="role_id" name="role_id" class="form-control">
                            <option value="">Select Role</option>
                            @foreach($role as $role_row)
                            <option value="{{ $role_row->id }}"
                                    @if(isset($data) && $data->role_id == $role_row->id) selected @endif>
                                    {{ $role_row->name }}
                        </option>
                        @endforeach
                    </select>
                </div>
                <div class="form-group col-lg-6">
                    <label>Name <span class="text-danger">*</span></label>
                    <input type="text" name="name" id="name" placeholder="Enter Name" value="{{ $data->name ?? null }}" class="form-control">
                </div>
                <div class="form-group col-lg-6" id="service_center_div" style="display: none">
                    <label>Company Name:</label>
                    <select id="company_name" name="company_name[]" multiple="multiple" class="form-control select2">
                        @foreach($company as $company_row)
                        <option value="{{ $company_row->id }}"
                                @if(isset($data) && isset($data->company_name) && in_array($company_row->id, json_decode($data->company_name))) selected @endif>
                                {{ $company_row->name }}
                        </option>
                    @endforeach
                </select>
            </div>    
            <div class="form-group col-lg-6">
                <label>Email <span class="text-danger">*</span></label>
                <input type="email" name="email" id="email" placeholder="Enter Email"
                       value="{{ $data->email ?? null }}" class="form-control">
            </div>
            <div class="form-group col-lg-6">
                <label>Mobile Number <span class="text-danger">*</span></label>
                <input type="tel" id="mobile_number" name="mobile_number" data-validation="required|number" value="{{ $data->code ?? null }}{{ $data->mobile_number ?? null }}" class="form-control only-mobile" placeholder="">
            </div>
            <input type="hidden" name="code" id="country_code" value="{{ $data->code ?? null }}">
            <div class="form-group col-lg-6">
                <label>Password <span class="text-danger">*</span></label>
                <input type="password" name="password" id="password" placeholder="Enter Password" value="" class="form-control">
            </div>
            <div class="form-group col-lg-6">
                <label>Confirm Password <span class="text-danger">*</span></label>
                <input type="password" name="confirm_password" id="confirm_password" placeholder="Enter Confirm Password" value="" class="form-control">
            </div>



            <div class="form-group col-lg-6">
                <label>Country: <span class="text-danger">*</span></label>
                <select id="country_id" name="country_id" class="form-control">
                    <option value="">Select Country</option>
                    @foreach($country as $country_row)
                    <option value="{{ $country_row->id }}"
                            @if(isset($data) && $data->country_id == $country_row->id) selected @endif>
                            {{ $country_row->country_name }}
                </option>
                @endforeach
            </select>
        </div>
        <div class="form-group col-lg-6">
            <label>State: <span class="text-danger">*</span></label>
            <select id="state_id" name="state_id" class="form-control">
                <option value="">Select Country First</option>
            </select>
        </div>
        <div class="form-group col-lg-6">
            <label>City: <span class="text-danger">*</span></label>
            <select id="city_id" name="city_id" class="form-control">
                <option value="">Select State First</option>
            </select>
        </div>
        <div class="form-group col-lg-6">
            <label>Village <span class="text-danger">*</span></label>
            <input type="text" name="village" id="village" placeholder="Enter Village" value="{{ $data->village ?? null }}" class="form-control">
        </div>
        <div class="form-group col-lg-6">
            <label>Location <span class="text-danger">*</span></label>
            <input type="text" name="location" id="location" placeholder="Enter Location" value="{{ $data->location ?? null }}" class="form-control">
            <input type="hidden" name="latitude" id="latitude" value="{{ $data->latitude ?? null }}">
            <input type="hidden" name="longitude" id="longitude" value="{{ $data->longitude ?? null }}">
        </div>
        <div class="form-group col-lg-6">
            <label>Facebook Link <span class="text-danger">*</span></label>
            <input type="text" name="facebook_link" id="facebook_link" placeholder="Enter Facebook Link" value="{{ $data->facebook_link ?? null }}" class="form-control">
        </div>
        <div class="form-group col-lg-6">
            <label>Instagram Link <span class="text-danger">*</span></label>
            <input type="text" name="instagram_link" id="instagram_link" placeholder="Enter Instagram Link" value="{{ $data->instagram_link ?? null }}" class="form-control">
        </div>
        <div class="form-group col-lg-6">
            <label>Web Link <span class="text-danger">*</span></label>
            <input type="text" name="web_link" id="web_link" placeholder="Enter Web Link" value="{{ $data->web_link ?? null }}" class="form-control">
        </div>
        <div class="form-group col-lg-6">
            <label>Profile Image  (Upload By: 45 X 45 ) {!! $data && $data->image ? '' : '<span class="text-danger">*</span>' !!} </label>
            <div class="custom-file">
                <input type="file" name="image" class="custom-file-input" id="userImage"
                       accept="image/*">
                <label class="custom-file-label text-truncate" for="userImage">Choose file</label>
                <span class="form-text text-muted">The Image must not be greater than 2MB. and file type:
                    jpg, jpeg, png.</span>
                @if ($data && $data->image)
                <a href="{{ $data->image_url }}" target="_blank">View Image</a>
                @endif
            </div>
        </div>
        <div class="form-group col-lg-6">
            <label>Visiting Card Image </label>
            <div class="custom-file">
                <input type="file" name="visiting_card_image" class="custom-file-input" id="userImage" accept="image/*">
                <label class="custom-file-label text-truncate" for="userImage">Choose file</label>
                <span class="form-text text-muted">The Image must not be greater than 2MB. and file type:
                    jpg, jpeg, png.</span>
                @if ($data && $data->visiting_card_image)
                <a href="{{ $data->visiting_card_image_url }}" target="_blank">View Image</a>
                @endif
            </div>
        </div>
        <div class="form-group col-lg-6" id="sound_farm_name_div" style="display: none">
            <label>Sound Farm Name</label>
            <input type="text" name="sound_farm_name" id="sound_farm_name" placeholder="Enter Sound Farm Name" value="{{ $data->sound_farm_name ?? null }}" class="form-control">
        </div>

        <div class="form-group col-lg-6" id="description_div" style="display: none">
            <label>Description</label>
            <textarea id="description" name="description" placeholder="Enter Description" class="form-control" >{{ $data->description ?? null }}</textarea>
        </div>
        <div class="form-group col-lg-6" id="authorised_dealer_company_name_div" style="display: none">
            <label>Authorised Dealer Company Name</label>
            <input type="text" name="authorised_dealer_company_name" id="authorised_dealer_company_name" placeholder="Enter Authorised Dealer Company Name" value="{{ $data->authorised_dealer_company_name ?? null }}" class="form-control">
        </div>
        <div class="form-group col-lg-6" id="company_about_div" style="display: none">
            <label>Company About</label>
            <textarea id="company_about" name="company_about" placeholder="Enter Company About" class="form-control" >{{ $data->company_about ?? null }}</textarea>
        </div>
    </div>
    <div id="catalogue_pdf_div" style="display: none;">
        <div class="col-md-12">
            <button type="button" class="btn btn-primary add-catalogue-btn"> + Add Catalogue Pdf </button>
        </div><hr/>
        @if ($catalogue_data)
        @foreach($catalogue_data as $catalogue_data_row)
        <div class="wrapper_view">
            <div class="box_view a">
                {{ $catalogue_data_row->name }}
            </div>
            <div class="box_view b">
                <a href="{{ $catalogue_data_row->image_url }}" target="_blank">View Pdf</a>
            </div>
            <div class="box_view c">
                <button type="button" data-id="{{ $catalogue_data_row->id }}" class="btn btn-danger remove-catalogue-more-btn"> X </button>
            </div>
        </div>
        @endforeach
        @endif
        <div class="row add-catalogue-content"></div>
    </div>
    <div class="kt-portlet__foot">
        <div class="kt-form__actions">
            <button type="submit" class="btn btn-brand">Save</button>
            <button type="button" class="btn btn-secondary" onclick="window.history.back()">Cancel</button>

        </div>
    </div>
</div>
</form>
</div>
</div>
<input type="hidden" id="state_id1" name="state_id1" value="{{ $data->state_id ?? null }}">
<input type="hidden" id="city_id1" name="city_id1" value="{{ $data->city_id ?? null }}">
@endsection
@push('script')
<script>
    $('#role_id').on('change', function () {
    var role_id = $(this).val();
    $("#sound_farm_name_div").css("display", "none");
    $("#description_div").css("display", "none");
    $("#authorised_dealer_company_name_div").css("display", "none");
    $("#company_about_div").css("display", "none");
    $("#catalogue_pdf_div").css("display", "none");
    $("#service_center_div").css("display", "none");
    if (role_id == 1){ // provider
    $("#sound_farm_name_div").css("display", "block");
    $("#description_div").css("display", "block");
    $("#authorised_dealer_company_name_div").css("display", "none");
    $("#company_about_div").css("display", "none");
    $("#catalogue_pdf_div").css("display", "none");
    $("#service_center_div").css("display", "none");
    } else if (role_id == 2){ // supplier dealer
    $("#sound_farm_name_div").css("display", "block");
    $("#description_div").css("display", "block");
    $("#authorised_dealer_company_name_div").css("display", "block");
    $("#company_about_div").css("display", "none");
    $("#catalogue_pdf_div").css("display", "none");
    $("#service_center_div").css("display", "none");
    } else if (role_id == 3){ // manufacturing
    $("#sound_farm_name_div").css("display", "none");
    $("#description_div").css("display", "block");
    $("#authorised_dealer_company_name_div").css("display", "block");
    $("#company_about_div").css("display", "block");
    $("#catalogue_pdf_div").css("display", "block");
    $("#service_center_div").css("display", "none");
    } else if (role_id == 4){ // dj operator
    $("#sound_farm_name_div").css("display", "none");
    $("#description_div").css("display", "none");
    $("#authorised_dealer_company_name_div").css("display", "none");
    $("#company_about_div").css("display", "none");
    $("#catalogue_pdf_div").css("display", "none");
    $("#service_center_div").css("display", "none");
    } else if (role_id == 5){ // sound operator
    $("#sound_farm_name_div").css("display", "none");
    $("#description_div").css("display", "none");
    $("#authorised_dealer_company_name_div").css("display", "none");
    $("#company_about_div").css("display", "none");
    $("#catalogue_pdf_div").css("display", "none");
    $("#service_center_div").css("display", "none");
    } else if (role_id == 6){ // spearpart
    $("#sound_farm_name_div").css("display", "block");
    $("#description_div").css("display", "block");
    $("#authorised_dealer_company_name_div").css("display", "none");
    $("#company_about_div").css("display", "block");
    $("#catalogue_pdf_div").css("display", "block");
    $("#service_center_div").css("display", "none");
    } else if (role_id == 7){ // company service center
    $("#sound_farm_name_div").css("display", "none");
    $("#description_div").css("display", "block");
    $("#authorised_dealer_company_name_div").css("display", "none");
    $("#company_about_div").css("display", "none");
    $("#catalogue_pdf_div").css("display", "none");
    $("#service_center_div").css("display", "block");
    } else if (role_id == 8){ // private repairing shop
    $("#sound_farm_name_div").css("display", "none");
    $("#description_div").css("display", "block");
    $("#authorised_dealer_company_name_div").css("display", "none");
    $("#company_about_div").css("display", "none");
    $("#catalogue_pdf_div").css("display", "none");
    $("#service_center_div").css("display", "none");
    } else if (role_id == 9){ // sound education
    $("#sound_farm_name_div").css("display", "none");
    $("#description_div").css("display", "block");
    $("#authorised_dealer_company_name_div").css("display", "none");
    $("#company_about_div").css("display", "none");
    $("#catalogue_pdf_div").css("display", "none");
    $("#service_center_div").css("display", "none");
    }

    });</script>
<script>
    let count3 = 0;
    $(document).on('click', '.add-catalogue-btn', function() {
    let html = `<div class="wrapper remove-catalogue">
                            <div class="box a">
                                <input type="text" name="catalogue_name[${count3}]" placeholder="Enter Catalogue Name" value="" class="form-control">
                            </div>
                            <div class="box b">
                                <input type="file" name="catalogue_pdf[${count3}]" class="form-control" accept="application/pdf" data-validation-allowing="pdf" >
                            </div>
                            <div class="box c">
                                <button type="button" class="btn btn-danger remove-catalogue-more-btn"> X </button>
                            </div>
                        </div>`;
    $('.add-catalogue-content').append(html);
    count3++;
    });
    $(document).on('click', '.remove-catalogue-more-btn', function() {
    let id3 = $(this).data('id');
    if (id3) {
    $.ajax({
    url: "{{ route('admin.directory.delete.catalogue.pdf') }}",
            type: "post",
            data: {
            "_token": "{{ csrf_token() }}",
                    imageID: id3
            },
            success: function(response) {
            $status = 'error';
            Toast.fire({
            icon: $status,
                    title: response.message
            })
                    location.reload();
            $(this).closest('.remove-catalogue').remove();
            }
    });
    } else {
    $(this).closest('.remove-catalogue').remove();
    }
    });</script>
<script type="text/javascript">
    let conf = {
    rules: {
    image: {
    required: {{ $data ? 'false' : true }},
    },
            password: {
            required: {{ $data ? 'false' : true }},
            },
            confirm_password: {
            required: {{ $data ? 'false' : true }},
            },
            role_id: {
            required: true,
            },
            name: {
            required: true,
            },
            email: {
            required: true,
            },
            mobile_number: {
            required: true,
            },
            country_id: {
            required: true,
            },
            state_id: {
            required: true,
            },
            city_id: {
            required: true,
            },
            village: {
            required: true,
            },
            location: {
            required: true,
            },
            facebook_link: {
            required: true,
            },
            instagram_link: {
            required: true,
            },
            web_link: {
            required: true,
            },
    },
    };
    validationFormAndSubmit($('#user-add-from'), conf);</script>
<script>
    $(document).ready(function () {
        $('.select2').select2();
    var state_id1 = $("#state_id1").val();
    var city_id1 = $("#city_id1").val();
    $('#country_id').on('change', function () {
    var country_id = $(this).val();
    var url = "{{ route('admin.register.getstate', ':country_id') }}";
    url = url.replace(':country_id', country_id);
    if (country_id === '') {
    $('#state_id').empty().append('<option value="">Select State</option>');
    return;
    }
    $.ajax({
    url: url,
            type: "GET",
            dataType: "json",
            success: function (data) {
            $('#state_id').empty().append(
                    '<option value="">Select State</option>');
            $.each(data, function (key, value) {
            if (state_id1 == value.id) {
            $('#state_id').append('<option selected value="' + value.id +
                    '">' + value.state_name + '</option>');
            } else {
            $('#state_id').append('<option value="' + value.id +
                    '">' + value.state_name + '</option>');
            }

            });
            $('#state_id').trigger('change');
            }
    });
    });
    $('#state_id').on('change', function () {
    var state_id = $(this).val();
    var url = "{{ route('admin.register.getcity', ':state_id') }}";
    url = url.replace(':state_id', state_id);
    if (state_id === '') {
    $('#city_id').empty().append('<option value="">Select city</option>');
    return;
    }
    $.ajax({
    url: url,
            type: "GET",
            dataType: "json",
            success: function (data) {
            $('#city_id').empty().append(
                    '<option value="">Select City</option>');
            $.each(data, function (key, value) {
            if (city_id1 == value.id) {
            $('#city_id').append('<option selected value="' + value.id +
                    '">' + value.city_name + '</option>');
            } else {
            $('#city_id').append('<option value="' + value.id +
                    '">' + value.city_name + '</option>');
            }

            });
            }
    });
    });
    $('#country_id').trigger('change');
    $('#role_id').trigger('change');
    });</script>
<script>
    $.validator.addMethod("validEmail", function(value, element) {
    return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value);
    }, "Please enter a valid company email");
    $.validator.addMethod("notDisposableEmail", function(value, element) {
    var disposableEmails = ['example.com', 'example.org', 'example.net'];
    var domain = value.split('@')[1];
    return disposableEmails.indexOf(domain) === - 1;
    }, "Disposable company email addresses are not allowed");
    $.validator.addMethod("ValidPhoneNumber", function(value, element) {
    var input = $("#mobile_number");
    return input.intlTelInput("isValidNumber"); // Check if the number is valid based on the country
    }, "Phone Number does not match the selected country code");
    var input = $("#mobile_number");
    if (input.length > 0) {
    input.intlTelInput({
    initialCountry: "gb",
            separateDialCode: true,
            utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js"
    });
    input.on("countrychange keyup", function() {
    var selectedCountryData = input.intlTelInput("getSelectedCountryData");
    var countryCode = selectedCountryData.dialCode;
    $("#country_code").val("+" + countryCode);
    });
    }
</script>

@endpush
