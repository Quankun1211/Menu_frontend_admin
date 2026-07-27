interface Configuration {
    apiBaseUrl: string;
    storageLocaleKey: string;
    storageThemeKey: string;
    VITE_SOCKET_URL: string
}

const env: Configuration = {
    apiBaseUrl: import.meta.env.VITE_BASE_URL || "",
    storageLocaleKey: import.meta.env.VITE_LOCALE_KEY || "",
    storageThemeKey: import.meta.env.VITE_THEME_KEY || "",
    VITE_SOCKET_URL: import.meta.env.VITE_SOCKET_URL || "",
}

export default env
