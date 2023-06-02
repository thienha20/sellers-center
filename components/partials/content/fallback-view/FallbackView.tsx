import {toAbsoluteUrl} from "../../../../utils/url";
import Image from 'next/image'

export function FallbackView() {
  return (
    <div className='splash-screen'>
      <Image src={toAbsoluteUrl('/media/logos/logo-compact.svg')} alt='Start logo' layout='fill'/>
      <span>Loading ...</span>
    </div>
  )
}
