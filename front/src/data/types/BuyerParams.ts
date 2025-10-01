import {ProductBean} from './ProductParam';

export type RelatedPostNavigation = {
  type?: string;
};

export type UserTypeNavigationParam = {
  type: 'buyer' | 'seller';
  requirementInfo?: ProductBean;
  onGoBack?: () => void;
};
