import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import { Web3Modal } from '@web3modal/react'
import { EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum'
import { configureChains, createClient, WagmiConfig } from 'wagmi'

import { Chain } from 'wagmi'

export const Flare = {
  id: 14,
  name: 'Flare',
  network: 'Flare Network',
  nativeCurrency: {
    decimals: 18,
    name: 'FLR',
    symbol: 'FLR',
  },
  rpcUrls: {
    public: { http: ['https://flare-api.flare.network/ext/C/rpc'] },
    default: { http: ['https://flare-api.flare.network/ext/C/rpc'] },
  },
} as const satisfies Chain

// 1. Get projectID at https://cloud.walletconnect.com
if (!process.env.WALLET_CONNECT_PROJECT_ID) {
  throw new Error('You need to provide WALLET_CONNECT_PROJECT_ID env variable')
}

const projectId = process.env.WALLET_CONNECT_PROJECT_ID

// 2. Configure wagmi client
const chains = [Flare]
const { provider } = configureChains(chains, [w3mProvider({ projectId })])
export const wagmiClient = createClient({
  autoConnect: true,
  connectors: w3mConnectors({ projectId, version: 1, chains }),
  provider,
})

// 3. Configure modal ethereum client
export const ethereumClient = new EthereumClient(wagmiClient, chains)

function MyApp({ Component, pageProps }: AppProps) {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    setReady(true)
  }, [])

  return (
    <>
      <Head>
        <title>FNS</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {ready ? (
        <WagmiConfig client={wagmiClient}>
          <Component {...pageProps} />
        </WagmiConfig>
      ) : null}

      <Web3Modal
        themeVariables={{
          '--w3m-background-color': '#F97316',
          '--w3m-accent-color': '#F97316',
        }}
        projectId={projectId}
        ethereumClient={ethereumClient}
      />
    </>
  )
}

export default MyApp
