/* eslint-disable react/no-unknown-property */

import { FunctionalComponent, h } from 'preact'
import { FeatherProps } from './types'

export const StarEmpty: FunctionalComponent<FeatherProps> = ({
  color = 'currentColor',
  size = 24,
  ...props
}: FeatherProps) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    viewBox='0 0 576 512'
    width={size}
    height={size}
    {...props}
  >
    <path
      fill={color}
      d='M528.1 171.5L382 150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0L194 150.2 47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 103-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5 105.7-103c19-18.5 8.5-50.8-17.7-54.6zM388.6 312.3l23.7 138.4L288 385.4l-124.3 65.3 23.7-138.4-100.6-98 139-20.2 62.2-126 62.2 126 139 20.2-100.6 98z'
      class=''
    />
  </svg>
)

export const StarHalf: FunctionalComponent<FeatherProps> = ({
  color = 'currentColor',
  size = 24,
  ...props
}: FeatherProps) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    viewBox='0 0 576 512'
    width={size}
    height={size}
    {...props}
  >
    <path
      fill={color}
      d='M528.1 171.5L382 150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0L194 150.2 47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 103-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5 105.7-103c19-18.5 8.5-50.8-17.7-54.6zM388.6 312.3l23.7 138.4L288 385.4l-124.3 65.3 23.7-138.4-100.6-98 139-20.2 62.2-126 62.2 126 139 20.2-100.6 98z'
      class=''
    />
    <path
      fill={color}
      d='M288 0c-11.4 0-22.8 5.9-28.7 17.8L194 150.2 47.9 171.4c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 103-25 145.5c-4.5 26.1 23 46 46.4 33.7L288 439.6V0z'
      class=''
    />
  </svg>
)

export const StarFull: FunctionalComponent<FeatherProps> = ({
  color = 'currentColor',
  size = 24,
  ...props
}: FeatherProps) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    viewBox='0 0 576 512'
    width={size}
    height={size}
    {...props}
  >
    <path
      fill={color}
      d='M259.3 17.8L194 150.2 47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 103-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5 105.7-103c19-18.5 8.5-50.8-17.7-54.6L382 150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0z'
      class=''
    />
  </svg>
)
