import {
  AuthData,
  BusinessEditProfileResponse,
  EditProfileResponse,
  GetProfileResponse,
  VerifyAuthCodeResponse,
} from '@data';
import {createSelector, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {AuthServices} from '@services';
import {RootState} from './AppStore';

type authStateParams = {
  isLoggedIn: boolean;
  token: string;
  authData: AuthData;
};

const authState: authStateParams = {
  isLoggedIn: false,
  token: '',
  authData: {},
};

const authSlice = createSlice({
  name: 'authSlice',
  initialState: authState,
  reducers: {
    logoutCurrentUser: () => {
      return authState;
    },
    updateUserInfoKey: (
      state,
      action: PayloadAction<{key: string; value: any}>,
    ) => {
      if (state.authData && typeof state.authData === 'object') {
        (state.authData as any)[action.payload.key] = action.payload.value;
      }
    },
  },
  extraReducers(builder) {
    builder.addMatcher(
      AuthServices.endpoints.verifyAuthOtp.matchFulfilled,
      (state, {payload}: PayloadAction<VerifyAuthCodeResponse>) => {
        if (payload.status) {
          const {token, user} = payload || {};
          state.token = token ?? '';
          state.authData = user ?? {};
          if (user !== null && user !== undefined) {
            state.isLoggedIn = true;
          }
        }
      },
    );
    builder.addMatcher(
      AuthServices.endpoints.registerUser.matchFulfilled,
      (state, {payload}: PayloadAction<VerifyAuthCodeResponse>) => {
        if (payload.status) {
          const {token, user} = payload || {};
          state.token = token ?? '';
          state.authData = user ?? {};
          state.isLoggedIn = true;
        }
      },
    );
    builder.addMatcher(
      AuthServices.endpoints.editPersonalProfile.matchFulfilled,
      (state, {payload}: PayloadAction<EditProfileResponse>) => {
        if (payload.status) {
          const {user} = payload || {};
          state.authData = user ?? {};
        }
      },
    );
    // builder.addMatcher(
    //   AuthServices.endpoints.editBusinessProfile.matchFulfilled,
    //   (state, {payload}: PayloadAction<EditProfileResponse>) => {
    //     if (payload.status) {
    //       const {user} = payload || {};
    //       state.authData = user ?? {};
    //     }
    //   },
    // );
    builder.addMatcher(
      AuthServices.endpoints.editBusinessProfile.matchFulfilled,
      (state, {payload}: PayloadAction<BusinessEditProfileResponse>) => {
        if (payload.status) {
          const {user} = payload || {};
          if (user) {
            state.authData = {...state.authData, ...user};
          }
        }
      },
    );
    builder.addMatcher(
      AuthServices.endpoints.updateBusinessSpecificFields.matchFulfilled,
      (state, {payload}: PayloadAction<BusinessEditProfileResponse>) => {
        if (payload.status) {
          const {user} = payload || {};
          state.authData = user ?? {};
        }
      },
    );
    builder.addMatcher(
      AuthServices.endpoints.updateSpecificFields.matchFulfilled,
      (state, {payload}: PayloadAction<BusinessEditProfileResponse>) => {
        if (payload.status) {
          const {user} = payload || {};
          state.authData = user ?? {};
        }
      },
    );

    builder.addMatcher(
      AuthServices.endpoints.getProfile.matchFulfilled,
      (state, {payload}: PayloadAction<GetProfileResponse>) => {
        if (payload.status) {
          const {user} = payload || {};
          state.authData = user ?? {};
        }
      },
    );
  },
});

const selectSelf = (state: RootState) => state.authSlice;

export const getIsLogin = createSelector(
  selectSelf,
  entity => entity.isLoggedIn,
);

export const getUserInfo = createSelector(selectSelf, entity =>
  entity.isLoggedIn ? (entity.authData as AuthData) : undefined,
);
export const {logoutCurrentUser, updateUserInfoKey} = authSlice.actions;
export default authSlice.reducer;
