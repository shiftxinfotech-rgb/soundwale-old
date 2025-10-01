import {ImageOrVideo} from 'react-native-image-crop-picker';
import {AuthData} from './AuthData';
import {CountryCodeParams} from './CountryCodeParams';
import {DropDownListParams} from './UtilityParams';

export type EditProfileFormParam = {
  name: string;
  email: string;
  mobile_number: string;
  village: string;
  personal_name: string;
  visiting_card_image: string;
  service_info: ServiceCenterInfo[];
  gender: DropDownListParams;
  facebook_link: string;
  gst_number: string;
  business_name: string;
  your_best_engineer: string[];
  youtube_link: string;
  instagram_link: string;
  web_link: string;
  description: string;
  location: string;
  visiting_card_file: string;
  countryCode: CountryCodeParams;
  city: DropDownListParams | undefined;
  taluka: string;
  image: string;
  district: string;
  state: DropDownListParams | undefined;
  country: DropDownListParams | undefined;
  roles: string;
  whats_app_code: CountryCodeParams;
  whats_app_mobile_number: string;
  extra_mobile_number?: Array<OtherMobile>;
  categories_name: DropDownListParams[];
  sub_categories_name: DropDownListParams[];
  category_id: string[] | SelectedProductParams[];
  sub_category_id: string[] | SelectedSubProductParams[];
};

export type OtherMobile = {
  id?: string;
  name: string;
  mobile_number: string;
  countryCode: CountryCodeParams | undefined;
  type: string;
  email: string;
};

export type ServiceCenterInfo = {
  id?: string;
  company_id: DropDownListParams[];
  company_name: string[];
  company_dropdown_view?: boolean;
  center_name: string;
  location: string;
  latitude: number;
  longitude: number;
  mobile_number: string;
  countryCode: CountryCodeParams | undefined;
};

export type BusinessEditProfileFormParam = {
  name: string;
  shop_images: ImageOrVideo[];
  otherImage: string;
  address: string;
  working_with?: Array<string>;
  catalogue_file: string;
  description: string;
  description_pdf: string;
  catalogue_website: string;
  description_pdf_file: string;
  dealer_list_area_wise_website: string;
  catalogue_pdf?: string | null;
  catalogue_type: DropDownListParams;
  instagram_link: string;
  web_link: string;
  youtube_link: string;
  companies_id: string[] | SelectedCompanyParams[];
  category_id: string[] | SelectedProductParams[];
  sub_category_id: string[] | SelectedSubProductParams[];
  facebook_link: string;
  service_center_id: DropDownListParams[];
  service_center_address: string;
  companies_name: DropDownListParams[];
  categories_name: DropDownListParams[];
  sub_categories_name: DropDownListParams[];
  company_website: string;
  gst_number: string;
  establishment_year: string;
  annual_turnover: string;
  proof: string;
  proof_file?: string;
  cardShopImage?: string;
  dealer_list_area_wise_type?: DropDownListParams;
  dealer_list_area_wise?: string;
  dealer_list_area_wise_file?: string;
  dealer_list_area_wise_pdf?: string;
  dealerListLink?: string;
  business_card_image?: string;
  company_names: Array<{
    id: string;
    name: string;
    updated_id?: string;
  }>;
  company_pdfs: Array<{
    id: string;
    name: string;
    file: string;
    updated_id?: string;
  }>;
  product_info?: Array<{
    company_id: DropDownListParams;
    product_id: DropDownListParams;
    company_name: string;
    product_name: string;
    company_dropdown_view?: boolean;
    category_dropdown_view?: boolean;
    model_dropdown_view?: boolean;
    model_name: string;
    model_id: DropDownListParams;
    id?: string;
  }>;
};

export type SelectedCompanyParams = {
  company_id: string | number;
  company_name: string;
};
export type SelectedManufacturerParams = {
  manufacturer_id: string | number;
  manufacturer_name: string;
};

export type SelectedProductParams = {
  category_id: string | number;
  category_name: string;
};

export type SelectedSubProductParams = {
  sub_category_id: string | number;
  sub_category_name: string;
};
export type EditProfileNavigationParams = {
  profileData: AuthData;
};
export type EditProfileResponse = {
  status: boolean;
  message: string;
  user: AuthData;
};
export type BusinessEditProfileResponse = {
  status: boolean;
  message: string;
  user: AuthData;
};

export type AddProductRentalFormParams = {
  product_info?: Array<{
    company_id: DropDownListParams;
    product_id: DropDownListParams;
    company_name: string;
    product_name: string;
    company_dropdown_view?: boolean;
    category_dropdown_view?: boolean;
    model_dropdown_view?: boolean;
    model_name: string;
    model_id: DropDownListParams;
    id?: string;
  }>;
};

export type ProductInfoDealerSupplierFormParam = {
  companies_id: string[];
  category_id: string[];
  sub_category_id: string[];
  companies_name: DropDownListParams[];
  categories_name: DropDownListParams[];
  sub_categories_name: DropDownListParams[];
};

export type ServiceCenterFormData = {
  service_info: ServiceCenterInfo[];
};

export type AddWorkingWithOperatorFormParam = {
  working_with?: Array<{id: string; value: string}>;
};

export type AddPartInfoFormParam = {
  spare_part_info?: Array<{
    company_id: DropDownListParams;
    company_name: string;
    parts_id: DropDownListParams;
    parts_name: string;
    details: string;
    id?: string;
  }>;
};

export type AddTechniciansFormParam = {
  your_best_engineer?: Array<{id: string; value: string}>;
};
