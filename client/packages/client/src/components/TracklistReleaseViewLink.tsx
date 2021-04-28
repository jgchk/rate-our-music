import { FunctionComponent, h } from 'preact'
import { CornerUpLeft } from './icons/CornerUpLeft'
import { Link } from './Link'

export type Props = {
  href: string
}

export const ReleaseViewLink: FunctionComponent<Props> = ({ href }) => (
  <Link className={'flex p-3'} href={href}>
    <div className='flex-1'>
      <CornerUpLeft size={20} />
    </div>
    <div className='flex-16 font-medium'>Release View</div>
  </Link>
)
