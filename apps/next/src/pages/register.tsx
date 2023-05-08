import React, { useState, useEffect } from 'react'
import Register from '../../components/Register'
import Side_Navbar from '../../components/Side_Navbar'
import { useRouter } from 'next/router'
import Pages_buttons from '../../components/Pages_buttons'

export default function Result() {
  const [result, setResult] = useState<string>('')
  const [path, setPath] = useState<String>('')

  const router = useRouter()

  useEffect(() => {
    if (!router.isReady) return

    const result = router.query.result as string
    const path = router.pathname as String
    setPath(path)
    setResult(result)
  }, [router.isReady, router.query])

  return (
    <>
      <div className="min-h-full">
        <div className="flex-col w-full bg-[#0F172A] lg:flex lg:flex-row">
          {/* Left Side / Navbar */}
          <Side_Navbar />

          {/* Register */}
          <div className="flex-col w-full mt-9 pb-8 lg:mx-8 min-h-full lg:w-3/4">
            {/* Three button Register, Details, Subdomain / Search Input (hidden mobile) */}
            <Pages_buttons result={result} path={path} />

            <Register result={result} />
          </div>
        </div>
      </div>
    </>
  )
}
