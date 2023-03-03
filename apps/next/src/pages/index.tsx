import Head from 'next/head'
import Main from '../../components/Main'


export default function Home() {
  return (
    <>
      <Head>
        <title>FNS</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className='min-h-screen'>
        <Main/>
      </div>
    </>
  )
}
