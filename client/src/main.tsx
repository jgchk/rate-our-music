import { render } from 'preact'
import { App } from './App'

// eslint-disable-next-line unicorn/prefer-query-selector
const rootElement = document.getElementById('root')

if (rootElement) {
  render(<App />, rootElement)
}
