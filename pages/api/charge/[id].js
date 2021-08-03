import { eres } from '@/utils/helpers'

const chargeHandler = async (req, res) => {
  const credentials = {
    'api-key-secret': process.env.VANNA_SECRET,
    'api-key-id': process.env.VANNA_ID
  }
  const {
    query: { id },
    method
  } = req

  switch (method) {
    case 'GET': {
      const [error, servicesData] = await eres(
        fetch('https://stag-server.reconcilia.app/graphql', {
          headers: {
            accept: 'application/json',
            'content-type': 'application/json',
            ...credentials
          },
          body: JSON.stringify({
            query: `
            query ChargeDetailsQuery($chargeId: ID!) {
              node(id: $chargeId) {
                id
                ... on Charge {
                  status
                }
              }
            }
        `,
            variables: { chargeId: id }
          }),
          method: 'POST'
        }).then((res) => res.json())
      )

      if (error) {
        res.status(404).json({ error: 'Something went wrong' })
      }

      const data = servicesData?.data?.node

      res.status(200).json(data)
      break
    }
    default:
      res.setHeader('Allow', ['GET'])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}

export default chargeHandler
