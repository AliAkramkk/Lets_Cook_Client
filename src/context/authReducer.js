import { createSlice } from '@reduxjs/toolkit'

const authSlice = createSlice({
  name: 'auth',
  initialState: { user: null, token: null, id: null, role: [] },
  reducers: {
    setCredentials: (state, action) => {
      const { user, token, role, id } = action.payload
      state.user = user !== undefined ? user : state.user;
      state.token = token !== undefined ? token : state.token;
      state.id = id !== undefined ? id : state.id;
      state.role = role !== undefined ? [role] : state.role;
      console.log("state", state.token);
      console.log('Action Payload:', action.payload);
      console.log('Current State:', state);
    },

    logOut: (state, action) => {
      state.token = null
      state.user = null
      state.id = null
      state.role = []
    }
  }
})
export const { setCredentials, logOut } = authSlice.actions
export default authSlice.reducer

export const selectCurrentUser = (state) => state.auth.user
export const selectCurrentToken = (state) => state.auth.token
export const selectCurrentId = (state) => state.auth.id
export const auth = (state) => state.auth
