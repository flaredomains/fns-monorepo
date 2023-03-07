import React, { useState, useEffect } from 'react'
import Register from '../../../components/Register'
import Side_Navbar from '../../../components/Side_Navbar'
import { useRouter } from 'next/router'
import Pages_buttons from '../../../components/Pages_buttons'
import Details from '../../../components/Details'

export default function Result() {
  const [available, setAvailable] = useState(true)
  const [isConnect, setIsConnect] = useState(false)

  const [result, setResult] = useState<String>('')

  const router = useRouter()
  const [path, setPath] = useState<String>('')

  useEffect(() => {
    if (!router.isReady) return

    // Get the poll from the query --> http://localhost:3000/viewPoll/[id] <--
    const result = router.query.result as String
    const path = router.pathname as String
    setPath(path)
    setResult(result)
  }, [router.isReady])

  return (
    <>
      <div className='min-h-screen w-screen'>
        <div className='flex-col bg-[#0F172A] lg:flex lg:flex-row'>
          {/* Left Side / Navbar */}
          <Side_Navbar />

          {/* Register */}
          <div className='flex-col mt-9 pb-8 lg:mx-8 w-full min-h-screen'>
            {/* Three button Register, Details, Subdomain / Search Input (hidden mobile) */}
            <Pages_buttons result={result} path={path} />

            <Details
              available={available}
              isConnect={isConnect}
              result={result}
            />
          </div>
        </div>
      </div>
    </>
  )
}
