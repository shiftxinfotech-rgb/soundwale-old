import {DashboardData, DashboardResponse, GeneralResponse} from '@data';
import {baseService} from './BaseService';
import {ApiConstants} from './Constants';

export const DashboardServices = baseService.injectEndpoints({
  overrideExisting: true,
  endpoints: builder => ({
    getDashboard: builder.query<DashboardData, string | undefined>({
      query: data => ({
        url: `${ApiConstants.DASHBOARD_GET}?name=${data}`,
        method: 'GET',
      }),
      transformResponse: (response: DashboardResponse): DashboardData => {
        const data = response.data;
        return data!;
      },
    }),
    addAdvertisement: builder.mutation<GeneralResponse, FormData | undefined>({
      query: data => ({
        url: ApiConstants.ADD_ADVERTISEMENT,
        method: 'POST',
        body: data,
      }),
    }),
  }),
});
export const {useLazyGetDashboardQuery, useAddAdvertisementMutation} =
  DashboardServices;
