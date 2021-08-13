import Link from 'next/link'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useState, } from 'react'
import QRCode from 'qrcode.react'
import {createCharge} from '../vanna/api'
import Logo from '@/components/Logo'
import { useListenToCharge } from 'vanna/useWebsocket'

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
    return <div>Dados faltando</div>
  }

  const charge = useListenToCharge({id})

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
          {charge?.status === "PAID" ? (
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

  if (!serviceId) {
    return {
      props: {
        error: 'Dados estão faltando'
      }
    }
  }

  const [error, charge] = await createCharge({
    serviceId,
    taxId,
    name,
    email
  })

  console.log(error)

  return {
    props: {
      id: charge.id,
      redirectTo: process.env.REDIRECT_TO,
      error,
      amount: charge.amount,
      emvqrcps: charge?.pixDynamicQrcode?.emvqrcps
    }
  }
}
