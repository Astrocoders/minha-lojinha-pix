import Link from 'next/link'
import s from './Navbar.module.css'

import Logo from '@/components/Logo'

const Navbar = () => {
  return (
    <nav className={s.root}>
      <a href="#skip" className="sr-only focus:not-sr-only">
        Skip to content
      </a>
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex justify-between align-center flex-row py-4 md:py-6 relative">
          <div className="flex flex-1 items-center">
            <Link href="/">
              <a className={s.logo} aria-label="Logo">
                <Logo />
              </a>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
