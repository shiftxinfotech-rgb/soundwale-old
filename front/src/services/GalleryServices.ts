import {GalleryData, GalleryResponse, GeneralResponse} from '@data';
import {baseService} from './BaseService';
import {ApiConstants} from './Constants';
export const GalleryServices = baseService.injectEndpoints({
  overrideExisting: true,
  endpoints: builder => ({
    addGallery: builder.mutation<GeneralResponse, FormData>({
      query: data => ({
        url: ApiConstants.ADD_GALLERY,
        method: 'POST',
        body: data,
      }),
    }),
    deleteGalley: builder.mutation<GeneralResponse, FormData>({
      query: data => ({
        url: ApiConstants.DELETE_GALLERY,
        method: 'POST',
        body: data,
      }),
    }),

    getGallery: builder.query<GalleryData, undefined>({
      query: () => ({
        url: ApiConstants.GET_GALLERY,
        method: 'GET',
      }),
      transformResponse: (response: GalleryResponse): GalleryData => {
        if (response) {
          const {data, status} = response || {};
          if (status) {
            const {business_shop_images_data, business_shop_video_data} =
              data || {};
            const validPhotos =
              Array.isArray(business_shop_images_data) &&
              business_shop_images_data.length > 0;
            const validVideos =
              Array.isArray(business_shop_video_data) &&
              business_shop_video_data.length > 0;
            const obj: GalleryData = {
              business_shop_images_data: validPhotos
                ? business_shop_images_data
                : [],
              business_shop_video_data: validVideos
                ? business_shop_video_data
                : [],
            };
            return obj;
          }
        }
        return {
          business_shop_images_data: [],
          business_shop_video_data: [],
        };
      },
    }),
  }),
});

export const {
  useGetGalleryQuery,
  useAddGalleryMutation,
  useDeleteGalleyMutation,
} = GalleryServices;
