import { create } from "zustand";
import { getToken } from "../utils/token";
import { jwtDecode } from 'jwt-decode'
import { devtools } from "zustand/middleware";
import type { JwtPayload } from "../libs/shared/types/jwt-payload";

export type AppStore = {
    userData: JwtPayload | null
    setUserData: (data: JwtPayload | null) => void
}

export const useAppStore = create<AppStore>()(
    devtools((set) => {
        const token = getToken();
        let initUserData: JwtPayload | null = null;
        
        try {
            if (token) {
                const decoded = jwtDecode(token) as JwtPayload;
                initUserData = decoded;
            }
        } catch (error) {
            initUserData = null;
        }

        return {
            userData: initUserData,
            setUserData: (data: JwtPayload | null) => {
                set((state) => ({
                    userData: data ? { ...state.userData, ...data } : null
                }));
            }
        };
    })
);