import { configureStore } from "@reduxjs/toolkit";
import searchReducer from "./searchSlice";
import newsReducer from "./newsSlice"

export const store = configureStore({
    reducer: {
        search: searchReducer,
        news: newsReducer,
    }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;