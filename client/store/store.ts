import { configureStore } from "@reduxjs/toolkit";
import firebaseReducers from "./firebase/firebase_reducer";
// ...

export const store = configureStore({
  reducer: {
    firebase: firebaseReducers
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ["firebase/replaceApp"],
        // Ignore these paths in the state
        ignoredPaths: ["firebase.app"]
      }
    })
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export default store;
