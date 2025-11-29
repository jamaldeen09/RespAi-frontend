"use client"
import { store } from "@/redux/store";
import {Provider} from "react-redux"

// ** Provides app with redux js store so we can access actions, states etc ... ** \\
const ReduxProvider = ({ children }: {
    children: React.ReactNode
}): React.ReactElement => {
    return (
        <Provider
            store={store}
        >
            {children}
        </Provider>
    );
};

export default ReduxProvider;