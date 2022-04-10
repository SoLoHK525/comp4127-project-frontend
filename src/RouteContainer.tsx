import {Route, Routes} from "react-router-dom";
import IndexPage from "./pages";
import LoginPage from "./pages/login";
import RegisterPage from "./pages/register";
import React, {useContext} from "react";
import {AuthContext} from "./hooks/AuthContext";
import AccountsPage from "./pages/accounts";

const RouteContainer = () => {
    const {initialized} = useContext(AuthContext);

    return (
        <div id="route-container">
            { initialized &&
                <Routes>
                    <Route path="/" element={<IndexPage/>}/>
                    <Route path="/login" element={<LoginPage/>}/>
                    <Route path="/register" element={<RegisterPage/>}/>
                    <Route path="/accounts" element={<AccountsPage />}/>
                </Routes>
            }
        </div>
    )
}

export default RouteContainer;