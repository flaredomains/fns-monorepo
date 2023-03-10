import Head from 'next/head'
import Search from '../../components/Search'

export default function Home() {
  return (
    <>
      <Head>
        <title>FNS</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <div className='min-h-screen'>
        <Search />
      </div>
    </>
  )
}
