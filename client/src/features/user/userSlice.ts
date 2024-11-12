import { type IUserState } from '@/utils/type'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import {
  refreshThunk,
  signinThunk,
  signoutThunk,
  signupThunk,
} from './userThunk'
import {
  getLocalStorage,
  removeLocalStorage,
  setLocalStorage,
} from '@/utils/localStorage'

const initialState: IUserState = {
  id: '',
  username: '',
  email: '',
  role: '',
  accessToken: '',
  refreshToken: getLocalStorage('refreshToken'),
  message: {
    status: '',
    text: '',
  },

  isAuthenticated: false,
  isLoading: false,
}

// BASE FETCH
export const signup = createAsyncThunk('signupUser', signupThunk)
export const signin = createAsyncThunk('signinUser', signinThunk)
export const signout = createAsyncThunk('signoutUser', signoutThunk)
export const getRefreshToken = createAsyncThunk('refreshToken', refreshThunk)

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setMessage: function (state, { payload }) {
      state.message = payload.message
    },
  },
  extraReducers(builder) {
    builder
      //! 1. SignUp
      .addCase(signup.pending, function (state) {
        state.isLoading = true
      })
      .addCase(signup.fulfilled, function (state, { payload }) {
        state.isLoading = false

        state.message.status = 'Success'
        state.message.text = payload.message
      })
      .addCase(
        signup.rejected,
        function (state, { payload }: { payload: any }) {
          state.isLoading = false

          state.message.status = 'Error'
          state.message.text = payload
        }
      )

      //! 2. SignIn
      .addCase(signin.pending, function (state) {
        state.isLoading = true
      })
      .addCase(signin.fulfilled, function (state, { payload }) {
        state.accessToken = payload.data.accessToken
        state.refreshToken = payload.data.refreshToken
        setLocalStorage('refreshToken', payload.data.refreshToken)

        state.id = payload.data.id
        state.email = payload.data.email
        state.username = payload.data.username
        state.role = payload.data.role

        state.message.status = 'Success'
        state.message.text = payload.message

        state.isAuthenticated = true
        state.isLoading = false
      })
      .addCase(
        signin.rejected,
        function (state, { payload }: { payload: any }) {
          state.isLoading = false

          state.message.status = 'Error'
          state.message.text = payload.data.message
        }
      )

      //! 3. SignOut
      .addCase(signout.pending, function (state) {
        state.isLoading = true
      })
      .addCase(signout.fulfilled, function (state, { payload }) {
        state.accessToken = ''
        state.id = ''
        state.email = ''
        state.username = ''

        removeLocalStorage('refreshToken')

        state.message.status = 'Success'
        state.message.text = payload.message

        state.isAuthenticated = false
        state.isLoading = false
      })
      .addCase(
        signout.rejected,
        function (state, { payload }: { payload: any }) {
          state.message.status = 'Error'
          state.message.text = payload.data.message

          state.isLoading = false
        }
      )

      //! 4. Refresh Token
      .addCase(getRefreshToken.pending, function (state) {
        state.isLoading = true
      })
      .addCase(getRefreshToken.fulfilled, function (state, { payload }) {
        state.accessToken = payload.data.accessToken

        state.id = payload.data.id
        state.email = payload.data.email
        state.username = payload.data.username
        state.role = payload.data.role


        state.message.status = 'Success'
        state.message.text = 'Login success'

        state.isAuthenticated = true
        state.isLoading = false
      })
      .addCase(getRefreshToken.rejected, function (state) {
        // state.message.status = 'Error'
        // state.message.text = payload.data.message

        state.isLoading = false
      })
  },
})

export const { setMessage } = userSlice.actions

export default userSlice.reducer
