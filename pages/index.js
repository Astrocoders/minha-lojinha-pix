import cn from 'classnames'

import Button from '@/components/Button'
import { getServices } from '../vanna/api'
import Link from 'next/link'

export default function PricingPage({ services, error }) {
  if (!services.length || error)
    return (
      <section className="bg-black">
        <div className="max-w-6xl mx-auto py-8 sm:py-24 px-4 sm:px-6 lg:px-8">
          <div className="sm:flex sm:flex-col sm:align-center"></div>
          <p className="text-6xl font-extrabold text-white sm:text-center sm:text-6xl">
            Nenhum serviço encontrado, crie serviços em
            <a
              className="text-pink underline"
              href="https://conta.vanna.app/servicos"
              rel="noopener noreferrer"
              target="_blank"
            >
              Vanna Dashboard
            </a>
            .
          </p>
        </div>
      </section>
    )

  return (
    <section className="bg-black">
      <div className="max-w-6xl mx-auto py-8 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:flex-col sm:align-center">
          <h1 className="text-4xl font-extrabold text-white sm:text-center sm:text-6xl">
            Serviços e produtos {process.env.NEXT_PUBLIC_SITE_NAME}
          </h1>
          <p className="mt-5 text-xl text-accents-6 sm:text-center sm:text-2xl max-w-2xl m-auto">
            Escolha seu serviço para começar
          </p>
        </div>
        <div className="mt-12 space-y-4 sm:mt-16 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-6 lg:max-w-4xl lg:mx-auto xl:max-w-none xl:mx-0 xl:grid-cols-4">
          {services.map((service) => {
            const priceString = new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: service.price.currency,
              minimumFractionDigits: 2
            }).format(service.price.unit_amount / 100)
            return (
              <div
                key={service.id}
                className={cn(
                  'rounded-lg shadow-sm bg-primary-2 flex flex-col',
                  {
                    'border border-pink': true
                  }
                )}
              >
                <div className="p-6">
                  <h2 className="text-2xl leading-6 font-semibold text-white">
                    {service.name}
                  </h2>
                  <p className="mt-4 text-accents-5">{service.description}</p>
                </div>
                <div className="mt-auto">
                  <p className="mt-8 px-6">
                    <span className="text-3xl font-extrabold white">
                      {priceString}
                    </span>
                  </p>
                  <Link href={`/registrar-venda/${service.id}`}>
                    <Button
                      variant="slim"
                      type="a"
                      Component="a"
                      disabled={false}
                      onClick={() => false}
                      href={`/registrar-venda/${service.id}`}
                      className="mt-8 block w-full rounded-md py-2 text-sm font-semibold text-white text-center hover:bg-gray-900"
                    >
                      Pagar e Continuar
                    </Button>
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// This gets called on every request
export async function getServerSideProps() {
  const [error, services] = await getServices()

  return {
    props: {
      error: error,
      services: services.map((service) => ({
        ...service,
        price: {
          id: service.id,
          unit_amount: service.price,
          currency: 'BRL'
        }
      }))
    }
  }
}
