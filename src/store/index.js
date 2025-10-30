import { configureStore } from "@reduxjs/toolkit";

/**
 * Redux Store Configuration
 * 
 * Central store for application state management using Redux Toolkit.
 * Currently initialized with empty reducers - add slices as needed.
 */
export const store = configureStore({
  reducer: {
    // Placeholder reducer to prevent empty reducer error
    // Replace with actual slices as they are created
    app: (state = { initialized: true }) => state,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types for serializability checks if needed
        ignoredActions: [],
        // Ignore these field paths in all actions
        ignoredActionPaths: [],
        // Ignore these paths in the state
        ignoredPaths: [],
      },
    }),
  devTools: import.meta.env.MODE !== 'production',
});

export default store;