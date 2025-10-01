import {CommentResponse, GeneralResponse, ShortsResponse} from '@data';
import {baseService} from './BaseService';
import {ApiConstants} from './Constants';
export const ShortsServices = baseService.injectEndpoints({
  overrideExisting: true,
  endpoints: builder => ({
    addShorts: builder.mutation<GeneralResponse, FormData>({
      query: data => ({
        url: ApiConstants.ADD_SHORTS,
        method: 'POST',
        body: data,
      }),
    }),
    likeUnlikeShorts: builder.mutation<GeneralResponse, FormData>({
      query: data => ({
        url: ApiConstants.LIKE_UNLIKE_SHORTS,
        method: 'POST',
        body: data,
      }),
    }),
    deleteShort: builder.mutation<GeneralResponse, FormData>({
      query: data => ({
        url: ApiConstants.DELETE_SHORT,
        method: 'POST',
        body: data,
      }),
    }),
    addReplyComment: builder.mutation<GeneralResponse, FormData>({
      query: data => ({
        url: ApiConstants.ADD_REPLY_COMMENT,
        method: 'POST',
        body: data,
      }),
    }),
    getCommentsReply: builder.query<CommentResponse, string | undefined>({
      query: (id: string | undefined) => ({
        url: `${ApiConstants.GET_REPLY_COMMENT}?id=${id}`,
        method: 'GET',
      }),
    }),
    getShorts: builder.query<ShortsResponse, undefined>({
      query: () => ({
        url: ApiConstants.GET_SHORTS,
        method: 'GET',
      }),
    }),
  }),
});

export const {
  useAddShortsMutation,
  useGetShortsQuery,
  useLikeUnlikeShortsMutation,
  useDeleteShortMutation,
  useAddReplyCommentMutation,
  useLazyGetCommentsReplyQuery,
} = ShortsServices;
