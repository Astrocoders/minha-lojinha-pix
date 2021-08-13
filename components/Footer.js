import Link from 'next/link'
import Logo from '@/components/Logo'

export default function Footer() {
  return (
    <footer className="mx-auto max-w-8xl px-6 bg-primary-2">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 border-b border-accents-2 py-12 text-primary transition-colors duration-150 bg-primary-2">
        <div className="col-span-1 lg:col-span-2">
          <Link href="/">
            <a className="flex flex-initial items-center font-bold md:mr-24">
              <span className="rounded-full border border-gray-700 mr-2">
                <Logo />
              </span>
              <span>{process.env.NEXT_PUBLIC_SITE_NAME}</span>
            </a>
          </Link>
        </div>
        <div className="col-span-1 lg:col-span-2">
          <ul className="flex flex-initial flex-col md:flex-1">
            <li className="py-3 md:py-0 md:pb-4">
              <Link href="/">
                <a className="text-primary hover:text-accents-6 transition ease-in-out duration-150">
                  Home
                </a>
              </Link>
            </li>
            <li className="py-3 md:py-0 md:pb-4">
              <a href="https://vanna.app/tarifas" target="_blank">
                <a className="text-primary hover:text-accents-6 transition ease-in-out duration-150">
                  Tarifas
                </a>
              </a>
            </li>
            <li className="py-3 md:py-0 md:pb-4">
              <a href="https://vanna.app/funcionalidades" target="_blank">
                <a className="text-primary hover:text-accents-6 transition ease-in-out duration-150">
                  Funcionalidades
                </a>
              </a>
            </li>
            <li className="py-3 md:py-0 md:pb-4">
              <a href="https://vanna.app/blog" target="_blank">
                <a className="text-primary hover:text-accents-6 transition ease-in-out duration-150">
                  Blog
                </a>
              </a>
            </li>
          </ul>
        </div>
        <div className="col-span-1 lg:col-span-2">
          <ul className="flex flex-initial flex-col md:flex-1">
            <li className="py-3 md:py-0 md:pb-4">
              <p className="text-primary font-bold hover:text-accents-6 transition ease-in-out duration-150">
                LEGAL
              </p>
            </li>
            <li className="py-3 md:py-0 md:pb-4">
              <a
                href="https://vanna.app/politica-privacidade"
                target="_blank"
                className="text-primary hover:text-accents-6 transition ease-in-out duration-150"
              >
                Política de Privacidade
              </a>
            </li>
            <li className="py-3 md:py-0 md:pb-4">
              <a
                href="https://vanna.app/termos-uso"
                target="_blank"
                className="text-primary hover:text-accents-6 transition ease-in-out duration-150"
              >
                Termos de Uso
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="py-12 flex flex-col md:flex-row justify-between items-center space-y-4 bg-primary-2">
        <div>
          <span>&copy; 2021 Vanna Gestão de Pagamentos LTDA.</span>
        </div>
        <div className="flex items-center">
          <span className="text-primary">Feito com</span>
          <a href="https://vercel.com" aria-label="Vercel.com Link">
            <img
              src="/vercel.svg"
              alt="Vercel.com Logo"
              className="inline-block h-6 ml-4 text-primary"
            />
          </a>
        </div>
      </div>
    </footer>
  )
}
