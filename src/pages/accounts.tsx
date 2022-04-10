import {FC, useEffect, useState} from "react";
import {createAccount, listAccounts, transfer} from "../api/accounts";
import {Account} from "../types/Account";
import {
    Box,
    Button,
    Card,
    CardContent,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Divider,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
    Stack,
    TextField,
    Typography
} from "@mui/material";
import {Store} from "react-notifications-component";

const CreateAccountDialog: FC<{
    onClose: (account?: Account) => void;
    open: boolean;
}> = ({onClose, open}) => {
    const [accountName, setAccountName] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const submitCreateAccount = () => {
        if (!accountName.trim()) {
            setErrorMessage("Account name cannot be empty");
            return;
        }
        setErrorMessage("");

        createAccount(accountName).then(res => {
            Store.addNotification({
                title: "Account Created!",
                message: `We have added 1000 credits to your account for you to test!`,
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

            onClose(res.data);
        }).catch(err => {
            setErrorMessage(err?.response?.data.message || err.message);
        })
    }

    const onLocalClose = () => {
        setAccountName("");
        onClose();
    }

    return (
        <Dialog open={open} onClose={onLocalClose}>
            <DialogTitle>Create Account</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Demo Mode: Every new account will receive 1000 HKD credits for transfer.
                </DialogContentText>
                <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    label="Account Name"
                    type="text"
                    fullWidth
                    variant="standard"
                    onChange={(e) => {
                        console.log(e.target.value);
                        setAccountName(e.target.value)
                    }}
                />
                <Typography variant="caption">Note: account name cannot be changed once created</Typography>
                <br/>
                <Typography variant="caption" color="red">{errorMessage}</Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={onLocalClose} color="error">Cancel</Button>
                <Button onClick={submitCreateAccount} variant="contained">Create</Button>
            </DialogActions>
        </Dialog>
    );
}

const TransferDialog: FC<{
    onClose: (transferred: boolean) => void;
    transferAccount: string;
}> = ({onClose, transferAccount}) => {
    const [accountAddress, setAccountAddress] = useState("");
    const [accountType, setAccountType] = useState("self");
    const [amount, setAmount] = useState(0.0);
    const [errorMessage, setErrorMessage] = useState("");

    const [accounts, setAccounts] = useState<Account[]>([]);

    const onAccountTypeChange = (e: SelectChangeEvent<string>) => {
        setAccountType(e.target.value);
    }

    const submitTransferRequest = () => {
        if (!accountAddress.trim()) {
            setErrorMessage("Account address cannot be empty");
            return;
        }
        setErrorMessage("");

        transfer(transferAccount, accountAddress, amount).then(res => {
            const response = res.data;

            if (response) {
                console.log("Transaction Success!");

                Store.addNotification({
                    title: "Transaction Success!",
                    message: `You have transferred ${amount} from ${transferAccount} to ${accountAddress}`,
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
                onLocalCloseWithTransferred(true);
            }
        }).catch(err => {
            if (err.response.status === 400 || err.response.status === 403) {
                setErrorMessage(err?.response?.data.message || err.message);
            } else {
                setErrorMessage(err.message);
            }
        })
    }

    const onLocalCloseWithTransferred = (transffered: boolean) => {
        setAccountAddress("");
        setAccountType("self");
        setAmount(0.0);
        onClose(transffered);
    }

    const onLocalClose = () => {
        onLocalCloseWithTransferred(false);
    }

    useEffect(() => {
        if (transferAccount && accountType === "self") {
            listAccounts().then(res => {
                const accounts = res.data.filter(ac => ac.identifier !== transferAccount);
                setAccounts(accounts);
                if (accounts.length > 0) {
                    setAccountAddress(accounts[0].identifier);
                }
            });
        } else {
            setAccountAddress("");
        }
    }, [accountType, transferAccount]);

    return (
        <Dialog open={!!transferAccount} onClose={onLocalClose}>
            <DialogTitle>Transfer To</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    From Account: {transferAccount}
                </DialogContentText>
                <Stack spacing={2} mt={2} minWidth={300}>
                    <FormControl fullWidth>
                        <InputLabel id="account-type-select-label">Account Type</InputLabel>
                        <Select
                            labelId="account-type-select-label"
                            id="account-type-select"
                            value={accountType}
                            label="Account Type"
                            onChange={onAccountTypeChange}
                        >
                            <MenuItem value="self">Your Own Accounts</MenuItem>
                            <MenuItem value="external">External Accounts</MenuItem>
                        </Select>
                    </FormControl>
                    {
                        accountType === "self" ? (
                            <FormControl fullWidth>
                                <InputLabel id="target-account-select-label">To Account</InputLabel>
                                <Select
                                    labelId="target-account-select-label"
                                    id="target-account-select"
                                    value={accountAddress}
                                    label="Target Account"
                                    onChange={(e) => {
                                        setAccountAddress(e.target.value);
                                        console.log(e.target.value);
                                    }}
                                >
                                    {
                                        accounts.map(ac => (
                                            <MenuItem key={ac.identifier}
                                                      value={ac.identifier}>{ac.identifier} ({ac.name})</MenuItem>
                                        ))
                                    }
                                </Select>
                            </FormControl>
                        ) : (
                            <TextField
                                autoFocus
                                margin="dense"
                                id="name"
                                label="Address"
                                type="text"
                                fullWidth
                                variant="standard"
                                value={accountAddress}
                                onChange={(e) => {
                                    setAccountAddress(e.target.value)
                                }}
                            />
                        )
                    }
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Amount"
                        type="number"
                        fullWidth
                        variant="standard"
                        value={amount}
                        onChange={(e) => {
                            if (e.target.value) {
                                setAmount(parseFloat(e.target.value))
                            } else {
                                setAmount(0);
                            }
                        }}
                    />
                </Stack>
                <Typography variant="caption"></Typography>
                <br/>
                <Typography variant="caption" color="red">{errorMessage}</Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={onLocalClose} color="error">Cancel</Button>
                <Button onClick={submitTransferRequest} variant="contained">Transfer</Button>
            </DialogActions>
        </Dialog>
    );
}


const AccountsPage = () => {
    const [accounts, setAccounts] = useState<Account[]>([]);

    const [showCreateAccountDialog, setShowCreateAccountDialog] = useState(false);
    const [transferAccount, setTransferAccount] = useState("");

    const fetchAccounts = () => {
        listAccounts().then(res => {
            const accounts = res.data;
            setAccounts(accounts);
        })
    }

    const onCreateAccountDialogClose = (account?: Account) => {
        if (account) {
            setAccounts(v => {
                v = [...v, account];
                return v;
            })
        }
        setShowCreateAccountDialog(false);
    }

    const createNewAccount = () => {
        setShowCreateAccountDialog(true);
    }

    const openTransferDialog = (identifier: string) => {
        setTransferAccount(identifier);
    }

    const onTransferDialogClose = (transffered?: boolean) => {
        setTransferAccount("");

        if (transffered) {
            fetchAccounts();
        }
    }

    useEffect(() => {
        fetchAccounts()
    }, []);

    return (
        <Box mt={4}>
            <Container>
                <Grid container>
                    <Grid item xs={12} md={8}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6">Accounts</Typography>
                                {
                                    accounts.length === 0 ? (
                                        <Typography>You don't have any accounts!</Typography>
                                    ) : (
                                        <Typography>{accounts.length} Accounts in record</Typography>
                                    )
                                }
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Button
                            variant="contained"
                            size={"large"}
                            fullWidth
                            sx={{
                                height: "100%"
                            }}
                            onClick={createNewAccount}
                        >
                            Create New Accounts
                        </Button>
                    </Grid>
                </Grid>
                <Box mt={4}>
                    <Stack spacing={2} divider={<Divider variant="fullWidth"/>}>
                        {
                            accounts.map(acc => {
                                return (
                                    <Box display="flex" key={acc.identifier}>
                                        <Box flexGrow={1}>
                                            <Typography><b>Account Name: </b>{acc.name}</Typography>
                                            <Typography><b>Address: </b>{acc.identifier}</Typography>
                                            <Typography><b>Balance: </b>{acc.data.balance} HKD</Typography>
                                        </Box>
                                        <Box>
                                            <Button fullWidth sx={{height: "100%"}} onClick={() => {
                                                openTransferDialog(acc.identifier)
                                            }}>Transfer</Button>
                                        </Box>
                                    </Box>
                                )
                            })
                        }
                    </Stack>
                </Box>
            </Container>
            <CreateAccountDialog onClose={onCreateAccountDialogClose} open={showCreateAccountDialog}/>
            <TransferDialog onClose={onTransferDialogClose} transferAccount={transferAccount}/>
        </Box>
    )
}

export default AccountsPage;