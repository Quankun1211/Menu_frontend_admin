import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { JwtPayload } from "../libs/shared/types/jwt-payload";

export type AppStore = {
    userData: JwtPayload | null
    setUserData: (data: JwtPayload | null) => void
}

export const useAppStore = create<AppStore>()(
    devtools((set) => {
        return {
            userData: null,
            setUserData: (data: JwtPayload | null) => {
                set((state) => ({
                    userData: data ? { ...state.userData, ...data } : null
                }));
            }
        };
    })
);
