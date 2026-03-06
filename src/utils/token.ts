import {AsyncStorageUtils} from './AsyncStorageUtils'
import env from "../config/envConfig";

export const setToken = (token: string) => {
    AsyncStorageUtils.save(env.tokenKey, token)
}

export const getToken = () => {
    const token =  AsyncStorageUtils.get(env?.tokenKey)
    return token
}

export const setRefreshToken = (refreshToken: string) => {
    AsyncStorageUtils.save(env.refreshTokenKey, refreshToken)
}

export const getRefreshToken = () => {
    const refreshToken =  AsyncStorageUtils.get(env?.refreshTokenKey)
    return refreshToken
}

export const removeToken = () => {
    AsyncStorageUtils.remove(env.tokenKey)
}

export const removeRefreshToken = () => {
    AsyncStorageUtils.remove(env.refreshTokenKey)
}