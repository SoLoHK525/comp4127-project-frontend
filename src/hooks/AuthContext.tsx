import {createContext, Dispatch, FC, useEffect, useReducer, useState} from "react";
import {Auth} from "../types/Auth";
import {auth} from "../api/auth";
import {ApiConfig} from "../api/base";

type NullableAuth = Auth | null;

export const AuthContext = createContext<{
    initialized: boolean,
    state: NullableAuth,
    dispatch: Dispatch<any>
}>({} as any);

export const AuthProvider: FC = ({children}) => {
    const initialState = null;

    const [initialized, setInitialized] = useState(false);
    const [loggedIn, setLoggedIn] = useState(false);

    const reducer = (state: any, action: any) => {
        if (action === null) {
            localStorage.removeItem("access_token");
        }else{
            ApiConfig.signingKey = action.user.signingKey;
        }

        setInitialized(true);
        return action;
    }

    const [state, dispatch] = useReducer(reducer, initialState);

    useEffect(() => {
        const access_token = localStorage.getItem("access_token");

        if (access_token) {
            auth().then(res => {
                const user = res.data;
                dispatch({
                    access_token,
                    user
                });

                ApiConfig.signingKey = user.signingKey;
            }).catch(() => {
                dispatch(null);
            })
        }else{
            dispatch(null);
        }
    }, [initialized, loggedIn]);

    return (
        <AuthContext.Provider value={{initialized, state, dispatch}}>
            {children}
        </AuthContext.Provider>
    )
}