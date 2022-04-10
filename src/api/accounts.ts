import {request} from "./base";
import {Account} from "../types/Account";

export const createAccount = (name: string) => {
    return request.post<Account>("/account/create", {
        name
    });
}

export const listAccounts = () => {
    return request.get<Account[]>("/account")
}

export const transfer = (sender_id: string, receiver_id: string, amount: number) => {
    return request.post("/account/transfer", {
        sender_id,
        receiver_id,
        amount
    })
}