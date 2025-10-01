export type FormType =
  | 'sound_provider'
  | 'dealer_supplier'
  | 'manufacturing'
  | 'dj_operator'
  | 'sound_operator'
  | 'spare_part'
  | 'service_center'
  | 'repairing_shop'
  | 'sound_education';

export interface BaseFormData {
  name: string;
  email?: string;
  whatsappNumber: string;
  visitingCard?: File;
  village: string;
  city?: string;
  taluka: string;
  district: string;
  state?: string;
  country?: string;
  location?: string;
  facebook?: string;
  instagram?: string;
  website?: string;
  description?: string;
}

export interface SoundProviderForm extends BaseFormData {
  soundFarm: string;
}

export interface DealerSupplierForm extends BaseFormData {
  email: string;
  soundShopFarm: string;
  authorizedDealer: string;
}

export interface ManufacturingForm extends BaseFormData {
  email: string;
  companyName: string;
  authorizedDealer: string;
  catalogueType: 'pdf' | 'link';
  catalogueFile?: File;
  dealerList: File;
  companyAbout: string;
}

export interface DJOperatorForm extends BaseFormData {
  email: string;
  profile: string; // YouTube URL
}

export interface SoundOperatorForm extends BaseFormData {
  email: string;
}

export interface SparePartForm extends BaseFormData {
  email: string;
  companyName: string;
  authorizedDealer: string;
  catalogueType: 'pdf' | 'link';
  catalogueFile?: File;
  dealerList: File;
  companyAbout: string;
}

export interface ServiceCenterForm extends BaseFormData {
  email: string;
  serviceCenter: string;
}

export interface RepairingShopForm extends BaseFormData {
  email: string;
}

export interface SoundEducationForm extends BaseFormData {
  email: string;
  profile: string; // YouTube URL
}

export type FormData =
  | SoundProviderForm
  | DealerSupplierForm
  | ManufacturingForm
  | DJOperatorForm
  | SoundOperatorForm
  | SparePartForm
  | ServiceCenterForm
  | RepairingShopForm
  | SoundEducationForm;
