import {request} from "./base";
import {Auth} from "../types/Auth";
import {User} from "../types/User";

export const login = (username: string, password: string) => {
    return request.post<Auth>('/auth/login', {
        username,
        password
    });
}

export const register = (username: string, password: string) => {
    return request.post<boolean>('/auth/register', {
        username,
        password
    })
}

export const auth = () => {
    return request.get<User>('/auth');
}