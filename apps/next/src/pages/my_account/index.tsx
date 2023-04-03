import React, { useState, useEffect } from 'react'
import Side_Navbar from '../../../components/Side_Navbar'
import { useRouter } from 'next/router'
import MyAccount from '../../../components/MyAccount'

export default function My_Account() {
  const [setIsConnect] = useState(false)
  const [arrSubdomains, setArrSubdomains] = useState([
    { domain: 'neel.flr' },
    { domain: 'chase.flr' },
    { domain: 'ben.flr' },
  ])

  const [result, setResult] = useState<String>('')

  const [path, setPath] = useState<String>('')

  const router = useRouter()

  useEffect(() => {
    if (!router.isReady) return

    const result = router.query.result as String
    const path = router.pathname as String
    setPath(path)
    setResult(result)
  }, [router.isReady])

  return (
    <>
      <div className="min-h-screen">
        <div className="flex-col bg-[#0F172A] lg:flex lg:flex-row">
          {/* Left Side / Navbar */}
          <Side_Navbar />

          {/* Register */}
          <div className="flex-col mt-9 pb-8 lg:mx-8 w-full min-h-screen lg:w-3/4">
            <MyAccount arrSubdomains={arrSubdomains} />
          </div>
        </div>
      </div>
    </>
  )
}
