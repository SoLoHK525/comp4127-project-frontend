import {User} from "./User";

export interface Auth {
    access_token: string;
    user: User;
}