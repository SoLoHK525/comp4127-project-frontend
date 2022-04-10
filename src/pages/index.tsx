import {useContext, useEffect} from "react";
import {Box, Container, Typography} from "@mui/material";
import {AuthContext} from "../hooks/AuthContext";

import {Link} from "react-router-dom";

const IndexPage = () => {
    const {state: AuthState} = useContext(AuthContext);

    const loggedIn = AuthState != null;

    useEffect(() => {
    }, []);

    return (
        <Box mt={4}>
            <Container>
                <Typography variant="h5">E-Wallet System</Typography>
                <Box mt={2}>
                    <Typography variant="body1">
                        E-Wallet is a system that allows you to transfer your bank balance to your friends' account in a
                        snap!
                    </Typography>
                    {
                        loggedIn ? (
                            <Box>
                                <Typography mt={5} variant="h5">Welcome! {AuthState?.user.username}</Typography>
                                <Typography>
                                    Head over to <Link to="/accounts">Accounts</Link> to start your transactions
                                </Typography>
                            </Box>
                        ) : (
                            <Typography><Link to="/login">Login</Link> or <Link to="/register">Register</Link> to
                                proceed</Typography>
                        )
                    }
                </Box>
            </Container>
        </Box>
    )
}

export default IndexPage;