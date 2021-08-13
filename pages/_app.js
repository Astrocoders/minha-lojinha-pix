import { useEffect } from 'react'
import '@/assets/main.css'
import '@/assets/chrome-bug.css'

import Layout from '@/components/Layout'

export default function MyApp({ Component, pageProps }) {
  return (
    <div className="bg-primary">
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </div>
  )
}
