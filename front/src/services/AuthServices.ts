import {
  AuthData,
  BusinessEditProfileResponse,
  ContactUsResponse,
  DeleteAccountResponse,
  EditProfileResponse,
  GeneralResponse,
  GenericResponse,
  GetProfileResponse,
  SendAuthCodeResponse,
  VerifyAuthCodeResponse,
} from '@data';
import {baseService} from './BaseService';
import {ApiConstants} from './Constants';
export const AuthServices = baseService
  .enhanceEndpoints({
    addTagTypes: ['Profile'],
  })
  .injectEndpoints({
    overrideExisting: true,
    endpoints: builder => ({
      sendAuthOtp: builder.mutation<SendAuthCodeResponse, FormData>({
        query: data => ({
          url: ApiConstants.SEND_AUTH_OTP,
          method: 'POST',
          body: data,
        }),
      }),
      verifyAuthOtp: builder.mutation<VerifyAuthCodeResponse, FormData>({
        query: data => ({
          url: ApiConstants.VERIFY_AUTH_OTP,
          method: 'POST',
          body: data,
        }),
      }),
      logout: builder.mutation<GenericResponse, undefined | void>({
        query: () => ({
          url: ApiConstants.LOGOUT,
          method: 'POST',
        }),
      }),
      registerUser: builder.mutation<VerifyAuthCodeResponse, FormData>({
        query: data => ({
          url: ApiConstants.REGISTER,
          method: 'POST',
          body: data,
        }),
      }),
      getProfile: builder.query<GetProfileResponse, string | undefined>({
        query: uId => ({
          url: `${ApiConstants.GET_PROFILE}?user_id=${uId}`,
          method: 'GET',
          providesTags: ['Profile'],
        }),
      }),
      editPersonalProfile: builder.mutation<EditProfileResponse, FormData>({
        query: data => ({
          url: ApiConstants.EDIT_PERSONAL_PROFILE,
          method: 'POST',
          body: data,
        }),
        invalidatesTags: ['Profile'],
      }),
      editBusinessProfile: builder.mutation<
        BusinessEditProfileResponse,
        FormData
      >({
        query: data => ({
          url: ApiConstants.UPDATE_BUSINESS_PROFILE,
          method: 'POST',
          body: data,
        }),
        invalidatesTags: ['Profile'],
      }),
      updateBusinessSpecificFields: builder.mutation<
        BusinessEditProfileResponse,
        FormData
      >({
        query: data => ({
          url: ApiConstants.UPDATE_BUSINESS_SPECIFIC_FIELDS,
          method: 'POST',
          body: data,
        }),
        invalidatesTags: ['Profile'],
      }),
      updateSpecificFields: builder.mutation<
        BusinessEditProfileResponse,
        FormData
      >({
        query: data => ({
          url: ApiConstants.UPDATE_SPECIFIC_FIELDS,
          method: 'POST',
          body: data,
        }),
        invalidatesTags: ['Profile'],
      }),
      businessShopRemove: builder.mutation<GeneralResponse, FormData>({
        query: data => ({
          url: ApiConstants.BUSINESS_SHOP_REMOVE,
          method: 'POST',
          body: data,
        }),
      }),
      companyPdfRemove: builder.mutation<GeneralResponse, FormData>({
        query: data => ({
          url: ApiConstants.COMPANY_PDF_REMOVE,
          method: 'POST',
          body: data,
        }),
      }),
      companyPdfUpdate: builder.mutation<GeneralResponse, FormData>({
        query: data => ({
          url: ApiConstants.COMPANY_PDF_UPDATE,
          method: 'POST',
          body: data,
        }),
      }),

      contactUs: builder.mutation<ContactUsResponse, FormData>({
        query: formData => ({
          url: ApiConstants.CONTACT_US,
          method: 'POST',
          body: formData,
        }),
      }),
      deleteAccount: builder.mutation<DeleteAccountResponse, FormData>({
        query: (formData: FormData) => ({
          url: ApiConstants.DELETE_ACCOUNT,
          method: 'POST',
          body: formData,
        }),
      }),
      getSellerProfile: builder.query<
        AuthData | undefined,
        {userId: string; id: string; relevantType: string} | undefined
      >({
        query: data => ({
          url: `${ApiConstants.GET_SELLER_PROFILE}?user_id=${data?.userId}&relevant_id=${data?.id}&type=${data?.relevantType}`,
          method: 'GET',
        }),
        transformResponse(res: VerifyAuthCodeResponse): AuthData | undefined {
          if (res.status && res.user) {
            return res.user;
          }
          return undefined;
        },
      }),
    }),
  });

export const {
  useRegisterUserMutation,
  useVerifyAuthOtpMutation,
  useLogoutMutation,
  useSendAuthOtpMutation,
  useLazyGetProfileQuery,
  useEditPersonalProfileMutation,
  useEditBusinessProfileMutation,
  useBusinessShopRemoveMutation,
  useContactUsMutation,
  useDeleteAccountMutation,
  useGetSellerProfileQuery,
  useCompanyPdfRemoveMutation,
  useCompanyPdfUpdateMutation,
  useUpdateBusinessSpecificFieldsMutation,
  useUpdateSpecificFieldsMutation,
} = AuthServices;
