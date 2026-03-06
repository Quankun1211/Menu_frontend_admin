export class AsyncStorageUtils {
    static save(key: string, value: string): void {
        localStorage.setItem(key, value)
    }
    static get(key: string): string | null {
        return localStorage.getItem(key)
    }
    static remove(key: string): void {
        return localStorage.removeItem(key)
    }
}