import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import { useEffect, useState } from "react";

// --- Import Wagmi / Web3Modal ---
import { Web3Modal } from "@web3modal/react";
import {
  EthereumClient,
  w3mConnectors,
  w3mProvider,
} from "@web3modal/ethereum";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { Chain } from "wagmi";

import { flareTestnet } from "wagmi/chains";
// -------------------

// --- Import React Router ---
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// --- Pages ---
import Main from "../../components/pages";
import Register from "../../components/pages/register";
import Details from "../../components/pages/details";
import Subdomains from "../../components/pages/subdomains";
import MyAccount from "../../components/pages/my_account";
import FAQ from "../../components/pages/faq";
import NotFound from "../../components/pages/NotFound";
import Websites from "../../components/pages/websites";
import Personal_Website from "../../components/pages/personal_website";
import Page_Builder from "../../components/pages/page_builder";
// --- --- ---

export const Coston2 = {
  id: 114,
  name: "Coston 2",
  network: "Coston 2 Test Network",
  nativeCurrency: {
    decimals: 18,
    name: "C2FLR",
    symbol: "C2FLR",
  },
  rpcUrls: {
    public: { http: ["https://coston2-api.flare.network/ext/C/rpc"] },
    default: { http: ["https://coston2-api.flare.network/ext/C/rpc"] },
  },
} as const satisfies Chain;

// export const Songbird = {
//   id: 19,
//   name: 'Songbird',
//   network: 'Songbird Canary Network',
//   nativeCurrency: {
//     decimals: 18,
//     name: 'SGB',
//     symbol: 'SGB',
//   },
//   rpcUrls: {
//     public: { http: ['https://songbird-api.flare.network/ext/C/rpc'] },
//     default: { http: ['https://songbird-api.flare.network/ext/C/rpc'] },
//   },
// } as const satisfies Chain

// export const Flare = {
//   id: 14,
//   name: 'Flare',
//   network: 'Flare Network',
//   nativeCurrency: {
//     decimals: 18,
//     name: 'FLR',
//     symbol: 'FLR',
//   },
//   rpcUrls: {
//     public: { http: ['https://flare-api.flare.network/ext/C/rpc'] },
//     default: { http: ['https://flare-api.flare.network/ext/C/rpc'] },
//   },
// } as const satisfies Chain

// 1. Get projectID at https://cloud.walletconnect.com
if (!process.env.WALLET_CONNECT_PROJECT_ID) {
  throw new Error("You need to provide WALLET_CONNECT_PROJECT_ID env variable");
}

const projectId = process.env.WALLET_CONNECT_PROJECT_ID;

// 2. Configure wagmi client
const chains = [Coston2];
const { publicClient } = configureChains(chains, [w3mProvider({ projectId })]);
export const wagmiClient = createConfig({
  autoConnect: true,
  connectors: w3mConnectors({ projectId, chains }),
  publicClient,
});

// 3. Configure modal ethereum client
export const ethereumClient = new EthereumClient(wagmiClient, chains);

function MyApp({ Component, pageProps }: AppProps) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  return (
    <>
      <Head>
        <title>FNS</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {ready ? (
        <WagmiConfig config={wagmiClient}>
          <Router>
            <Routes>
              <Route path="/" element={<Main />} />
              {/* <Route path="/:website" element={<Personal_Website />} /> */}
              <Route path="/my_account" element={<MyAccount />} />
              {/* <Route path="/websites" element={<Websites />} /> */}
              <Route path="/faq" element={<FAQ />} />

              {/* <Route path="/register/:param" element={<Register />} /> */}
              <Route path="/details/:param" element={<Details />} />
              {/* <Route path="/subdomains/:param" element={<Subdomains />} /> */}
              <Route path="/page_builder/:param" element={<Page_Builder />} />
              <Route path="/404" element={<NotFound />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Router>
        </WagmiConfig>
      ) : null}

      <Web3Modal
        themeVariables={{
          "--w3m-background-color": "#F97316",
          "--w3m-accent-color": "#F97316",
        }}
        projectId={projectId}
        ethereumClient={ethereumClient}
      />
    </>
  );
}

export default MyApp;
