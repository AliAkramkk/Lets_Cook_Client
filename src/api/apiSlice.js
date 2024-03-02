import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setCredentials, logOut } from "../context/authReducer";

const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:3000",
  credentials: "include",
  prepareHeaders: (Headers, { getState }) => {
    const token = getState().auth.token;
    if (token) {
      Headers.set("authorization", `${token}`);
    }
    return Headers;
  },
});

const baseQueryWithReath = async (args, api, extraOption) => {
  let result = await baseQuery(args, api, extraOption);

  if (result?.error?.originalStatus === 403) {
    const refreshResult = await baseQuery("/refresh", api, extraOption);
    if (refreshResult?.data) {
      const user = api.getState().auth.user;
      api.dispatch(
        setCredentials({
          user: refreshResult.data.user,
          role: refreshResult.data.role,
          token: refreshResult.data.accessToken,
        })
      );
      result = await baseQuery(args, api, extraOption);
    } else {
      api.dispatch(logOut());
    }
  } else if (result?.error?.originalStatus === 400) {
    api.dispatch(logOut());
  }
  return result;
};


export const apiSlice = createApi({
  baseQuery: baseQueryWithReath,
  endpoints: (buider) => ({}),
});
