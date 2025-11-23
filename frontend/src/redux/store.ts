import { configureStore } from "@reduxjs/toolkit";
import followersSlice from "./followers-slice";
import vacationSlice from "./vacationSlice";
import authSlice from "./auth-slice";

const store = configureStore({
    reducer: {
        auth: authSlice,
        followers: followersSlice,
        vacations: vacationSlice,
    }
});

export default store;

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch