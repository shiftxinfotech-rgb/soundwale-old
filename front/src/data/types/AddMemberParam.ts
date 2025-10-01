import {CountryCodeParams} from './CountryCodeParams';
import {SelectedProductParams} from './EditProfileParams';
import {DropDownListParams} from './UtilityParams';

export interface AddMemberFormParams {
  selectedMember: Array<string>;
  selectedName: string;
  selectedIds: string;
  mobile_number?: string;
  countryCode?: CountryCodeParams;
  email?: string;
  code?: string;
}
export interface MemberItemProps {
  title: string;
  type: string;
}
export interface AddMemberScreenParam {
  mobile_number: string;
  email: string;
  countryCode?: CountryCodeParams;
  code: string;
}

export type ServiceInfo = {
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

export type InputFormParam = {
  countryCode: CountryCodeParams;
  name?: string;
  service_info: ServiceInfo[];
  your_best_engineer: string[];
  personal_name?: string;
  email?: string;
  mobile_number: string;
  country: DropDownListParams;
  city: DropDownListParams;
  state: DropDownListParams;
  villageOrCity?: string;
  instagram_link: string;
  facebook_link: string;
  website?: string;
  dealer_list_area_wise_type: DropDownListParams;
  dealer_list_area_wise?: string;
  dealer_list_area_wise_website?: string;
  visiting_card_image?: string;
  visiting_card_file?: string;
  catalogue_type: DropDownListParams;
  company_about?: string;
  serviceCenterCompany?: string;
  description?: string;
  soundProvider?: string;
  working_with?: Array<string>;
  profile_file?: string;
  manufacturer?: string;
  companyName?: string;
  location?: string;
  domestic_name?: string;
  dealerListLink?: string;
  profile?: string | null;
  catalogue_website?: string;
  dealer_list_area_wise_pdf?: string;
  catalogue_pdf?: string | null;
  selectedMember?: string[];
  categories_name: DropDownListParams[];
  sub_categories_name: DropDownListParams[];
  category_id: string[] | SelectedProductParams[];
  sub_category_id: string[];
  authorised_dealer_company_name?: DropDownListParams;
  service_center?: string;
  youtube_link: string;
  coaching_class?: string;
  description_pdf?: string;
  description_pdf_file?: string;
  web_link?: string;
  export_name?: string;
  dealer_list_area_wise_file?: string;
  catalogue_file?: string;
  new_company?: string;
  district?: string;
  gender?: DropDownListParams;
  taluka?: string;
  extra_mobile_number?: Array<{
    name: string;
    mobile_number: string;
    countryCode: CountryCodeParams;
    email?: string;
    available_on_whatsapp_with_same_number?: boolean;
    w_mobile_number?: string;
    w_countryCode?: CountryCodeParams;
    designation?: string;
    type?: string;
  }>;
};
