import { eres } from '../utils/helpers'

const credentials = {
  'api-key-secret': process.env.VANNA_SECRET,
  'api-key-id': process.env.VANNA_ID
}

const vannaEndpoint = process.env.VANNA_API

export const getServices = async () => {
  const [error, servicesData] = await eres(
    fetch(vannaEndpoint, {
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
            services(first: 1000) {
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

  const services = servicesData?.data?.me?.services?.edges.map(
    (edge) => edge.node
  )
  return [error, services]
}

export const createCharge = async ({ name, email, taxId, serviceId }) => {
  const [customerError, customerData] = await eres(
    fetch(vannaEndpoint, {
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
          taxId: "${taxId.replace(/\D+/g, '')}"
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
    fetch(vannaEndpoint, {
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

  console.log(customerError, chargeError, chargeData)
  return [customerError || chargeError, chargeData?.data?.chargeCreate?.charge]
}
