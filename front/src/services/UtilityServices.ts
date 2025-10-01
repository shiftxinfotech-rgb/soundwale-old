import {
  AddPostParams,
  CategoryBean,
  CategoryResponse,
  CityListResponse,
  CountryListResponse,
  DealerCompanyResponse,
  DropDownListParams,
  FilterData,
  FilterResponseBean,
  RequirementListResponse,
  RoleBean,
  RoleListResponse,
  StateListResponse,
} from '@data';
import _ from 'lodash';
import {baseService} from './BaseService';
import {ApiConstants} from './Constants';

export const UtilityServices = baseService.injectEndpoints({
  overrideExisting: true,
  endpoints: builder => ({
    getRoles: builder.query<RoleBean[], void | undefined>({
      query: () => ApiConstants.ROLES,
      transformResponse: (res: RoleListResponse, __, ___): RoleBean[] => {
        if (res) {
          const {data, status} = res || {};
          return status ? data! : [];
        }
        return [];
      },
    }),
    getCountries: builder.query<DropDownListParams[], void | undefined>({
      query: () => ApiConstants.COUNTRIES,
      transformResponse: (res: CountryListResponse): DropDownListParams[] => {
        if (res) {
          const {data, status} = res || {};
          if (status) {
            return _.map(data, item => {
              return {
                id: item.id,
                label: item.country_name ?? '',
                value: item.country_name ?? '',
              };
            });
          }
        }
        return [];
      },
    }),
    getStates: builder.query<DropDownListParams[], number | string>({
      query: (id: number) => ApiConstants.STATES + id,
      transformResponse: (res: StateListResponse): DropDownListParams[] => {
        if (res) {
          const {data, status} = res || {};
          if (status) {
            return _.map(data, item => {
              return {
                id: item.id,
                label: item.state_name ?? '',
                value: item.state_name ?? '',
              };
            });
          }
        }
        return [];
      },
    }),
    getCities: builder.query<DropDownListParams[], number>({
      query: (id: number) => ApiConstants.CITY + id,
      transformResponse: (res: CityListResponse): DropDownListParams[] => {
        if (res) {
          const {data, status} = res || {};
          if (status) {
            return _.map(data, item => {
              return {
                id: item.id,
                label: item.city_name ?? '',
                value: item.city_name ?? '',
              };
            });
          }
        }
        return [];
      },
    }),
    getDealerCompany: builder.query<DropDownListParams[], string>({
      query: (user_id?: string) =>
        `${ApiConstants.DEALER_COMPANY}?user_id=${user_id ?? ''}`,
      transformResponse: (res: DealerCompanyResponse): DropDownListParams[] => {
        if (res) {
          const {data, status} = res || {};
          if (status) {
            return _.map(data, item => {
              return {
                id: item.id,
                label: item.name ?? '',
                value: item.name ?? '',
              };
            });
          }
        }
        return [];
      },
    }),
    getSubCategoryList: builder.query<
      DropDownListParams[],
      {user_id: string; category_id: string}
    >({
      query: ({user_id, category_id}) =>
        `${ApiConstants.SUB_CATEGORY}?user_id=${user_id}&category_id=${category_id}`,
      transformResponse: (res: CategoryResponse): DropDownListParams[] => {
        if (res) {
          const {data, status} = res || {};
          if (status) {
            return _.map(data, item => {
              return {
                id: item.id,
                label: item.name ?? '',
                value: item.name ?? '',
              };
            });
          }
        }
        return [];
      },
      keepUnusedDataFor: 0,
    }),

    getModelList: builder.query<DropDownListParams[], string>({
      query: (user_id: string) =>
        `${ApiConstants.GET_MODEL}?user_id=${user_id}`,
      transformResponse: (res: CategoryResponse): DropDownListParams[] => {
        if (res) {
          const {data, status} = res || {};
          if (status) {
            return _.map(data, item => {
              return {
                id: item.id,
                label: item.name ?? '',
                value: item.name ?? '',
              };
            });
          }
        }
        return [];
      },
    }),
    getTypeOfManufacturer: builder.query<DropDownListParams[], string>({
      query: (user_id: string) =>
        `${ApiConstants.GET_TYPE_OF_MANUFACTURER}?user_id=${user_id}`,
      transformResponse: (res: CategoryResponse): DropDownListParams[] => {
        if (res) {
          const {data, status} = res || {};
          if (status) {
            return _.map(data, item => {
              return {
                id: item.id,
                label: item.name ?? '',
                value: item.name ?? '',
              };
            });
          }
        }
        return [];
      },
    }),
    getPartsList: builder.query<DropDownListParams[], string>({
      query: (user_id: string) =>
        `${ApiConstants.GET_PARTS}?user_id=${user_id}`,
      transformResponse: (res: CategoryResponse): DropDownListParams[] => {
        if (res) {
          const {data, status} = res || {};
          if (status) {
            return _.map(data, item => {
              return {
                id: item.id,
                label: item.name ?? '',
                value: item.name ?? '',
              };
            });
          }
        }
        return [];
      },
    }),
    getAddPostData: builder.query<AddPostParams, string | undefined>({
      queryFn: async (userId, _queryApi, _extraOptions, fetchWithBQ) => {
        try {
          const [category, requirement, dealer] = await Promise.all([
            fetchWithBQ(`${ApiConstants.CATEGORY}?user_id=${userId ?? ''}`),
            fetchWithBQ(ApiConstants.REQUIREMENT_LIST),
            fetchWithBQ(
              `${ApiConstants.DEALER_COMPANY}?user_id=${userId ?? ''}`,
            ),
          ]);
          if (category.error) {
            return {error: category.error};
          }
          if (requirement.error) {
            return {error: requirement.error};
          }
          if (dealer.error) {
            return {error: dealer.error};
          }

          const {data: categoryData} = category.data as CategoryResponse;
          const {data: requirementData} =
            requirement.data as RequirementListResponse;
          const {data: dealerData} = dealer.data as DealerCompanyResponse;

          let categoryArr: DropDownListParams[] = _.map(
            categoryData ?? [],
            item => {
              return {
                id: item.id,
                label: item.name ?? '',
                value: item.name ?? '',
              };
            },
          );
          let dealerArr: DropDownListParams[] = _.map(
            dealerData ?? [],
            item => {
              return {
                id: item.id,
                label: item.name ?? '',
                value: item.name ?? '',
              };
            },
          );
          let requirementArr: DropDownListParams[] = _.map(
            requirementData ?? [],
            item => {
              return {
                id: item.id,
                label: item.name ?? '',
                value: item.name ?? '',
              };
            },
          );

          return {
            data: {
              categories: categoryArr ?? [],
              requirementList: requirementArr ?? [],
              mainCategory: dealerArr ?? [],
            },
          };
        } catch (error) {
          return {
            error: {status: 'CUSTOM_ERROR', error: (error as Error).message},
          };
        }
      },
    }),
    getFilterData: builder.query<FilterData | undefined, string>({
      query: params => ({
        url: `${ApiConstants.GET_FILTER}?${params}`,
        method: 'GET',
      }),
      transformResponse: (
        response: FilterResponseBean,
      ): FilterData | undefined => {
        if (response) {
          const {status, data} = response || {};
          if (status && data) {
            const category = data.category ?? [];
            const sub_category = data.sub_category ?? [];
            const mergedCategories: CategoryBean[] = category.map(item => {
              const sub_categories = sub_category.filter(
                sub => sub.category_id === item.id,
              );
              return {...item, sub_category: sub_categories};
            });

            const cityWithAll =
              data.city && data.city.length > 0
                ? [{id: 'all', city_name: 'All'}, ...data.city]
                : [];

            let req: FilterData = {
              ...data,
              category: mergedCategories,
              city: cityWithAll,
            };
            return req;
          }
        }
        return undefined;
      },
    }),
  }),
});
export const {
  useGetRolesQuery,
  useLazyGetCitiesQuery,
  useLazyGetCountriesQuery,
  useLazyGetStatesQuery,
  useLazyGetModelListQuery,
  useLazyGetDealerCompanyQuery,
  useGetAddPostDataQuery,
  useLazyGetSubCategoryListQuery,
  useLazyGetFilterDataQuery,
  useGetFilterDataQuery,
  useGetPartsListQuery,
  useGetTypeOfManufacturerQuery,
} = UtilityServices;
