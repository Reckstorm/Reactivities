export interface User{
    username: string;
    displayName: string;
    token: string;
    image?: string;
}

export interface UserLoginForm{
    username?: string;
    displayName?: string;
    email: string;
    password: string;
}