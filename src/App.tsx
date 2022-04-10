import React from 'react';
import AppBar from "./components/AppBar";
import {AuthProvider} from './hooks/AuthContext';
import RouteContainer from "./RouteContainer";

function App() {

    return (
        <div className="App">
            <AuthProvider>
                <AppBar/>
                <RouteContainer />
            </AuthProvider>
        </div>
    );
}

export default App;
