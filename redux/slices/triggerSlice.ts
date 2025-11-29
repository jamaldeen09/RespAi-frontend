import {createSlice, PayloadAction} from "@reduxjs/toolkit"

// ** Interface to define the structure of the slice's initial state ** \\
export interface Triggers {
    navigation: boolean;
    auth: boolean;
    sidebarNavigation: boolean;
    savedAnalysis: boolean;
    requestDeletionConfirmation: boolean;
    editProfile: boolean;
    logoutConfirmation: boolean;
}


// ** Slice's initial state ** \\
const initialState: Triggers = {
    navigation: false,
    auth: false,
    sidebarNavigation: false,
    savedAnalysis: false,
    requestDeletionConfirmation: false,
    editProfile: false,
    logoutConfirmation: false,
};

// ** Actual slice ** \\
export const triggersSlice = createSlice({
    name: "triggers",
    initialState,
    reducers: {
        // ** Custom reducer to mutate a specific trigger ** \\
        setTrigger: (state, action: PayloadAction<{ trigger: keyof Triggers; value: boolean }>) => {
            state[action.payload.trigger] = action.payload.value
        },
    }
});

export const { setTrigger } = triggersSlice.actions