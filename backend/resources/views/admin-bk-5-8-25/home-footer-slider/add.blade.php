@extends('admin.layouts.default')
@section('title', 'Home Footer Slider')
@section('content')

<div class="kt-subheader   kt-grid__item" id="kt_subheader">
    <div class="kt-subheader__main">
        <h3 class="kt-subheader__title">Home Footer Slider</h3>
        <span class="kt-subheader__separator kt-hidden"></span>
        <div class="kt-subheader__breadcrumbs">
            <span class="kt-subheader__breadcrumbs-separator"></span>
            <a href="{{ route('admin.home_footer_slider.list') }}" class="kt-subheader__breadcrumbs-link" title="Back">List</a>
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
                    {{ $data ? 'Edit' : 'Add New' }} Home Footer Slider
                </h3>
            </div>
        </div>
        <!--begin::Portlet-->
        <!--begin::Form-->
        <form class="kt-form" action="{{ route('admin.home_footer_slider.store') }}" id="amenities-add-from" method="post"
              isReload="{{ route('admin.home_footer_slider.list') }}" enctype="multipart/form-data">
            <div class="kt-portlet__body">
                @csrf
                <input type="hidden" name="edit_id" value="{{ $data->id ?? null }}">
                <input type="hidden" name="status" value="{{ $data->status ?? 1 }}">

                @if ($data)
                <div class="form-group row">
                    <div class="custom-file">
                        <label>Image <span class="text-danger">*</span></label><br/>
                        <input type="file" name="image" id="image" accept="image/*">
                        @if ($data && $data->image)
                        <a href="{{ $data->image_url }}" target="_blank">View Image</a>
                        @endif
                    </div>
                </div>
                @else
                <div class="form-group row">
                    <div class="col-lg-6">
                        <label>Image <span class="text-danger">*</span></label><br/>
                        <input type="file" name="image" id="image" accept="image/*">
                    </div>
                    <div class="col-lg-6">
                        <button type="button" class="btn btn-brand btn_add_more add_more"><i class="la la-plus"></i></button>
                    </div>    
                </div>
                <div class="form-group row" id="append_html">

                </div>
                @endif
                <div class="kt-portlet__foot">
                    <div class="kt-form__actions">
                        <button type="submit" class="btn btn-brand">Save</button>
                        <button type="button" class="btn btn-secondary" onclick="window.history.back()">Cancel</button>
                    </div>
                </div>
            </div>
        </form>
        <!--end::Form-->
    </div>
</div>
@endsection
@push('script')
<script type="text/javascript">
    let conf = {
        rules: {
            image: {
                required: {{ $data ? 'false' : true }},
            },
        },
        messages: {
        },
    };

    validationFormAndSubmit($('#amenities-add-from'), conf);
    document.getElementById('image').addEventListener('change', function () {
        let fileName = this.files[0] ? this.files[0].name : 'Choose file';
        let nextSibling = this.nextElementSibling;
        if (nextSibling && nextSibling.classList.contains('custom-file-label')) {
            nextSibling.textContent = fileName;
        }
        $(this).valid();
    });
</script>
<script>
    $('.add_more').click(function () {
        var newItem = '<div class="form-group col-lg-6"><label>Image</label><br/><input type="file" name="image1[]" id="image1" accept="image/*"></div><div class="form-group col-lg-6"></div>';
        $('#append_html').append(newItem);
    });
</script>
<script>
    $(document).ready(function () {
        var input = document.querySelector("#country");
        var countryCodeInput = document.querySelector("#countryCode");
        var iti = window.intlTelInput(input, {
            separateDialCode: false,
            initialCountry: "{{ $data->country_code ?? 'ae' }}",
            geoIpLookup: function (callback) {
                $.get('https://ipinfo.io', function () {}, "jsonp").always(function (resp) {
                    var countryCode = (resp && resp.country) ? resp.country : "ae";
                    callback(countryCode);
                });
            },
            utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js"
        });

        // Update #country and #countryCode on initialization
        var initialCountryData = iti.getSelectedCountryData();
        var initialCountryName = initialCountryData.name;
        var initialCountryCode = initialCountryData.iso2;
        $("#country").val(initialCountryName);
        $("#countryCode").val(initialCountryCode);

        // Update #country and #countryCode when the country is changed
        input.addEventListener("countrychange", function () {
            var countryData = iti.getSelectedCountryData();
            var countryName = countryData.name;
            var countryCode = countryData.iso2;
            $("#country").val(countryName);
            $("#countryCode").val(countryCode);
        });

        // Allow user to edit the country code directly in the input field
        $("#countryCode").on("input", function () {
            var code = $(this).val();
            iti.setCountry(code);
            var countryData = iti.getSelectedCountryData();
            var countryName = countryData.name;
            $("#country").val(countryName);
        });
    });
</script>
@endpush
