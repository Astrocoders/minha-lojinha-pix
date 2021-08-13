import { useRouter } from 'next/router'
import React, { useState } from 'react'

import Button from '@/components/Button'
import Input from '@/components/Input'
import CpfOrCnpj from '@/components/CpfOrCnpj'
import Logo from '@/components/Logo'

const RegisterSale = () => {
  const router = useRouter()
  const { serviceId } = router.query

  const [taxId, setTaxId] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSignup = (e) => {
    e.preventDefault()
    setLoading(true)

    fetch('/api/charge/create', {
      method: "POST",
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify({
        serviceId,
        taxId,
        name,
        email
      })
    })
      .then((res) => res.json())
      .then(({ charge, error}) => {
        setLoading(false)
        if (error) {
          console.log(error)
          return
        }

        router.replace(`/pagar/${charge.id}`)
      }).catch(() => setLoading(false))
  }

  return (
    <div className="flex justify-center height-screen-helper">
      <div className="flex flex-col justify-between max-w-lg p-3 m-auto w-80 ">
        <div className="flex justify-center pb-12 ">
          <Logo width="64px" height="64px" />
        </div>
        <form onSubmit={handleSignup} className="flex flex-col space-y-4">
          <CpfOrCnpj
            name="taxId"
            value={taxId}
            onChange={(ev, type) => {
              setTaxId(ev.target.value)
            }}
            placeholder="CPF ou CNPJ"
          />
          <Input placeholder="Nome" name="name" onChange={setName} />
          <Input
            type="email"
            placeholder="E-mail"
            onChange={setEmail}
            required
          />
          <div className="pt-2 w-full flex flex-col">
            <Button
              variant="slim"
              type="submit"
              loading={loading}
              onSubmit={handleSignup}
              disabled={
                loading || !email.length || !name.length || !taxId.length
              }
            >
              Registrar meus dados
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default RegisterSale
