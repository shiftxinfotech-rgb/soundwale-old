import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import {AddMemberFormParams, AddMemberScreenParam} from './AddMemberParam';
import {UserTypeNavigationParam} from './BuyerParams';
import {AddCataloguesParams} from './CataloguesParams';
import {ChatDetailParams} from './ChatDetailsParams';
import {CmsNavigation} from './CmsParams';
import {DetailPageParams} from './DetailPageParams';
import {DirectoryDetailParams, DirectoryNavigation} from './DirectoryParams';
import {EditProfileNavigationParams} from './EditProfileParams';
import {FilterScreenParams} from './FilterParams';
import {GalleryDetailParams} from './GalleryParams';
import {LocationScreenParams} from './LocationParams';
import {SelectLocationScreenParams} from './SelectLocationParams';

import {VerificationScreenParams} from './VerificationParams';
export type NavigationParamStack = {
  Splash: undefined;
  Login: undefined;
  Home: undefined;
  Verification: VerificationScreenParams;
  TabNavigator: undefined;
  AddMember: AddMemberScreenParam;
  AddMemberForm: AddMemberFormParams;
  AddPost: UserTypeNavigationParam;
  ProductDetail: DetailPageParams;
  ProductDetailSeller: DetailPageParams;
  FilterScreen: FilterScreenParams;
  DrawerNavigator: undefined;
  Settings: undefined;
  Cms: CmsNavigation;
  FAQ: undefined;
  Notification: undefined;
  ContactUs: undefined;
  Profile: undefined;
  EditProfile: EditProfileNavigationParams;
  BusinessEditProfile: EditProfileNavigationParams;
  Favorite: undefined;
  Location: LocationScreenParams;
  DirectoryList: DirectoryNavigation;
  DirectoryDetail: DirectoryDetailParams;
  CataloguesList: undefined;
  AddCatalogues: AddCataloguesParams;
  RequirementPosts: undefined;
  ShortsListing: undefined;
  AddShort: undefined;
  AddAdvertisement: undefined;
  AddGallery: undefined;
  Gallery: undefined;
  GalleryDetail: GalleryDetailParams;
  AddCompanyPdf: undefined;
  CompanyPdfListing: undefined;
  ChatListing: undefined;
  ChatDetail: ChatDetailParams;
  LocationSelector: SelectLocationScreenParams;
  AddProductRental: EditProfileNavigationParams;
  ProductInfoDealerSupplier: EditProfileNavigationParams;
  AddWorkingWithOperator: EditProfileNavigationParams;
  AddPartInfo: EditProfileNavigationParams;
  AddTechnicians: EditProfileNavigationParams;
  ServiceCenter: EditProfileNavigationParams;
};
export type BottomNavigationParamStack = {
  Home: undefined;
  Buyers: undefined;
  Sellers: undefined;
  Directory: undefined;
  Shorts: undefined;
  DirectoryList: DirectoryNavigation;
};

export type BuyersProps = {
  navigation: BottomTabNavigationProp<BottomNavigationParamStack, 'Buyers'>;
};

export type SellersProps = {
  navigation: BottomTabNavigationProp<BottomNavigationParamStack, 'Sellers'>;
};
