import {useContext, useState} from "react";
import {Box, Button, Container, Paper, Stack, TextField, Typography} from "@mui/material";
import {login} from "../api/auth";
import {AuthContext} from "../hooks/AuthContext";
import {useNavigate} from "react-router-dom";
import {Store} from 'react-notifications-component';

const LoginPage = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const { state, dispatch: authDispatch } = useContext(AuthContext);
    const navigate = useNavigate();

    if(state) {
        navigate("/");
    }

    const processLogin = (event: any) => {
        event.preventDefault();
        setError("");
        setLoading(true);

        if (!username || !password) {
            return;
        }

        login(username, password).then(res => {
            const data = res.data;

            Store.addNotification({
                title: "Success!",
                message: "You have logged into the system",
                type: "success",
                insert: "top",
                container: "bottom-right",
                animationIn: ["animate__animated", "animate__fadeIn"],
                animationOut: ["animate__animated", "animate__fadeOut"],
                dismiss: {
                    duration: 5000,
                    onScreen: true
                }
            });

            authDispatch(data);
            localStorage.setItem("access_token", data.access_token);
            navigate("/");
        }).catch((err) => {
            if(err && err.response?.status === 401) {
                setError("Invalid username or password");
            }else{
                setError(err?.message || "Request Failed");
            }

        }).finally(() => {
            setLoading(false);
        })
    }

    const onUsernameChange = (event: any) => {
        setUsername(event.target.value);
    }

    const onPasswordChange = (event: any) => {
        setPassword(event.target.value);
    }

    return (
        <Container>
            <Box mt={5} display="flex" justifyContent="center">
                <Paper>
                    <Box p={2} width={500}>
                        <form onSubmit={processLogin}>
                            <Typography variant="h5" my={2}>Sign In</Typography>
                            <Stack spacing={2}>
                                <TextField id="username" label="Username" variant="standard" fullWidth
                                           onChange={onUsernameChange} required />
                                <TextField id="password" label="Password" type="password" variant="standard"
                                           onChange={onPasswordChange}
                                           fullWidth required />
                                <Typography textAlign="right" onClick={() => navigate("/register")}>Not having an account? <Button variant="text">register</Button></Typography>
                                <Typography color="red">{ error }</Typography>
                            </Stack>
                            <Box mt={4} display="flex" justifyContent="end">
                                <Button variant="contained" type="submit" disabled={loading}>
                                    Login
                                </Button>
                            </Box>
                        </form>
                    </Box>
                </Paper>
            </Box>
        </Container>
    )
}

export default LoginPage;