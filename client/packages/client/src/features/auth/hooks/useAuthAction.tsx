import { useAction } from '../../common/hooks/useAction'
import { login, logout, refresh } from '../state/auth'

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export const useLoginAction = () => useAction(login, 'auth/login')
export const useLogoutAction = () => useAction(logout, 'auth/logout')
export const useRefreshAction = () => useAction(refresh, 'auth/refresh')
/* eslint-enable @typescript-eslint/explicit-module-boundary-types */
