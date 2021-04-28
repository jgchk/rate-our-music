import { useEffect } from 'preact/hooks'
import { useRefreshAction } from './useAuthAction'

export const useAuthRefresh = (): void => {
  const [refresh] = useRefreshAction()
  useEffect(() => {
    refresh()
  }, [refresh])
}
