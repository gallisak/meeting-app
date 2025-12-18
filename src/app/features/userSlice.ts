import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  email: string | null;
  uid: string | null;
  role: string | null;
  isAuthenticated: boolean;
}

const initialState: UserState = {
  email: null,
  uid: null,
  role: null,
  isAuthenticated: false,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (
      state,
      action: PayloadAction<{ email: string; uid: string; role: string }>
    ) => {
      state.email = action.payload.email;
      state.uid = action.payload.uid;
      state.role = action.payload.role;
      state.isAuthenticated = true;
    },

    logout: (state) => {
      state.email = null;
      state.uid = null;
      state.role = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setUser, logout } = userSlice.actions;
export default userSlice.reducer;
