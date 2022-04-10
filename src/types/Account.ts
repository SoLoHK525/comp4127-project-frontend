export interface Account {
    identifier: string;
    owner: string;
    name: string;
    data: {
        balance: number;
    }
}