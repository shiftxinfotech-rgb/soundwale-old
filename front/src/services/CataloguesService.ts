import {CataloguesResponse} from '@data';
import {baseService} from './BaseService';
import {ApiConstants} from './Constants';
export const CatalogueServices = baseService.injectEndpoints({
  overrideExisting: true,
  endpoints: builder => ({
    addCatalogues: builder.mutation<CataloguesResponse, FormData>({
      query: data => ({
        url: ApiConstants.ADD_CATALOGUES,
        method: 'POST',
        body: data,
      }),
    }),
  }),
});

export const {useAddCataloguesMutation} = CatalogueServices;
