const TOKEN_KEY = 'bagflow_token'

export const getToken = (): string => localStorage.getItem(TOKEN_KEY) ?? ''
export const setToken = (t: string): void => localStorage.setItem(TOKEN_KEY, t)
export const removeToken = (): void => localStorage.removeItem(TOKEN_KEY)