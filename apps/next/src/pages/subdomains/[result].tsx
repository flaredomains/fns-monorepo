import React, { useState, useEffect } from 'react'
import Side_Navbar from '../../../components/Side_Navbar'
import { useRouter } from 'next/router'
import Pages_buttons from '../../../components/Pages_buttons'
import Subdomains from '../../../components/Subdomains'

export default function Result() {
  // Change to Wagmi data about user subdomain
  const [arrSubdomains, setArrSubdomains] = useState([[1], [2], [3]])

  const [result, setResult] = useState<String>('')

  const [path, setPath] = useState<String>('')

  const router = useRouter()

  useEffect(() => {
    if (!router.isReady) return

    const result = router.query.result as String
    const path = router.pathname as String
    setPath(path)
    setResult(result)
  }, [router.isReady, router.query])

  return (
    <>
      <div className="min-h-screen w-screen">
        <div className="flex-col bg-[#0F172A] lg:flex lg:flex-row">
          {/* Left Side / Navbar */}
          <Side_Navbar />

          {/* Register */}
          <div className="flex-col mt-9 pb-8 lg:mx-8 w-full min-h-screen">
            {/* Three button Register, Details, Subdomain / Search Input (hidden mobile) */}
            <Pages_buttons result={result} path={path} />

            <Subdomains result={result} arrSubdomains={arrSubdomains} />
          </div>
        </div>
      </div>
    </>
  )
}
