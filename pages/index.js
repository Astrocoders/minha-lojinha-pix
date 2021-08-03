import cn from 'classnames'
import { useRouter } from 'next/router'
import { useState } from 'react'

import Button from '@/components/Button'
import { eres } from '@/utils/helpers'

export default function PricingPage({ services, error }) {
  const [billingInterval, setBillingInterval] = useState('month')
  const [priceIdLoading, setPriceIdLoading] = useState()

  if (!services.length || error)
    return (
      <section className="bg-black">
        <div className="max-w-6xl mx-auto py-8 sm:py-24 px-4 sm:px-6 lg:px-8">
          <div className="sm:flex sm:flex-col sm:align-center"></div>
          <p className="text-6xl font-extrabold text-white sm:text-center sm:text-6xl">
            No subscription pricing plans found. Create them in your{' '}
            <a
              className="text-pink underline"
              href="https://dashboard.stripe.com/products"
              rel="noopener noreferrer"
              target="_blank"
            >
              Stripe Dashboard
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
            Serviços Anutrien
          </h1>
          <p className="mt-5 text-xl text-accents-6 sm:text-center sm:text-2xl max-w-2xl m-auto">
            Aqui você escolhe o serviço e nos próximos passos pagamento e
            agendamento
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
                  'rounded-lg shadow-sm divide-y divide-accents-2 bg-primary-2',
                  {
                    'border border-pink': true
                  }
                  // {
                  //   'border border-pink': subscription
                  //     ? service.name === subscription?.prices?.services.name
                  //     : service.name === 'Freelancer'
                  // }
                )}
              >
                <div className="p-6">
                  <h2 className="text-2xl leading-6 font-semibold text-white">
                    {service.name}
                  </h2>
                  <p className="mt-4 text-accents-5">{service.description}</p>
                  <p className="mt-8">
                    <span className="text-5xl font-extrabold white">
                      {priceString}
                    </span>
                  </p>
                  <Button
                    variant="slim"
                    type="button"
                    Component="a"
                    href={`registrar-venda/${service.id}`}
                    disabled={false}
                    loading={priceIdLoading}
                    onClick={() => false}
                    className="mt-8 block w-full rounded-md py-2 text-sm font-semibold text-white text-center hover:bg-gray-900"
                  >
                    Pagar e Agendar
                  </Button>
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
  const credentials = {
    'api-key-secret': process.env.VANNA_SECRET,
    'api-key-id': process.env.VANNA_ID
  }

  const [error, servicesData] = await eres(
    fetch('https://stag-server.reconcilia.app/graphql', {
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        ...credentials
      },
      body: JSON.stringify({
        query: `
        query services {
          me {
            id
            services(first: 20) {
              edges {
                node {
                  id
                  name
                  description
                  price
                }
              }
            }
          }
        }
    `,
        variables: {}
      }),
      method: 'POST'
    }).then((res) => res.json())
  )
  const services = servicesData?.data?.me?.services?.edges.map(({ node }) => ({
    ...node
  }))

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
