import {useContext, useState} from "react";
import {Box, Button, Container, Paper, Stack, TextField, Typography} from "@mui/material";
import {register} from "../api/auth";
import {AuthContext} from "../hooks/AuthContext";
import {useNavigate} from "react-router-dom";
import {Store} from "react-notifications-component";

const RegisterPage = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const { state, dispatch: authDispatch } = useContext(AuthContext);
    const navigate = useNavigate();

    if(state) {
        navigate("/");
    }

    const processRegister = (event: any) => {
        event.preventDefault();
        setError("");
        setLoading(true);

        if (!username || !password) {
            return;
        }

        register(username, password).then(res => {
            const data = res.data;

            if(data) {
                Store.addNotification({
                    title: "Success!",
                    message: `Now you can login to your account`,
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

                navigate("/login");
            }
        }).catch((err) => {
            switch(err.response?.status) {
                case 400:
                case 401:
                case 403:
                    setError(err.response?.data?.message || err.message);
                    break;
                default:
                    setError(err?.message || "Request Failed");
                    break;
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
                        <form onSubmit={processRegister}>
                            <Typography variant="h5" my={2}>Register</Typography>
                            <Stack spacing={2}>
                                <TextField id="username" label="Username" variant="standard" fullWidth
                                           onChange={onUsernameChange} required />
                                <TextField id="password" label="Password" type="password" variant="standard"
                                           onChange={onPasswordChange}
                                           fullWidth required />
                                <Typography textAlign="right" onClick={() => navigate("/login")}>Already have an account? <Button variant="text">login</Button></Typography>
                                <Typography color="red">{ error }</Typography>
                            </Stack>
                            <Box mt={4} display="flex" justifyContent="end">
                                <Button variant="contained" type="submit" disabled={loading}>
                                    Register
                                </Button>
                            </Box>
                        </form>
                    </Box>
                </Paper>
            </Box>
        </Container>
    )
}

export default RegisterPage;