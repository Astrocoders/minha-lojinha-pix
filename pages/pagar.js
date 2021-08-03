import Link from 'next/link'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useState, useCallback } from 'react'
import QRCode from 'qrcode.react'
import { eres } from '@/utils/helpers'

import Logo from '@/components/Logo'

const Purchase = ({
  id,
  amount,
  emvqrcps,
  error,
  redirectTo = 'https://vanna.app'
}) => {
  const router = useRouter()
  const { name = '' } = router.query

  if (error || !id) {
    return <div>Caca</div>
  }
  const [isPaid, setIsPaid] = useState(false)

  useEffect(() => {
    let timerIntervalId
    let timerTimeoutId
    const loadData = async () => {
      const [error, result] = await eres(
        fetch(`/api/charge/${id}`).then((res) => res.json())
      )
      if (result.status === 'PAID') {
        setIsPaid(true)
        clearInterval(timerIntervalId)
        timerTimeoutId = setTimeout(() => router.replace(redirectTo), 3000)
      }
    }

    timerIntervalId = setInterval(loadData, 1000 * 2)

    return () => {
      clearInterval(timerIntervalId)
      clearTimeout(timerTimeoutId)
    }
  }, [])

  const priceString = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2
  }).format(amount / 100)

  return (
    <>
      <Head>
        <title>Pagamento</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <div className="flex flex-col justify-center height-screen-helper">
        <div className="flex flex-col justify-between max-w-lg p-3 m-auto">
          <div className="flex justify-center pb-12 ">
            <Logo width="64px" height="64px" />
          </div>
          {isPaid ? (
            <div className="flex flex-col justify-center items-center">
              <p className="text-2xl">Pagamento efetuado com sucesso!</p>
              <p className="text-1xl">
                Aguarde, você será redirecionado para o agendamento...
              </p>
            </div>
          ) : (
            <div className="flex flex-col justify-center items-center">
              <p className="text-4xl">
                {name.split(' ')[0]}, pague usando o Pix!
              </p>
              <p className="text-2xl leading-6 font-bold mt-10 mb-10">
                {priceString}
              </p>
              <QRCode value={emvqrcps} size={320} />
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default Purchase

// This gets called on every request
export async function getServerSideProps({ query }) {
  const { serviceId, taxId, name, email } = query

  const credentials = {
    'api-key-secret': process.env.VANNA_SECRET,
    'api-key-id': process.env.VANNA_ID
  }

  if (!serviceId) {
    return {
      props: {
        error: 'caca'
      }
    }
  }

  const [customerError, customerData] = await eres(
    fetch('https://stag-server.reconcilia.app/graphql', {
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        ...credentials
      },
      body: JSON.stringify({
        query: `
      mutation CustomerCreateMutation {
        customerCreate(input: {
          typeOfPeople: ${taxId > 12 ? 'LEGAL' : 'NATURAL'},
          email: "${email}",
          name: "${name}",
          taxId: "${taxId.replace(/\.|\-|\//g, '')}"
        }) {
          error {
            message
          }
          customer {
            id
          } 
        }
      }
    `,
        variables: {}
      }),
      method: 'POST'
    }).then((res) => res.json())
  )

  const dueDateRaw = new Date()
  dueDateRaw.setHours(dueDateRaw.getHours() + 1)
  const date = new Date().toISOString()
  const dueDate = dueDateRaw.toISOString()

  const [chargeError, chargeData] = await eres(
    fetch('https://stag-server.reconcilia.app/graphql', {
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        ...credentials
      },
      body: JSON.stringify({
        query: `
      mutation ChargeCreateMutation($input: ChargeCreateInput!) {
        chargeCreate(input: $input) {
          error {
            message
          }
          charge {
            id
            amount
            pixDynamicQrcode {
              emvqrcps
            }
          }
        }
      }
    `,
        variables: {
          input: {
            customerId: customerData?.data?.customerCreate?.customer?.id,
            description: `Agendamento para ${name}`,
            date,
            dueDate,
            items: [
              {
                discountAmount: 0,
                freightAmount: 0,
                insuranceAmount: 0,
                itemId: serviceId,
                othersAmount: 0,
                quantity: 1
              }
            ],
            paymentMethod: 'PIX'
          }
        }
      }),
      method: 'POST'
    }).then((res) => res.json())
  )

  const charge = chargeData?.data?.chargeCreate?.charge

  return {
    props: {
      id: charge.id,
      redirectTo: process.env.REDIRECT_TO,
      error: customerError || chargeError,
      amount: charge.amount,
      emvqrcps: charge?.pixDynamicQrcode?.emvqrcps
    }
  }
}
