import 'preact/debug'
import { h, render } from 'preact'
import { App } from './App'

const rootElement = document.getElementById('root')

if (rootElement) {
  render(<App />, rootElement)
}
