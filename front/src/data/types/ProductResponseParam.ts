import {CatalogueDatum} from './AuthData';
import {Meta} from './GenericParams';
import {ProductBean} from './ProductParam';

export type ProductResponseBean = {
  status?: boolean;

  data?: ProductBean[];
  meta?: Meta;
};

export type ProductPaginationResponseBean = {
  status?: boolean;
  data: {
    data: ProductBean[];
    meta: Meta;
  };
};
export type FavPaginationResponseBean = {
  status?: boolean;
  data: {
    data: ProductBean[];
    meta: Meta;
  };
};

export type ProductResponseDetailBean = {
  status?: boolean;
  data?: ProductBean;
};

export type ProductDetailBean = {
  detailInfo?: ProductBean;
  relatedPosts?: ProductBean[];
  sellerPosts?: ProductBean[];
};

export type RequirementPostBean = {
  buyerPosts?: ProductBean[];
  sellerPosts?: ProductBean[];
};

export type CatalogueResponse = {
  status?: boolean;
  data?: CatalogueDatum[];
};

export type CataloguePaginationResponse = {
  status?: boolean;
  data: {
    data: CatalogueDatum[];
    meta: Meta;
  };
};
