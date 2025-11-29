import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { authApi } from "../apis/authApi";

// ** Interfaces to define the structure of the slice's initial state ** \\
export interface Profile {
    _id: string;
    fullname: string;
    email: string;
    avatar: string;
    credits: number;
    plan: "starter" | "pro" | "enterprise" | "";
    role: "admin" | "user" | "creator" | "";
    enableAiAnalysis: boolean;
    createdAt: string;
    updatedAt: string;
    creditRefillDate: string;
};

export interface AuthState {
    isAuthenticated: boolean;
    userId: string;
    fullname: string;
};

export interface User {
    profile: Profile;
    authState: AuthState;
};

// ** Slice's initial state ** \\
const initialState: User = {
    profile: {
        _id: "",
        fullname: "",
        email: "",
        credits: 0,
        plan: "",
        role: "",
        createdAt: "",
        updatedAt: "",
        avatar: "",
        enableAiAnalysis: false,
        creditRefillDate: "",
    },
    authState: {
        isAuthenticated: false,
        userId: "",
        fullname: "",
    },
};

// ** Actual slice ** \\
export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        initAuthState: (state, action: PayloadAction<{
            authState: Omit<AuthState, "isAuthenticated">,
            tokens: { accessToken: string; refreshToken: string; },
        }>) => {
            if (typeof window !== "undefined") {
                localStorage.setItem("accessToken", action.payload.tokens.accessToken);
                localStorage.setItem("refreshToken", action.payload.tokens.refreshToken);
            }

            state.authState = {
                ...action.payload.authState,
                isAuthenticated: true
            };
        },

        initProfile: (state, action: PayloadAction<Profile>) => {
            state.profile = action.payload;
        },

        setCredits: (state, action: PayloadAction<number>) => {
            state.profile.credits = action.payload
        },

        logout: (state) => {
            state.authState = {
                isAuthenticated: false,
                userId: "",
                fullname: "",
            };

            state.profile = {
                _id: "",
                fullname: "",
                email: "",
                credits: 0,
                plan: "",
                role: "",
                createdAt: "",
                updatedAt: "",
                avatar: "",
                enableAiAnalysis: false,
                creditRefillDate: "",
            };

            if (typeof window !== "undefined") {
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
            }
        },

        editUsersProfile: (state, action: PayloadAction<{
            firstname?: string;
            lastname?: string;
            avatar?: string;
        }>) => {
            const user = state.profile;
            const {
                firstname,
                lastname,
                avatar
            } = action.payload;

            // ** Extract necessary name parts ** \\
            const nameParts = user.fullname.split(' ');
            const currentFirstname = nameParts[0] || '';
            const currentLastname = nameParts.slice(1).join(' ') || '';

            // ** New first and last names ** \\
            const newFirstname = (`${(firstname || currentFirstname).charAt(0).toUpperCase() + (firstname || currentFirstname).slice(1)}`).trim();
            const newLastname = (`${(lastname || currentLastname).charAt(0).toUpperCase() + (lastname || currentLastname).slice(1)}`).trim();
            const newAvatar = avatar || user.avatar;

            state.profile = {
                ...state.profile,
                fullname: (`${newFirstname} ${newLastname}`).trim(),
                avatar: newAvatar,
            };
        },

        disableOrEnableAiAnalysisReducer: (state) => {
            state.profile.enableAiAnalysis = !state.profile.enableAiAnalysis
        }
    },
    extraReducers: (builder) => {
        builder.addMatcher(
            authApi.endpoints.getAuthState.matchFulfilled,
            (state, action) => {
                const expectedDataFormat = (action.payload.data as {
                    authState: Omit<AuthState, "isAuthenticated">
                }).authState;

                state.authState = {
                    ...expectedDataFormat,
                    isAuthenticated: true,
                }
            }
        );

        builder.addMatcher(
            authApi.endpoints.getAuthState.matchRejected,
            (state) => {
                state.authState = {
                    isAuthenticated: false,
                    userId: "",
                    fullname: "",
                };

                state.profile = {
                    _id: "",
                    fullname: "",
                    email: "",
                    credits: 0,
                    plan: "",
                    role: "",
                    createdAt: "",
                    updatedAt: "",
                    avatar: "",
                    enableAiAnalysis: false,
                    creditRefillDate: "",
                };
            }
        );
    },
});

export const {
    initAuthState,
    initProfile,
    logout,
    setCredits,
    editUsersProfile,
    disableOrEnableAiAnalysisReducer
} = userSlice.actions
