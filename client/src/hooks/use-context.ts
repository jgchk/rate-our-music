import { Context } from 'preact';
import { useContext as usePreactContext } from 'preact/hooks';

const useContext = <T>(context: Context<T | undefined>): T => {
  const value = usePreactContext(context);
  if (!value) {
    throw new Error('useContext must be inside a Provider with a value');
  }
  return value;
};

export default useContext;
