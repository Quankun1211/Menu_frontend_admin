import env from "./envConfig";

export const ApiUrls = {
    apiBaseUrl: env.apiBaseUrl,
    auth: {
        login: "/auth/login",
        logout: "/auth/logout",
        register: "/auth/register",
        refreshToken: "/auth/refresh"
    },
    user: {
        queryProfile: "/user/:$1",
        updateProfile: "/user/update-profile"
    },
    tags: {
        getTags: "/tag"
    }
}