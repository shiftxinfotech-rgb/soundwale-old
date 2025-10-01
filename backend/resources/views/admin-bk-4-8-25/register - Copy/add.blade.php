@extends('admin.layouts.default')
@section('title', 'Users')
@section('content')
<!-- begin:: Subheader -->
<div class="kt-subheader   kt-grid__item" id="kt_subheader">
    <div class="kt-subheader__main">
        <h3 class="kt-subheader__title">Users</h3>
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
                    {{ $data ? 'Edit' : 'Add' }} Users
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
                    <div class="col-lg-6">
                        <label>Name <span class="text-danger">*</span></label>
                        <input type="text" name="name" id="name" placeholder="Enter Name" value="{{ $data->name ?? null }}" class="form-control">
                    </div>
                </div>
                <div class="form-group row">
                    <div class="col-lg-6">
                        <label>Email <span class="text-danger">*</span></label>
                        <input type="email" name="email" id="email" placeholder="Enter Email"
                               value="{{ $data->email ?? null }}" class="form-control">
                    </div>
                    <div class="col-lg-6">
                        <label>Mobile Number <span class="text-danger">*</span></label>
                        <input type="tel" id="mobile_number" name="mobile_number" data-validation="required|number" value="{{ $data->mobile_number ?? null }}" class="form-control only-mobile" placeholder="">
                    </div>
                    <input type="hidden" name="code" id="country_code" value="{{ $data->code ?? null }}">
                </div>
                <div class="form-group row">
                    <div class="col-lg-6">
                        <label>Available on whatsApp with same number?</label>
                        <input type="checkbox" name="available_on_whatsapp_with_same_number"  id="available_on_whatsapp_with_same_number"  value="1" @if(isset($data) && $data->available_on_whatsapp_with_same_number == 0) unchecked @else checked @endif>
                    </div>
                    <div class="col-lg-6" id="whatsapp_div" style="display: none;">
                        <label>WhatsApp</label>
                        <input type="tel" id="whatsapp" name="whatsapp" data-validation="required|number" value="{{ $data->whatsapp ?? null }}" class="form-control only-mobile" placeholder="">
                    </div>
                    <!--<input type="hidden" name="code2" id="country_code2">-->
                </div>
                <div class="form-group row">
                    <div class="col-lg-6">
                        <label>Password <span class="text-danger">*</span></label>
                        <input type="password" name="password" id="password" placeholder="Enter Password" value="" class="form-control">
                    </div>
                    <div class="col-lg-6">
                        <label>Confirm Password <span class="text-danger">*</span></label>
                        <input type="password" name="confirm_password" id="confirm_password" placeholder="Enter Confirm Password" value="{{ $data->confirm_password ?? null }}" class="form-control">
                    </div>
                </div>
                <div class="form-group row">
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
                </div>
                <div class="form-group row">
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
                        <label>City: </label>
                        <select id="city_id" name="city_id" class="form-control">
                            <option value="">Select State First</option>
                        </select>
                    </div>
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
    $(document).ready(function () {
        
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
    });
</script>
<script type="text/javascript">
    let conf = {
    rules: {
    image: {
    required: {{ $data ? 'false' : true }},
    },
            name: {
            required: true,
            },
            email: {
            required: true,
            },
            role: {
            required: true,
            },
            mobile_number: {
                        required: true,
                    },
            password: {{ $data ? 'false' : true }},
            confirm_password: {{ $data ? 'false' : true }},
    },
    };
    validationFormAndSubmit($('#user-add-from'), conf);


</script>
<script>
    $(document).ready(function() {
        $("#available_on_whatsapp_with_same_number").change(function() {
            var isChecked = $(this).prop('checked');  // Get checkbox state (true or false)
            if(isChecked == true){
                $("#whatsapp_div").css("display","none");
            }else{
                $("#whatsapp_div").css("display","block");
            }
        });
        $('#country_id').trigger('change');
    });
</script>
<script>
        $.validator.addMethod("validEmail", function(value, element) {
            return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value);
        }, "Please enter a valid company email");

        $.validator.addMethod("notDisposableEmail", function(value, element) {
            var disposableEmails = ['example.com', 'example.org', 'example.net'];
            var domain = value.split('@')[1];
            return disposableEmails.indexOf(domain) === -1;
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
    <script>
//        $.validator.addMethod("validEmail", function(value, element) {
//            return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value);
//        }, "Please enter a valid company email");
//
//        $.validator.addMethod("notDisposableEmail", function(value, element) {
//            var disposableEmails = ['example.com', 'example.org', 'example.net'];
//            var domain = value.split('@')[1];
//            return disposableEmails.indexOf(domain) === -1;
//        }, "Disposable company email addresses are not allowed");
//
//        $.validator.addMethod("ValidPhoneNumber", function(value, element) {
//            var input = $("#whatsapp");
//            return input.intlTelInput("isValidNumber"); // Check if the number is valid based on the country
//        }, "Phone Number does not match the selected country code");
//
//        var input = $("#whatsapp");
//        
//        if (input.length > 0) {
//            input.intlTelInput({
//                initialCountry: "gb",
//                separateDialCode: true,
//                utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js"
//            });
//
//            input.on("countrychange keyup", function() {
//                var selectedCountryData = input.intlTelInput("getSelectedCountryData");
//                var countryCode = selectedCountryData.dialCode;
//                $("#country_code2").val("+" + countryCode);
//            });
//        }
    </script>
@endpush
