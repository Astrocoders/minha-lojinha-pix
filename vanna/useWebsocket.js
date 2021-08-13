import React from 'react'
import * as withAbsintheSocket from "@absinthe/socket";
import {Socket as PhoenixSocket} from "phoenix";

let client = null

export const useWebsocket = () => {
  const [clientS, setClient] = React.useState(client)
  React.useEffect(() => {
    if (client == null) {
      client = withAbsintheSocket.create(
        new PhoenixSocket(process.env.NEXT_PUBLIC_VANNA_API_WS),
      );

      setClient(client)
    }
  })
  return clientS
}

export const useListenToCharge = ({ id }) => {
  const client = useWebsocket()
  const [charge, setCharge] = React.useState(null)

  React.useEffect(() => {
    if(!client) return
    const notifier = withAbsintheSocket.send(
      client,
      {
        operation: `
        subscription ChargeSubscription_ChargeSubscription($id: String!) {
          charge(id: $id) {
            id
            status
            canceledAt
            paidAt
            refundedAt
            expectedOn
          }
        }      
      `,
        variables: {
          id
        }
      },
    )
    const logEvent = eventName => (...args) => console.log(eventName, ...args);

    const updatedNotifier = withAbsintheSocket.observe(client, notifier, {
      onAbort: logEvent("abort"),
      onError: logEvent("error"),
      onStart: logEvent("open"),
      onResult: result => {
        setCharge(result?.data?.charge)
      }
    });
  }, [client])

  return charge
}
