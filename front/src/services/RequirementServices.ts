import {
  GeneralResponse,
  ProductBean,
  ProductDetailBean,
  ProductResponseBean,
  ProductResponseDetailBean,
  RequirementPostBean,
  ProductPaginationResponseBean,
  CataloguePaginationResponse,
} from '@data';
import {RootState} from '@features';
import {baseService} from './BaseService';
import {ApiConstants} from './Constants';

export const RequirementServices = baseService
  .enhanceEndpoints({
    addTagTypes: ['BuyerRequirements', 'WishListRequirements'],
  })
  .injectEndpoints({
    overrideExisting: true,
    endpoints: builder => ({
      addBuyerRequirement: builder.mutation<GeneralResponse, FormData>({
        query: data => ({
          url: ApiConstants.ADD_BUYER_REQUIREMENT,
          method: 'POST',
          body: data,
        }),
        invalidatesTags: ['BuyerRequirements'],
      }),
      addSellerRequirement: builder.mutation<GeneralResponse, FormData>({
        query: data => ({
          url: ApiConstants.ADD_SELLER_REQUIREMENT,
          method: 'POST',
          body: data,
        }),
        invalidatesTags: ['SellerRequirements'],
      }),
      editRequirement: builder.mutation<GeneralResponse, FormData>({
        query: data => ({
          url: ApiConstants.EDIT_REQUIREMENT,
          method: 'POST',
          body: data,
        }),
        invalidatesTags: ['SellerRequirements', 'BuyerRequirements'],
      }),
      deleteRequirementImage: builder.mutation<GeneralResponse, FormData>({
        query: data => ({
          url: ApiConstants.DELETE_REQUIREMENT_IMAGE,
          method: 'POST',
          body: data,
        }),
      }),
      getBuyerRequirements: builder.query<
        ProductPaginationResponseBean | null,
        string | undefined
      >({
        query: data => ({
          url: `${ApiConstants.GET_BUYER_REQUIREMENTS}?${data}`,
          method: 'GET',
        }),
        transformResponse: (
          res: ProductPaginationResponseBean,
        ): ProductPaginationResponseBean => {
          return res;
        },
        providesTags: ['BuyerRequirements'],
      }),
      getSellerRequirements: builder.query<
        ProductPaginationResponseBean,
        string | undefined
      >({
        query: data => ({
          url: `${ApiConstants.GET_SELLER_REQUIREMENTS}?${data}`,
          method: 'GET',
        }),
        transformResponse: (
          res: ProductPaginationResponseBean,
        ): ProductPaginationResponseBean => {
          return res;
        },
        providesTags: ['SellerRequirements'],
      }),
      getBuyerRequirementDetail: builder.query<
        ProductDetailBean,
        {id: string; categories_id: string; limit: number}
      >({
        queryFn: async (queryParams, _queryApi, _extraOptions, fetchWithBQ) => {
          try {
            const {id, categories_id, limit} = queryParams || {};

            const [details, relatedPosts] = await Promise.all([
              fetchWithBQ({
                url: `${ApiConstants.GET_BUYER_REQUIREMENTS_DETAIL}?id=${id}`,
                method: 'GET',
              }),
              fetchWithBQ({
                url: `${ApiConstants.GET_BUYER_RELATED_POSTS}?id=${id}&categories_id=${categories_id}&limit=${limit}`,
                method: 'GET',
              }),
            ]);
            let info = null;
            let relatedInfo = null;
            if (details.error) {
              return {error: details.error};
            } else {
              const productData = details.data as ProductResponseDetailBean;
              info = productData.data;
            }
            if (!relatedPosts.error) {
              const relatedData = relatedPosts.data as ProductResponseBean;
              relatedInfo = relatedData.data ?? [];
            } else {
              relatedInfo = null;
            }

            return {
              data: {
                detailInfo: info,
                relatedPosts: relatedInfo,
              } as ProductDetailBean,
            };
          } catch (error) {
            return {
              error: {status: 'CUSTOM_ERROR', error: (error as Error).message},
            };
          }
        },
      }),
      getBuyerRelatedPost: builder.query<
        ProductPaginationResponseBean,
        string | undefined
      >({
        query: data => ({
          url: `${ApiConstants.GET_BUYER_RELATED_POSTS}?${data}`,
          method: 'GET',
        }),
        transformResponse: (res: ProductPaginationResponseBean) => {
          return res;
        },
      }),
      getBuyerRequirementPost: builder.query<ProductBean[], {id: string}>({
        query: ({id}) => ({
          url: `${ApiConstants.GET_BUYER_REQUIREMENTS_BY_ID}?user_id=${id}`,
          method: 'GET',
        }),
        transformResponse: (res: ProductResponseBean): ProductBean[] => {
          if (res) {
            if (res.status) {
              return res.data ?? [];
            }
          }
          return [];
        },
      }),
      getSellerRequirementDetail: builder.query<
        ProductDetailBean,
        {id: string; categories_id: string; limit: number}
      >({
        queryFn: async (queryParams, _queryApi, _extraOptions, fetchWithBQ) => {
          try {
            const {id, categories_id, limit} = queryParams;

            // First call: get seller details (includes user_id)
            const details = await fetchWithBQ({
              url: `${ApiConstants.GET_SELLER_REQUIREMENTS_DETAIL}?id=${id}`,
              method: 'GET',
            });

            if (details.error) {
              return {error: details.error};
            }

            let detailInfo = null;

            const detailsData = details.data as ProductResponseDetailBean;
            detailInfo = detailsData.data;
            const user_id = detailInfo?.user_id;

            const [relatedPosts, sellerPosts] = await Promise.all([
              fetchWithBQ({
                url: `${ApiConstants.GET_SELLER_RELATED_POSTS}?id=${id}&categories_id=${categories_id}&limit=${limit}`,
                method: 'GET',
              }),
              fetchWithBQ({
                url: `${ApiConstants.GET_SELLER_POSTS_BY_ID}?user_id=${user_id}`,
                method: 'GET',
              }),
            ]);

            let relatedInfo: ProductBean[] = [];
            let sellerPostInfo: ProductBean[] = [];
            if (relatedPosts.error) {
              relatedInfo = [];
            } else {
              const relatedData = relatedPosts.data as ProductResponseBean;
              relatedInfo = relatedData.data ?? [];
            }

            if (sellerPosts.error) {
              sellerPostInfo = [];
            } else {
              const sellerData = sellerPosts.data as ProductResponseBean;
              sellerPostInfo = sellerData.data ?? [];
            }

            return {
              data: {
                detailInfo: detailInfo,
                relatedPosts: relatedInfo,
                sellerPosts: sellerPostInfo,
              },
            };
          } catch (error) {
            return {
              error: {status: 'CUSTOM_ERROR', error: (error as Error).message},
            };
          }
        },
        providesTags: ['SellerRequirements'],
      }),
      getRequirementPosts: builder.query<RequirementPostBean, void | undefined>(
        {
          queryFn: async (__, _queryApi, _extraOptions, fetchWithBQ) => {
            try {
              const rootState = _queryApi.getState() as RootState;
              const {authSlice} = rootState || {};
              const {authData} = authSlice || {};
              const {id} = authData || {};
              const [buyerPosts, sellerPosts] = await Promise.all([
                fetchWithBQ({
                  url: `${ApiConstants.GET_BUYER_REQUIREMENTS_BY_ID}?user_id=${id}`,
                  method: 'GET',
                }),
                fetchWithBQ({
                  url: `${ApiConstants.GET_SELLER_POSTS_BY_ID}?user_id=${id}`,
                  method: 'GET',
                }),
              ]);
              let buyerPostsData: ProductBean[] = [];
              let sellerPostsData: ProductBean[] = [];

              if (buyerPosts.error) {
                buyerPostsData = [];
              } else {
                const relatedData = buyerPosts.data as ProductResponseBean;
                buyerPostsData = relatedData.data ?? [];
              }

              if (sellerPosts.error) {
                sellerPostsData = [];
              } else {
                const relatedData = sellerPosts.data as ProductResponseBean;
                sellerPostsData = relatedData.data ?? [];
              }

              return {
                data: {
                  buyerPosts: buyerPostsData,
                  sellerPosts: sellerPostsData,
                },
              };
            } catch (error) {
              return {
                error: {
                  status: 'CUSTOM_ERROR',
                  error: (error as Error).message,
                },
              };
            }
          },
        },
      ),

      getCatalogue: builder.query<
        CataloguePaginationResponse,
        string | undefined
      >({
        query: data => ({
          url: `${ApiConstants.GET_CATALOGUES_BY_ID}?${data}`,
          method: 'GET',
        }),
        transformResponse: (
          response: CataloguePaginationResponse,
        ): CataloguePaginationResponse => {
          return response;
        },
      }),
      deletePost: builder.mutation<GeneralResponse, FormData>({
        query: data => ({
          url: ApiConstants.DELETE_REQUIREMENT,
          method: 'POST',
          body: data,
        }),
      }),
    }),
  });
export const {
  useAddBuyerRequirementMutation,
  useAddSellerRequirementMutation,
  useLazyGetBuyerRequirementsQuery,
  useLazyGetSellerRequirementsQuery,
  useLazyGetBuyerRequirementDetailQuery,
  useLazyGetBuyerRelatedPostQuery,
  useLazyGetSellerRequirementDetailQuery,
  useGetRequirementPostsQuery,
  useGetBuyerRequirementPostQuery,
  useLazyGetCatalogueQuery,
  useDeletePostMutation,
  useEditRequirementMutation,
  useDeleteRequirementImageMutation,
} = RequirementServices;
