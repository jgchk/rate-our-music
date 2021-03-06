import { FunctionComponent, JSX, h } from 'preact'
import { useMemo } from 'preact/hooks'
import { useRouterContext } from '../router/useRouterContext'

const isModifiedEvent = (event: MouseEvent) =>
  !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey)

export type Props = JSX.HTMLAttributes<HTMLAnchorElement> & {
  onClick?: (event: MouseEvent) => void
}

export const Link: FunctionComponent<Props> = ({ onClick, ...props }) => {
  const { target, href } = props
  const { push } = useRouterContext()

  const wrappedOnClick = useMemo(
    () =>
      href === undefined
        ? onClick
        : (event: MouseEvent) => {
            try {
              if (onClick) onClick(event)
            } catch (error) {
              event.preventDefault()
              throw error
            }

            if (
              !event.defaultPrevented && // onClick prevented default
              event.button === 0 && // ignore everything but left clicks
              (!target || target === '_self') && // let browser handle "target=_blank" etc.
              !isModifiedEvent(event) // ignore clicks with modifier keys
            ) {
              event.preventDefault()
              push(href)
            }
          },
    [href, onClick, push, target]
  )

  return <a onClick={wrappedOnClick} {...props} />
}
