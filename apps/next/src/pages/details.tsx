import React, { useState, useEffect } from 'react'
import Side_Navbar from '../../components/Side_Navbar'
import { useRouter } from 'next/router'
import Pages_buttons from '../../components/Pages_buttons'
import Details from '../../components/Details'
import Links from '../../components/Links'

export default function Result() {
  const [result, setResult] = useState<string>('')

  const router = useRouter()
  const [path, setPath] = useState<string>('')

  useEffect(() => {
    if (!router.isReady) return

    const result = router.query.result as string
    const path = router.pathname as string
    setPath(path)
    setResult(result)
  }, [router.isReady, router.query])

  return (
    <>
      <div className="min-h-screen lg:min-h-full">
        <div className="flex-col bg-[#0F172A] lg:flex lg:flex-row">
          {/* Left Side / Navbar */}
          <Side_Navbar />

          {/* Register */}
          <div className="flex flex-col mt-9 pb-8 lg:mx-8 w-full min-h-screen lg:min-h-full lg:w-3/4 justify-between lg:justify-normal">
            {/* Three button Register, Details, Subdomain / Search Input (hidden mobile) */}
            <div>
              <Pages_buttons result={result} path={path} />

              <Details result={result} />
            </div>

            {/* Links */}
            <div className="flex flex-row lg:hidden w-full justify-center mt-8 gap-8">
              <Links />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
