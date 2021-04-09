import { h, render } from 'preact'
import { App } from './App'

const rootElement = document.createElement('div')
rootElement.id = 'root'
document.body.append(rootElement)

render(<App />, rootElement)
