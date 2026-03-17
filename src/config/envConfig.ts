interface Configuration {
    tokenKey: string;
    apiBaseUrl: string;
    refreshTokenKey: string;
    storageLocaleKey: string;
    storageThemeKey: string;
    keycloakUrl: string;
    VITE_SOCKET_URL: string
}

const env: Configuration = {
    tokenKey: import.meta.env.VITE_TOKEN_KEY || "",
    refreshTokenKey: import.meta.env.VITE_REFRESH_TOKEN_KEY || "",
    apiBaseUrl: import.meta.env.VITE_BASE_URL || "",
    storageLocaleKey: import.meta.env.VITE_LOCALE_KEY || "",
    storageThemeKey: import.meta.env.VITE_THEME_KEY || "",
    keycloakUrl: import.meta.env.VITE_KEYCLOAK_URL || "",
    VITE_SOCKET_URL: import.meta.env.VITE_SOCKET_URL || "",
}

export default env