import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { FirebaseApp } from "firebase/app";
import type { Option } from "client/lib/option";
import { None, Some } from "client/lib/option";

// Define a type for the slice state
interface FirebaseStore {
  app: Option<FirebaseApp>;
}

// Define the initial state using that type
const initialState: FirebaseStore = {
  app: None
};

export const firebaseSlice = createSlice({
  name: "firebase",
  initialState,
  reducers: {
    replaceApp: (state, action: PayloadAction<FirebaseApp>) => {
      state.app = Some(action.payload);
    }
  }
});

export const { replaceApp } = firebaseSlice.actions;

export default firebaseSlice.reducer;
