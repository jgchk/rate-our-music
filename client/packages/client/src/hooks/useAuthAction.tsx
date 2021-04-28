import { login, logout, refresh } from '../state/slices/auth'
import { useAction } from './useAction'

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export const useLoginAction = () => useAction(login, 'auth/login')
export const useLogoutAction = () => useAction(logout, 'auth/logout')
export const useRefreshAction = () => useAction(refresh, 'auth/refresh')
/* eslint-enable @typescript-eslint/explicit-module-boundary-types */
