import Image from 'next/image'
import vanna from "../public/vanna_multiverse.png"

const Logo = ({ className = '', ...props }) => (
  <Image src={vanna} width={100 * 1.78} height={100} { ...props} />
)

export default Logo
