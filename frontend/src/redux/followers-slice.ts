import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import User from "../models/User";

interface FollowersState {
    followers: User[],
    isActive: boolean
}

const initialState: FollowersState = {
    followers: [],
    isActive: true
};

export const followersSlice = createSlice({
    name: 'followers',
    initialState,
    reducers: {
        init: (state, action: PayloadAction<User[]>) => {
            state.followers = action.payload;
        },
        newFollower: (state, action: PayloadAction<User>) => {
            state.followers.push(action.payload);
        },
        removeFollower: (state, action: PayloadAction<string>) => {
            state.followers = state.followers.filter(follow => follow.id !== action.payload);
        }
    }
});

export const { init, newFollower, removeFollower } = followersSlice.actions;

export default followersSlice.reducer;