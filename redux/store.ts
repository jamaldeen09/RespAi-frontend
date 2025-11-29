import { TypedUseSelectorHook } from 'react-redux';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { configureStore } from "@reduxjs/toolkit";
import { triggersSlice } from './slices/triggerSlice';
import { userSlice } from './slices/userSlice';
import { authApi } from './apis/authApi';
import { analysisApi } from './apis/analysisApi';
import { analysisSlice } from './slices/analysisSlice';
import { profileApi } from './apis/profileApi';

// ** Store to provide the app with the states globally ** \\
export const store = configureStore({
    reducer: {
        triggers: triggersSlice.reducer,
        user: userSlice.reducer,
        analysis: analysisSlice.reducer,
        [authApi.reducerPath]: authApi.reducer,
        [analysisApi.reducerPath]: analysisApi.reducer,
        [profileApi.reducerPath]: profileApi.reducer,
    },

    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware()
            .concat(authApi.middleware)
            .concat(analysisApi.middleware)
            .concat(profileApi.middleware)
});


// ** Types to handle ts dispatch and selector to prevent issues when dispatching reducers or selecting states ** \\
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// ** UseAppDispatch() (typed version of useDispatch()) & UseAppSelector() (typed version of UseSelector) ** \\
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
