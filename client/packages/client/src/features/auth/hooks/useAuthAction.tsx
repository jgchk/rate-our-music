import { useAction } from '../../common/hooks/useAction'
import { login } from '../state/auth'

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export const useLoginAction = () => useAction(login, 'auth/login')
/* eslint-enable @typescript-eslint/explicit-module-boundary-types */
