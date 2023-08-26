/// <reference types="react-scripts" />

declare global {
    interface User {
        username: string;
        email?: string;
    }
    interface IUserInfo {
        accessToken: string;
        refreshToken: string;
        userInfo: User;
    }
}
